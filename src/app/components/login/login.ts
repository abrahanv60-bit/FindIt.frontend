import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

  iniciarSesion() {
    this.error.set('');
    this.mensaje.set('');
    this.cargando.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: (respuesta) => {
        this.auth.guardarSesion(respuesta);

        this.mensaje.set('Bienvenido, ' + respuesta.usuario.nombre);

        this.cargando.set(false);

        // Redirigir a la página principal
        this.router.navigate(['/']);
      },

      error: (err) => {
        this.error.set(
          err.status === 401
            ? 'Correo o contraseña incorrectos'
            : 'Error al conectar con el servidor',
        );

        this.cargando.set(false);
      },
    });
  }
}
