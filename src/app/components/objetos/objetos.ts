import { Component, inject, signal, afterNextRender } from '@angular/core';
import { ObjetosService } from '../../services/objetos.service';
import { Objeto } from '../../models/objeto';

@Component({
  selector: 'app-objetos',
  imports: [],
  templateUrl: './objetos.html',
  styleUrl: './objetos.css',
})
export class Objetos {
  private servicio = inject(ObjetosService);

  objetos = signal<Objeto[]>([]);
  cargando = signal(true);
  error = signal('');

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
}
