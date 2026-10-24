import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Objeto } from '../models/objeto';
import { NuevoObjeto } from '../models/nuevo-objeto';

@Injectable({
  providedIn: 'root',
})
export class ObjetosService {
  private http = inject(HttpClient);

  obtenerObjetos() {
    return this.http.get<Objeto[]>('/api/objetos');
  }

  crearObjeto(datos: NuevoObjeto) {
    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Objeto>('/api/objetos', datos, { headers });
  }
}
