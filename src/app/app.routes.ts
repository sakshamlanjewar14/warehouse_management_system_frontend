import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
          .then(m => m.Dashboard)
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/product-list/product-list')
          .then(m => m.ProductList)
      },

      {
        path: 'warehouse',
        loadComponent: () =>
          import('./pages/warehouse/warehouse-list/warehouse-list')
          .then(m => m.WarehouseList)
      }

    ]
  }
];
