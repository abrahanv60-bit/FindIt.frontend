import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ObjetosService } from '../../services/objetos.service';
import { NuevoObjeto } from '../../models/nuevo-objeto';

@Component({
  selector: 'app-publicar-objeto',
  imports: [FormsModule, RouterLink],
  templateUrl: './publicar-objeto.html',
  styleUrl: './publicar-objeto.css',
})
export class PublicarObjeto {
  private servicio = inject(ObjetosService);

  objeto: NuevoObjeto = {
    titulo: '',
    descripcion: '',
    tipo: '',
    ubicacion: '',
  };

  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

  publicar() {
    this.mensaje.set('');
    this.error.set('');
    this.cargando.set(true);

    this.servicio.crearObjeto(this.objeto).subscribe({
      next: () => {
        this.mensaje.set('Objeto publicado correctamente');

        this.objeto = {
          titulo: '',
          descripcion: '',
          tipo: '',
          ubicacion: '',
        };

        this.cargando.set(false);
      },

      error: (err) => {
        this.error.set(
          err.status === 401 ? 'Debes iniciar sesión para publicar' : 'Error al publicar el objeto',
        );

        this.cargando.set(false);
      },
    });
  }
}
