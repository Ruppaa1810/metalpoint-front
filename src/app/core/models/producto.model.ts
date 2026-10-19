import { Categoria } from './categoria.model';
import { Marca } from './marca.model';

export interface Producto {
    id?: number;
    nombre: string;
    descripcion?: string | null;
    precio: number;
    stock: number;
    unidad_medida: string;
    categoria_id: number;
    marca_id: number;
    imagen_url?: string | null;
    categoria?: Categoria;
    marca?: Marca;
}
