import { map } from 'rxjs';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../products/product.service';
import { SupplierService } from '../supplier.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupplierItemRequestDto, SupplierItemResponseDto, SupplierResponseDto } from '../supplier.model';
import { CommonModule } from '@angular/common';
import { Product } from '../../products/product.model';

@Component({
  selector: 'app-assign-product',
  imports: [CommonModule, RouterModule],
  templateUrl: './assign-product.html',
  styleUrl: './assign-product.scss',
})
export class AssignProduct implements OnInit {

  supplier: SupplierResponseDto | undefined;
  supplierId: string = '';
  products: Product[] = [];
  availableProductList: SupplierItemResponseDto[] = [];
  assignedProductList: SupplierItemResponseDto[] = [];

  productService = inject(ProductService);
  supplierService = inject(SupplierService);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.supplierId = params.get('supplierId') ?? '';
      console.log("supplierId::", this.supplierId);
      this.loadSupplierFromBackend();
    });
  }

  loadSupplierFromBackend() {
    if (this.supplierId == '') {
      return;
    }
    this.supplierService.getSupplierById(this.supplierId)
      .subscribe({
        next: (response) => {
          console.log("response::", response);
          this.supplier = response;
          this.assignedProductList = [...response.supplierItems ?? []];
          this.loadProductListFromBackend();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("Error loading supplier:", err);
        }
      })


  }

  loadProductListFromBackend() {
    this.productService.getAllProducts()
      .subscribe({
        next: (listResponse) => {
          this.products = listResponse;
          const filteredProducts = this.products.filter(p =>
            !this.assignedProductList.some(ap => ap.productId === p.productId)
          );
          console.log("this.assignedProductList::", this.assignedProductList, "filteredProducts::", filteredProducts)
          this.availableProductList = filteredProducts.filter(p => p.productId).map(p => {
            const availProd: SupplierItemResponseDto = {
              price: p.price,
              productId: p.productId ?? 0,
              productName: p.name,
              quantity: 0
            }
            return availProd;
          }).sort()
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("Error loading product list: ", err);
        }
      })
  };


  assignProduct(p: SupplierItemResponseDto) {
    this.assignedProductList = [...this.assignedProductList, p].sort();
    this.availableProductList = this.availableProductList.filter(a => a.productId != p.productId);
    //this.updateAssignAndAvailableProducts();
    this.cdr.markForCheck();
  }

  removeProduct(p: SupplierItemResponseDto) {
    this.availableProductList = [...this.availableProductList, p].sort();
    this.assignedProductList = this.assignedProductList.filter(a => a.productId != p.productId);
    //this.updateAssignAndAvailableProducts();
    this.cdr.markForCheck();
  }

  saveAssignProducts() {
    const supplierItemRequestDtoList = this.assignedProductList.map(i => {
      const supplierItemRequestDto: SupplierItemRequestDto = {
        itemId: i.itemId,
        productName: i.productName,
        price: i.price,
        quantity: i.quantity,
        productId: i.productId
      }
      return supplierItemRequestDto;
    });
    this.supplierService.assignProductsToSupplier(this.supplier?.supplierId ?? 0, supplierItemRequestDtoList)
      .subscribe({
        next: (response) => {
          alert("Assigned product saved successfully.")
        },
        error: (err) => {
          console.log("Error while saving assigned products ", err);
        }
      });
  }


}
