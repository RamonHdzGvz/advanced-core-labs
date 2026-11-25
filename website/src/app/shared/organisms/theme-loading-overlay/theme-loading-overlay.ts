import { Component, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-theme-loading-overlay',
  standalone: true,
  templateUrl: './theme-loading-overlay.html',
})
export class ThemeLoadingOverlayComponent {
  protected readonly loadingService = inject(LoadingService);
}
