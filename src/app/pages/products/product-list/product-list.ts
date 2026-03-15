import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';

interface Product {
  id: string;
  name: string;
  category: string;
  date: string;
  price: number;
  sellPrice: number;
  stock: number;
  status: 'Published' | 'Inactive' | 'Out Stock' | 'Draft';
  image: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html'
})
export class ProductList implements OnInit {

  productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe();
  }

  searchTerm = signal('');
  selectedFilter = signal('All');
  selectedProducts = signal<Set<number>>(new Set());
  
  filters = ['All', 'Active', 'Drafts', 'Archived'];
  
  stats = [
    { 
      title: 'TOTAL PRODUCTS', 
      value: '1,248', 
      change: '+4.2%', 
      trend: 'up',
      icon: 'inventory',
      color: 'emerald'
    },
    { 
      title: 'TOTAL REVENUE', 
      value: '$84,320', 
      change: '+12.5%', 
      trend: 'up',
      icon: 'attach_money',
      color: 'emerald'
    },
    { 
      title: 'TOTAL ORDERS', 
      value: '142', 
      change: '-1.4%', 
      trend: 'down',
      icon: 'shopping_bag',
      color: 'red'
    },
    { 
      title: 'CUSTOMERS', 
      value: '3,240', 
      change: '+2.1%', 
      trend: 'up',
      icon: 'group',
      color: 'emerald'
    }
  ];

  products = signal<Product[]>([
    {
      id: 'KMI662266',
      name: 'Airpods Pro Max 2024',
      category: 'Electric Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 120120,
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1603351154351-5cfb3d04ef32?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662211',
      name: 'Nike New Model Shoes',
      category: 'Shoes Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 10120,
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662266',
      name: 'Airpods Pro Max 2024',
      category: 'Electric Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 120120,
      status: 'Inactive',
      image: 'https://images.unsplash.com/photo-1603351154351-5cfb3d04ef32?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662266',
      name: 'Airpods Pro Max 2024',
      category: 'Electric Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 120120,
      status: 'Out Stock',
      image: 'https://images.unsplash.com/photo-1603351154351-5cfb3d04ef32?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662211',
      name: 'Nike New Model Shoes',
      category: 'Shoes Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 10120,
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662211',
      name: 'Nike New Model Shoes',
      category: 'Shoes Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 10120,
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662211',
      name: 'Nike New Model Shoes',
      category: 'Shoes Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 10120,
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662211',
      name: 'Nike New Model Shoes',
      category: 'Shoes Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 10120,
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662211',
      name: 'Nike New Model Shoes',
      category: 'Shoes Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 10120,
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    },
    {
      id: 'KMI662211',
      name: 'Nike New Model Shoes',
      category: 'Shoes Product',
      date: 'Jan 01, 2024',
      price: 10120.00,
      sellPrice: 10600.00,
      stock: 10120,
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    }
  ]);

  filteredProducts = computed(() => {
    let result = this.products();
    const term = this.searchTerm().toLowerCase();
    const filter = this.selectedFilter();
    
    if (term) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.id.toLowerCase().includes(term)
      );
    }
    
    if (filter !== 'All') {
      const statusMap: { [key: string]: string } = {
        'Active': 'Published',
        'Drafts': 'Draft',
        'Archived': 'Inactive'
      };
      if (statusMap[filter]) {
        result = result.filter(p => p.status === statusMap[filter]);
      }
    }
    
    return result;
  });

  selectedCount = computed(() => this.selectedProducts().size);
  
  allSelected = computed(() => {
    const filtered = this.filteredProducts();
    return filtered.length > 0 && filtered.every((_, i) => this.selectedProducts().has(i));
  });

  getStatusClasses(status: string): string {
    const classes: { [key: string]: string } = {
      'Published': 'text-emerald-700 bg-emerald-50',
      'Inactive': 'text-red-700 bg-red-50',
      'Out Stock': 'text-amber-700 bg-amber-50',
      'Draft': 'text-gray-700 bg-gray-100'
    };
    return classes[status] || 'text-gray-700 bg-gray-100';
  }

  getStatusDotColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Published': 'bg-emerald-500',
      'Inactive': 'bg-red-500',
      'Out Stock': 'bg-amber-500',
      'Draft': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  }

  toggleProduct(index: number) {
    const current = new Set(this.selectedProducts());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.selectedProducts.set(current);
  }

  toggleSelectAll() {
    const filtered = this.filteredProducts();
    const current = new Set(this.selectedProducts());
    
    if (this.allSelected()) {
      filtered.forEach((_, i) => current.delete(i));
    } else {
      filtered.forEach((_, i) => current.add(i));
    }
    this.selectedProducts.set(current);
  }

  clearSelection() {
    this.selectedProducts.set(new Set());
  }

  setFilter(filter: string) {
    this.selectedFilter.set(filter);
    this.clearSelection();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onExport() {
    console.log('Export selected products:', Array.from(this.selectedProducts()));
  }

  onEdit() {
    console.log('Edit selected products:', Array.from(this.selectedProducts()));
  }

  onDelete() {
    console.log('Delete selected products:', Array.from(this.selectedProducts()));
    this.clearSelection();
  }
}