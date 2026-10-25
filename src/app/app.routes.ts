import { Routes } from '@angular/router';
import { Objetos } from './components/objetos/objetos';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { PublicarObjeto } from './components/publicar-objeto/publicar-objeto';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Objetos },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  {
    path: 'publicar',
    component: PublicarObjeto,
    canActivate: [authGuard],
  },
];
