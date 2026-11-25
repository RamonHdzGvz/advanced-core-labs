import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { Session } from '@supabase/supabase-js';
import { APP_CONFIG } from '@config/app-config';
import { SupabaseClientService } from '@core/services/supabase/supabase-client.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseClientService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly config = inject(APP_CONFIG);
  private readonly sessionReady: Promise<void>;
  private lastActivityAt = 0;
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;
  private isExpiring = false;
  private activityListenersInstalled = false;

  private readonly onUserActivity = (): void => {
    if (!this.session()) {
      return;
    }

    const now = Date.now();
    if (now - this.getLastActivityAt() >= this.config.auth.inactivityTimeoutMs) {
      this.expireSession();
      return;
    }

    this.recordActivity(now);
  };

  private readonly onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      this.checkSessionExpiry();
    }
  };

  private readonly onStorageChange = (event: StorageEvent): void => {
    if (event.key !== this.config.auth.lastActivityStorageKey || !event.newValue) {
      return;
    }

    const timestamp = Number(event.newValue);
    if (!Number.isFinite(timestamp)) {
      return;
    }

    if (Date.now() - timestamp >= this.config.auth.inactivityTimeoutMs) {
      this.expireSession();
      return;
    }

    this.lastActivityAt = timestamp;
    this.scheduleExpiry();
  };

  readonly isConfigured = this.supabase.isConfigured;
  readonly session = signal<Session | null>(null);
  readonly isLoading = signal(true);

  constructor() {
    if (!this.isConfigured) {
      this.isLoading.set(false);
      this.sessionReady = Promise.resolve();
      return;
    }

    const client = this.supabase.getClient();
    const { data } = client.auth.onAuthStateChange((event, session) => {
      this.session.set(session);
      this.isLoading.set(false);

      if (event === 'SIGNED_IN' && session) {
        this.beginSessionActivity();
      } else if (event === 'SIGNED_OUT' || !session) {
        this.stopSessionActivity();
        if (event === 'SIGNED_OUT' && !this.router.url.endsWith('/login')) {
          void this.router.navigateByUrl('/login');
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      data.subscription.unsubscribe();
      this.stopSessionActivity();
    });
    this.sessionReady = this.restoreSession();
  }

  async waitForSessionReady(): Promise<void> {
    await this.sessionReady;
  }

  isAuthenticated(): boolean {
    return this.session()?.user !== undefined;
  }

  async signIn(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.getClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    this.session.set(data.session);
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.getClient().auth.signOut({ scope: 'local' });
    if (error) {
      throw error;
    }

    this.session.set(null);
    this.stopSessionActivity();
  }

  async updateAvatarUrl(avatarUrl: string): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('Inicia sesión para actualizar tu foto de perfil.');
    }

    const { data, error } = await this.supabase
      .getClient()
      .auth.updateUser({ data: { avatar_url: avatarUrl } });

    if (error) {
      throw error;
    }

    this.session.update((current) => (current ? { ...current, user: data.user } : current));
  }

  private async restoreSession(): Promise<void> {
    try {
      const { data, error } = await this.supabase.getClient().auth.getSession();
      if (error) {
        throw error;
      }

      this.session.set(data.session);
      if (data.session) {
        this.restoreSessionActivity();
      }
    } catch {
      this.session.set(null);
      this.stopSessionActivity();
    } finally {
      this.isLoading.set(false);
    }
  }

  private restoreSessionActivity(): void {
    const lastActivityAt = this.readStoredActivity();
    const now = Date.now();

    if (lastActivityAt !== null && now - lastActivityAt >= this.config.auth.inactivityTimeoutMs) {
      this.expireSession();
      return;
    }

    // Reloading the app within the active window counts as activity and renews the idle window.
    this.beginSessionActivity();
  }

  private beginSessionActivity(): void {
    this.installActivityListeners();
    this.recordActivity(Date.now());
  }

  private recordActivity(timestamp: number): void {
    this.lastActivityAt = timestamp;
    try {
      localStorage.setItem(this.config.auth.lastActivityStorageKey, String(timestamp));
    } catch {
      // The in-memory timer still protects the current tab when storage is unavailable.
    }
    this.scheduleExpiry();
  }

  private scheduleExpiry(): void {
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
    }

    const remaining = Math.max(
      0,
      this.config.auth.inactivityTimeoutMs - (Date.now() - this.getLastActivityAt()),
    );
    this.expiryTimer = setTimeout(() => this.checkSessionExpiry(), remaining);
  }

  private checkSessionExpiry(): void {
    if (!this.session()) {
      return;
    }

    if (Date.now() - this.getLastActivityAt() >= this.config.auth.inactivityTimeoutMs) {
      this.expireSession();
      return;
    }

    this.scheduleExpiry();
  }

  private getLastActivityAt(): number {
    const storedActivity = this.readStoredActivity();
    if (storedActivity !== null) {
      this.lastActivityAt = Math.max(this.lastActivityAt, storedActivity);
    }
    return this.lastActivityAt;
  }

  private readStoredActivity(): number | null {
    try {
      const value = localStorage.getItem(this.config.auth.lastActivityStorageKey);
      if (!value) {
        return null;
      }

      const timestamp = Number(value);
      return Number.isFinite(timestamp) ? timestamp : null;
    } catch {
      return null;
    }
  }

  private installActivityListeners(): void {
    if (this.activityListenersInstalled || typeof window === 'undefined') {
      return;
    }

    window.addEventListener('pointerdown', this.onUserActivity, { passive: true });
    window.addEventListener('keydown', this.onUserActivity);
    window.addEventListener('scroll', this.onUserActivity, { passive: true });
    window.addEventListener('touchstart', this.onUserActivity, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    window.addEventListener('storage', this.onStorageChange);
    this.activityListenersInstalled = true;
  }

  private stopSessionActivity(): void {
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }

    this.lastActivityAt = 0;
    try {
      localStorage.removeItem(this.config.auth.lastActivityStorageKey);
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }

    if (!this.activityListenersInstalled || typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('pointerdown', this.onUserActivity);
    window.removeEventListener('keydown', this.onUserActivity);
    window.removeEventListener('scroll', this.onUserActivity);
    window.removeEventListener('touchstart', this.onUserActivity);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('storage', this.onStorageChange);
    this.activityListenersInstalled = false;
  }

  private expireSession(): void {
    if (this.isExpiring || !this.session()) {
      return;
    }

    this.isExpiring = true;
    this.stopSessionActivity();
    this.session.set(null);
    this.isLoading.set(false);

    void (async () => {
      try {
        await this.supabase.getClient().auth.signOut({ scope: 'local' });
      } catch {
        // The local app session is cleared even if Supabase is temporarily unreachable.
      } finally {
        this.isExpiring = false;
        void this.router.navigateByUrl('/login');
      }
    })();
  }
}
