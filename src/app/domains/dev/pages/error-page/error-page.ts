import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-page',
  imports: [ButtonModule, RouterLink],
  templateUrl: './error-page.html',
  styleUrl: './error-page.css',
})
export class ErrorPage {
  code!: number;
  title!: string;
  description!: string;
  ready = false;
  private router = inject(Router);

  constructor() {
    const nav = this.router.currentNavigation();
    if (nav?.extras.state) {
      this.code = nav.extras.state['code'];
      this.title = nav.extras.state['title'];
      this.description = nav.extras.state['description'];
    } else {
      this.code = 404;
      this.title = 'Página No Encontrada';
      this.description = 'Lo sentimos. La página que está buscando no se encuentra disponible o no existe.';
    }
    setTimeout(() => {
      this.ready = true;
    }, 0);
  }
}
