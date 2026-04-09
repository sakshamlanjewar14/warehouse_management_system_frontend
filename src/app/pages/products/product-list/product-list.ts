import { Component, signal, computed, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { RouterModule } from '@angular/router';
import { Product } from '../product.model';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList implements OnInit {

  //productService = inject(ProductService);

  constructor(
    public productService: ProductService
  ){

  }

  products: Product[] = [];
  totalProductsCount = signal<number>(0);

  ngOnInit(): void {
    this.productService.getAllProducts()
    .subscribe({
      next: (productList)=> {
        this.products = productList;
        this.totalProductsCount.set(productList.length);
      },
      error: (err)=>{
        console.log("Unable to fetch product list from backend", err);
      }
    });
  }
  
}