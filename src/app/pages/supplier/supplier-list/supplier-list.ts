import { SupplierService } from './../supplier.service';
import { Component, signal, computed, inject, OnInit, ChangeDetectorRef, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierResponseDto } from '../supplier.model';
import { Product } from '../../products/product.model';
import { ProductService } from "../../products/product.service";
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supplier-list.html',
  styleUrls: ['./supplier-list.scss']
})
export class SupplierList implements OnInit {

   private productService = inject(ProductService);
   private supplierService = inject(SupplierService);
   private cdr = inject(ChangeDetectorRef);

  // Grab the dialog element from the template
  private modal = viewChild.required<ElementRef<HTMLDialogElement>>('productModal');
  
  // Track state with a Signal
  isModalOpen = signal(false);
  products: Product[] = [];
  selectedProduct: Product[] = [];


  suppliers: SupplierResponseDto[] = [];
  totalSuppliersCount = signal<number>(0);

  ngOnInit(): void {
    this.supplierService.getAllSuppliers()
    .subscribe({
      next: (supplierList)=> {
        this.suppliers = supplierList;
        this.totalSuppliersCount.set(supplierList.length);
      },
      error: (err)=>{
        console.log("Unable to fetch supplier list from backend", err);
      }
    });

    // get all products
     this.productService.getAllProducts()
      .subscribe({
        next: (productListResponse) => {
          this.products = productListResponse;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("Unable to fetch product list from backend", err);
        }
      });
  }

  openModal() {
    this.isModalOpen.set(true);
    this.modal().nativeElement.showModal(); // showModal() is the native API
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.modal().nativeElement.close();
  }

  saveAndClose() {
    console.log("Saving data...");
    this.closeModal();
  }
  
  onProductSelect(p: any){
    this.selectedProduct = [...this.selectedProduct, p];
  }

  removeProduct(i : number){
    this.selectedProduct.splice(i, 1);
  }
}