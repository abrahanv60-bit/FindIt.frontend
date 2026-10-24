import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface RespuestaLogin {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  usuarioActual = signal<Usuario | null>(null);

  login(email: string, password: string) {
    return this.http.post<RespuestaLogin>('/api/auth/login', { email, password });
  }

  registrar(nombre: string, email: string, password: string) {
    return this.http.post('/api/auth/registro', { nombre, email, password });
  }

  guardarSesion(respuesta: RespuestaLogin) {
    sessionStorage.setItem('token', respuesta.token);
    sessionStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

    this.usuarioActual.set(respuesta.usuario);
  }

  recuperarSesion() {
    const token = sessionStorage.getItem('token');
    const usuario = sessionStorage.getItem('usuario');

    if (token && usuario) {
      try {
        this.usuarioActual.set(JSON.parse(usuario) as Usuario);
      } catch {
        this.cerrarSesion();
      }
    }
  }

  cerrarSesion() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    this.usuarioActual.set(null);
  }
}
