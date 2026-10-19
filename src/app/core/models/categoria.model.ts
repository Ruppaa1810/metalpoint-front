export interface Categoria {
    id?: number;
    nombre: string;
    categoria_padre_id?: number | null;
    categoria_padre?: Categoria | null;
    productos_count?: number;
}