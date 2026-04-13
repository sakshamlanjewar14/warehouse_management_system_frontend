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


      // For Products
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/product-list/product-list')
            .then(m => m.ProductList)
      },
      {
        path: 'product-form',
        loadComponent: () =>
          import('./pages/products/product-form/product-form')
            .then(m => m.ProductForm)
      },


      // For Warehouse
      {
        path: 'warehouse',
        loadComponent: () =>
          import('./pages/warehouse/warehouse-list/warehouse-list')
            .then(m => m.WarehouseList)
      },
      {
        path: 'warehouse-form',
        loadComponent: () =>
          import('./pages/warehouse/warehouse-form/warehouse-form')
            .then(m => m.WarehouseForm)
      },


      // For StorageBin
      {
        path: 'storageBin',
        loadComponent: () =>
          import('./pages/storageBin/bin-list/bin-list')
            .then(m => m.StorageBinList)
      },
      {
        path: 'storageBin-form',
        loadComponent: () =>
          import('./pages/storageBin/bin-form/bin-form')
            .then(m => m.StorageBinForm)
      },


      // For Inventory Item
      {
        path: 'inventoryitems',
        loadComponent: () =>
          import('./pages/inventoryItem/item-list/item-list')
            .then(m => m.InventoryItemList)
      },
      {
        path: 'inventoryItem-form',
        loadComponent: () =>
          import('./pages/inventoryItem/item-form/item-form')
            .then(m => m.InventoryItemForm)
      },


      // For InboundShipment Item
      {
        path: 'inboundShipment',
        loadComponent: () =>
          import('./pages/inboundShipment/inboundShipment-list/inboundShipment-list')
            .then(m => m.InboundShipmentList)
      },
      {
        path: 'inboundShipment-form',
        loadComponent: () =>
          import('./pages/inboundShipment/inboundShipment-form/inboundShipment-form')
            .then(m => m.InboundShipmentForm)
      },


      // For supplier
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./pages/supplier/supplier-list/supplier-list')
            .then(m => m.SupplierList)
      },
      {
        path: 'suppliers/create',
        loadComponent: () =>
          import('./pages/supplier/supplier-form/supplier-form')
            .then(m => m.SupplierForm)
      },
      {
        path: 'suppliers/assign-product/:supplierId',
        loadComponent: () =>
          import('./pages/supplier/assign-product/assign-product')
            .then(m => m.AssignProduct)
      },

    ]
  }
];
