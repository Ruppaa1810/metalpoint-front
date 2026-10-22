import { Routes } from '@angular/router';
import { ListaCategorias } from './features/admin/categorias/lista-categorias/lista-categorias';
import { FormCategoria } from './features/admin/categorias/form-categoria/form-categoria';
import { ListaMarcas } from './features/admin/marcas/lista-marcas/lista-marcas';
import { FormMarca } from './features/admin/marcas/form-marca/form-marca';
import { ListaProductos } from './features/admin/productos/lista-productos/lista-productos';
import { FormProducto } from './features/admin/productos/form-producto/form-producto';
import { AdminLayout } from './core/layouts/admin-layout/admin-layout';
import { Login } from './features/auth/login/login';
import { PublicLayout } from './core/layouts/public-layout/public-layout';
import { Catalogo } from './features/catalogo/catalogo/catalogo';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: 'admin', component: AdminLayout,
        children: [
            { path: 'lista-categorias', component: ListaCategorias, title: 'ListaCategorias' },
            { path: 'form-categoria', component: FormCategoria, title: 'FormCategoria' },
            { path: 'lista-marcas', component: ListaMarcas, title: 'ListaMarcas' },
            { path: 'form-marca', component: FormMarca, title: 'FormMarca' },
            { path: 'lista-productos', component: ListaProductos, title: 'ListaProductos' },
            { path: 'form-producto', component: FormProducto, title: 'FormProducto' },
            { path: '', pathMatch: 'full', redirectTo: 'lista-categorias' },
            { path: '**', redirectTo: 'lista-categorias'}
        ]
    },

    {
        path: '', component: PublicLayout,
        children: [
            { path: 'catalogo', component: Catalogo, title: 'Catalogo' },
            { path: '', pathMatch: 'full', redirectTo: 'catalogo' }
        ]
    },
    { path: '**', redirectTo: '' }
];