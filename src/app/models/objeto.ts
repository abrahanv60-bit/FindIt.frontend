export interface Objeto {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  ubicacion: string;
  estado: string;
  fechaPublicacion: string;
  usuarioId: number | null;
}
