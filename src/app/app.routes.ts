import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', title: 'MetalPoint - Hierros y Metalúrgica', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
      { path: 'catalogo', title: 'Catálogo | MetalPoint', loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo) },
      { path: 'producto/:id', loadComponent: () => import('./pages/producto-detalle/producto-detalle').then((m) => m.ProductoDetalle) },
      { path: 'carrito', title: 'Carrito | MetalPoint', loadComponent: () => import('./pages/carrito/carrito').then((m) => m.Carrito) },
      { path: 'perfil', title: 'Mi perfil | MetalPoint', loadComponent: () => import('./pages/perfil/perfil').then((m) => m.Perfil) },
      { path: 'login', title: 'Iniciar sesión | MetalPoint', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
      { path: 'registro', title: 'Crear cuenta | MetalPoint', loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro) },
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', loadComponent: () => import('./pages/admin/panel/panel').then((m) => m.Panel) },
      { path: 'categorias', loadComponent: () => import('./pages/admin/categorias/categorias').then((m) => m.Categorias) },
      { path: 'marcas', loadComponent: () => import('./pages/admin/marcas/marcas').then((m) => m.Marcas) },
      { path: 'productos', loadComponent: () => import('./pages/admin/productos/productos').then((m) => m.Productos) }
    ]
  },
  { path: '**', redirectTo: '' }
];
