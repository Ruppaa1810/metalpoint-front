export interface Categoria {
  id: number;
  nombre: string;
  categoria_padre_id?: number | null;
  categoria_padre?: Categoria | null;
  subcategorias?: Categoria[];
  created_at?: string;
  updated_at?: string;
}