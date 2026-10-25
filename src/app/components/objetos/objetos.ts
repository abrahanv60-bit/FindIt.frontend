import { Component, inject, signal, afterNextRender } from '@angular/core';
import { ObjetosService } from '../../services/objetos.service';
import { Objeto } from '../../models/objeto';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NuevoObjeto } from '../../models/nuevo-objeto';

@Component({
  selector: 'app-objetos',
  imports: [FormsModule],
  templateUrl: './objetos.html',
  styleUrl: './objetos.css',
})
export class Objetos {
  private servicio = inject(ObjetosService);

  objetos = signal<Objeto[]>([]);
  cargando = signal(true);
  error = signal('');
  auth = inject(AuthService);
  eliminandoId = signal<number | null>(null);
  objetoEditandoId = signal<number | null>(null);
  guardando = signal(false);

  formularioEdicion: NuevoObjeto & { estado: string } = {
    titulo: '',
    descripcion: '',
    tipo: '',
    ubicacion: '',
    estado: 'Disponible',
  };

  constructor() {
    afterNextRender(() => {
      this.servicio.obtenerObjetos().subscribe({
        next: (datos) => {
          this.objetos.set(datos);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('Error al cargar los objetos');
          this.cargando.set(false);
        },
      });
    });
  }

  eliminarObjeto(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta publicación?')) {
      return;
    }

    this.eliminandoId.set(id);

    this.servicio.eliminarObjeto(id).subscribe({
      next: () => {
        this.objetos.update((lista) => lista.filter((objeto) => objeto.id !== id));

        this.eliminandoId.set(null);
      },

      error: () => {
        alert('No se pudo eliminar el objeto');
        this.eliminandoId.set(null);
      },
    });
  }

  editarObjeto(objeto: Objeto) {
    this.objetoEditandoId.set(objeto.id);

    this.formularioEdicion = {
      titulo: objeto.titulo,
      descripcion: objeto.descripcion,
      tipo: objeto.tipo,
      ubicacion: objeto.ubicacion,
      estado: objeto.estado,
    };
  }

  cancelarEdicion() {
    this.objetoEditandoId.set(null);
  }

  guardarEdicion() {
    const id = this.objetoEditandoId();

    if (id === null || this.guardando()) return;

    const datos = { ...this.formularioEdicion };

    if (!datos.titulo.trim() || !datos.descripcion.trim() || !datos.ubicacion.trim()) {
      alert('Completa todos los campos');
      return;
    }

    this.guardando.set(true);

    this.servicio.editarObjeto(id, datos).subscribe({
      next: () => {
        this.objetos.update((lista) =>
          lista.map((objeto) => (objeto.id === id ? { ...objeto, ...datos } : objeto)),
        );

        this.objetoEditandoId.set(null);
        this.guardando.set(false);
      },

      error: () => {
        alert('Error al editar el objeto');
        this.guardando.set(false);
      },
    });
  }
}
