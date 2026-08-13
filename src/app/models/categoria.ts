export interface Categoria {
  id: number;
  nombre: string;
  categoria_padre_id?: number | null;
  categoria_padre?: Categoria | null;
  subcategorias?: Categoria[];
  productos_count?: number;
  created_at?: string;
  updated_at?: string;
}