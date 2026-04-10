import { Component } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  isMobileMenuOpen = true;

  mainNavItems = [
    { icon: 'home', label: 'Dashboard', route: '/home', badge: null, active: true },
    { icon: 'inventory_2', label: 'Products', route: '/products', badge: null, active: false },
    { icon: 'warehouse', label: 'Warehouse', route: '/warehouse', badge: null, active: false },
    {
      icon: 'archive', label: 'Storage Bin', route: '/storageBin', badge: null, active: false
    },
     {
      icon: 'inventory_2', label: 'Inventory Item', route: '/inventoryitems', badge: null, active: false
    },{
      icon: 'local_shipping', label: 'Inbound Shipment', route: '/inboundShipment', badge: null, active: false
    },{
      icon: 'factory', label: 'Suppliers', route: '/suppliers', badge: null, active: false
    },
    // { icon: 'people', label: 'Customers', route: '/customers', badge: null },
    // { icon: 'article', label: 'Content', route: '/content', badge: null },
    // { icon: 'account_balance', label: 'Finances', route: '/finances', badge: null },
    // { icon: 'analytics', label: 'Analytics', route: '/analytics', badge: null },
    { icon: 'campaign', label: 'Marketing', route: '/marketing', badge: null, hasSubmenu: true },
    // { icon: 'local_offer', label: 'Discounts', route: '/discounts', badge: null }
  ];

  salesChannels = [
    { icon: 'language', label: 'Online Store', route: '/online-store' },
    { icon: 'point_of_sale', label: 'Point of Sale', route: '/pos' },
    { icon: 'store', label: 'Shop', route: '/shop' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
