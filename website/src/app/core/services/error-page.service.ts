import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ErrorPageService {
  private readonly router = inject(Router);

  navigateTo(code: number): Promise<boolean> {
    return this.router.navigate(['/error', code]);
  }
}
