import { Component, inject } from '@angular/core';
import { ToastService } from '@core/services/toast.service';
import { ThemeAlertComponent } from '@shared/molecules/theme-alert/theme-alert';

@Component({
  selector: 'app-theme-toast-outlet',
  standalone: true,
  imports: [ThemeAlertComponent],
  templateUrl: './theme-toast-outlet.html',
})
export class ThemeToastOutletComponent {
  protected readonly toastService = inject(ToastService);
}
