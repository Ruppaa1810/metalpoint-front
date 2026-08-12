import { Categoria } from '../models/categoria';
import { Marca } from '../models/marca';
import { Producto } from '../models/producto';

export const MARCAS: Marca[] = [
  { id: 1, nombre: 'Sinpar' },
  { id: 2, nombre: 'Acindar' },
  { id: 3, nombre: 'Conarco' },
  { id: 4, nombre: 'Dowen Pagio' },
  { id: 5, nombre: 'Genérico' }
];

export const CATEGORIAS: Categoria[] = [
  { id: 1, nombre: 'Perfiles y Hierros', categoria_padre_id: null },
  { id: 2, nombre: 'Abrasivos y Corte', categoria_padre_id: null },
  { id: 3, nombre: 'Soldadura e Insumos', categoria_padre_id: null },
  { id: 4, nombre: 'Estructuras Estándar', categoria_padre_id: null },
  { id: 5, nombre: 'Perfiles Livianos', categoria_padre_id: 1 },
  { id: 6, nombre: 'Discos y Lijas', categoria_padre_id: 2 }
];

export const PRODUCTOS: Producto[] = [
  {
    id: 1,
    nombre: 'Hierro Angulo 1 x 1/8 (Barra 6m)',
    descripcion: 'Perfil de hierro ángulo laminado en caliente, ideal para herrería y estructuras.',
    precio: 24500,
    stock: 40,
    unidad_medida: 'metro',
    categoria_id: 1,
    marca_id: 2,
    imagen_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600',
    categoria: CATEGORIAS[0],
    marca: MARCAS[1]
  },
  {
    id: 2,
    nombre: 'Caño Estructural Cuadrado 40x40 (Espesor 1.6mm)',
    descripcion: 'Tubo estructural de acero ideal para marcos de portones y rejas.',
    precio: 32000,
    stock: 25,
    unidad_medida: 'metro',
    categoria_id: 1,
    marca_id: 2,
    imagen_url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600',
    categoria: CATEGORIAS[0],
    marca: MARCAS[1]
  },
  {
    id: 3,
    nombre: 'Disco de Corte Flap 4.5 pulgadas',
    descripcion: 'Disco para amoladora angular, ideal para desbaste fino de soldaduras.',
    precio: 1800,
    stock: 150,
    unidad_medida: 'unidad',
    categoria_id: 2,
    marca_id: 1,
    imagen_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
    categoria: CATEGORIAS[1],
    marca: MARCAS[0]
  },
  {
    id: 4,
    nombre: 'Electrodos Punta Azul 6013 (Kilo)',
    descripcion: 'Electrodos para soldadura eléctrica de acero al carbono, arco suave.',
    precio: 6500,
    stock: 80,
    unidad_medida: 'kg',
    categoria_id: 3,
    marca_id: 3,
    imagen_url: 'https://images.unsplash.com/photo-1560634951-92f13d3a229c?w=600',
    categoria: CATEGORIAS[2],
    marca: MARCAS[2]
  },
  {
    id: 5,
    nombre: 'Canasto de Basura Estándar para Vereda',
    descripcion: 'Canasto reforzado con metal desplegado y base para cementar.',
    precio: 45000,
    stock: 5,
    unidad_medida: 'unidad',
    categoria_id: 4,
    marca_id: 5,
    imagen_url: 'https://images.unsplash.com/photo-1565428252355-3fdb3b3e3d8d?w=600',
    categoria: CATEGORIAS[3],
    marca: MARCAS[4]
  }
];