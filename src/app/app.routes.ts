import { Routes } from '@angular/router';
import { AdminLayout } from './core/layouts/admin-layout/admin-layout';

export const routes: Routes = [
    {
        path: 'admin', component: AdminLayout,
        children: [

        ]
    },

    { path: '', pathMatch: 'full', redirectTo: 'admin' },
    { path: '**', redirectTo: 'admin' }
];
