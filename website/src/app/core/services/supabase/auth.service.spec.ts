import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_CONFIG } from '@config/app-config';
import { AuthService } from '@core/services/supabase/auth.service';
import { SupabaseClientService } from '@core/services/supabase/supabase-client.service';

describe('AuthService inactivity expiration', () => {
  const inactivityTimeoutMs = 100;
  const storageKey = 'auth-service-test.last-activity';
  const session = { user: { id: 'test-user' } } as Session;

  let authClient: {
    onAuthStateChange: ReturnType<typeof vi.fn>;
    getSession: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
  };
  let router: { url: string; navigateByUrl: ReturnType<typeof vi.fn> };
  let authService: AuthService;

  async function configureAuthService(): Promise<void> {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        {
          provide: SupabaseClientService,
          useValue: { isConfigured: true, getClient: () => ({ auth: authClient }) },
        },
        {
          provide: APP_CONFIG,
          useValue: {
            auth: { inactivityTimeoutMs, lastActivityStorageKey: storageKey },
          },
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    await authService.waitForSessionReady();
  }

  beforeEach(async () => {
    vi.useFakeTimers();
    localStorage.removeItem(storageKey);

    authClient = {
      onAuthStateChange: vi.fn(
        (callback: (event: AuthChangeEvent, value: Session | null) => void) => {
          callback('INITIAL_SESSION', session);
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        },
      ),
      getSession: vi.fn().mockResolvedValue({ data: { session }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    };
    router = {
      url: '/secured/',
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    await configureAuthService();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.removeItem(storageKey);
    vi.useRealTimers();
  });

  it('signs out and redirects when the injected inactivity limit expires', async () => {
    expect(authService.isAuthenticated()).toBe(true);

    await vi.advanceTimersByTimeAsync(inactivityTimeoutMs - 1);
    expect(authService.isAuthenticated()).toBe(true);

    await vi.advanceTimersByTimeAsync(1);

    expect(authService.isAuthenticated()).toBe(false);
    expect(authClient.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('renews the inactivity limit after user activity', async () => {
    await vi.advanceTimersByTimeAsync(60);
    window.dispatchEvent(new Event('pointerdown'));

    await vi.advanceTimersByTimeAsync(60);
    expect(authService.isAuthenticated()).toBe(true);

    await vi.advanceTimersByTimeAsync(40);

    expect(authService.isAuthenticated()).toBe(false);
    expect(authClient.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });

  it('renews the inactivity limit when the app reloads before expiration', async () => {
    await vi.advanceTimersByTimeAsync(80);
    const previousActivity = localStorage.getItem(storageKey);
    expect(previousActivity).not.toBeNull();

    TestBed.resetTestingModule();
    localStorage.setItem(storageKey, previousActivity!);
    await configureAuthService();

    await vi.advanceTimersByTimeAsync(80);
    expect(authService.isAuthenticated()).toBe(true);

    await vi.advanceTimersByTimeAsync(20);

    expect(authService.isAuthenticated()).toBe(false);
    expect(authClient.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });
});
