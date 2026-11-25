import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/supabase/auth.service';
import { ProfilePictureUploaderComponent } from '@shared/organisms/profile-picture-uploader/profile-picture-uploader';

@Component({
  standalone: true,
  imports: [ProfilePictureUploaderComponent, RouterLink],
  selector: 'app-secured-profile-page',
  templateUrl: './profile-page.html',
})
export class SecuredProfilePage {
  private readonly auth = inject(AuthService);

  protected readonly email = computed(() => this.auth.session()?.user.email ?? 'Sin correo');
  protected readonly avatarUrl = computed(() => {
    const url = this.auth.session()?.user.user_metadata['avatar_url'];
    return typeof url === 'string' ? url : null;
  });
}
