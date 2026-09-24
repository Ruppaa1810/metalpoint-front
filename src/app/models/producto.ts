import { Categoria } from './categoria';
import { Marca } from './marca';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  unidad_medida: 'unidad' | 'metro' | 'kg' | 'm2';
  categoria_id: number;
  marca_id: number;
  imagen_url: string | null;
  created_at?: string;
  updated_at?: string;
  categoria?: Categoria;
  marca?: Marca;
}

export interface FiltrosProducto {
  q?: string;
  categoria_id?: number | null;
  marca_id?: number | null;
  precio_min?: number | null;
  precio_max?: number | null;
  orden?: string | null;
}