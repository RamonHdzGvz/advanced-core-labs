import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/supabase/auth.service';
import { LoginCredentials, LoginForm } from '@shared/organisms/login-form/login-form';

@Component({
  standalone: true,
  imports: [LoginForm],
  selector: 'app-secured-login-page',
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isSupabaseConfigured = this.auth.isConfigured;
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected async signIn(credentials: LoginCredentials): Promise<void> {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      await this.auth.signIn(credentials.email, credentials.password);
      await this.router.navigateByUrl(this.getReturnUrl());
    } catch {
      this.errorMessage.set(
        'No fue posible iniciar sesión. Verifica tus datos e inténtalo de nuevo.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/';
  }
}
