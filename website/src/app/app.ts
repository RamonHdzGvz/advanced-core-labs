import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToastOutletComponent } from '@shared/organisms/theme-toast-outlet/theme-toast-outlet';
import { ThemeMessageDialogComponent } from '@shared/organisms/theme-message-dialog/theme-message-dialog';
import { ThemeLoadingOverlayComponent } from '@shared/organisms/theme-loading-overlay/theme-loading-overlay';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    ThemeToastOutletComponent,
    ThemeMessageDialogComponent,
    ThemeLoadingOverlayComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
