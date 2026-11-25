import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-secured-home-page',
  templateUrl: './home-page.html',
})
export class SecuredHomePage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly enteredAt = Date.now();

  protected readonly elapsedSeconds = signal(0);

  constructor() {
    const timer = setInterval(() => {
      this.elapsedSeconds.set(Math.floor((Date.now() - this.enteredAt) / 1_000));
    }, 1_000);

    this.destroyRef.onDestroy(() => clearInterval(timer));
  }
}
