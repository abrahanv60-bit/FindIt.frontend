import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private auth = inject(AuthService);

  nombre = '';
  email = '';
  password = '';

  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

  registrar() {
    this.mensaje.set('');
    this.error.set('');
    this.cargando.set(true);

    this.auth.registrar(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.mensaje.set('Cuenta creada correctamente');
        this.password = '';
        this.cargando.set(false);
      },

      error: (err) => {
        if (err.status === 409) {
          this.error.set('El correo ya está registrado');
        } else {
          this.error.set('No se pudo registrar el usuario');
        }

        this.cargando.set(false);
      },
    });
  }
}
