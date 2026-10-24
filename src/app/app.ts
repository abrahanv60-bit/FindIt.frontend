import { Component, inject, afterNextRender } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    afterNextRender(() => {
      this.auth.recuperarSesion();
    });
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
