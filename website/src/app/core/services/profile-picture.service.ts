import { Injectable, inject } from '@angular/core';
import { AuthService } from '@core/services/supabase/auth.service';

@Injectable({ providedIn: 'root' })
export class ProfilePictureService {
  private readonly auth = inject(AuthService);

  async saveAvatarUrl(url: string): Promise<void> {
    await this.auth.updateAvatarUrl(url);
  }
}
