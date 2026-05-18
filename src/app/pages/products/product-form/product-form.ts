import { ToastNotificationService } from './../../../shared/services/toast-notification.service';
import { ToastNotification } from './../../../shared/components/toast-notification/toast-notification';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import {ProductRequestDto, ProductResponseDto } from '../product.model';

// Component Setup
@Component({
  selector: 'app-product-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private toastNotificationService = inject(ToastNotificationService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef)

  formMode: 'N' | 'E' = 'N';

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  selectedProduct: ProductResponseDto | null = null;

  // Strongly typed Reactive Form
  // Form Creation
  productForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\s\-()]+$/)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern(/^[a-zA-Z0-9\s.,\-()]+$/)]],
    sku: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[A-Z0-9\-_]+$/)]],
    barcode: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13), Validators.pattern(/^[0-9]+$/)]],
    price: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    weight: [0, [Validators.min(0), Validators.max(99999), Validators.pattern(/^\d+(\.\d{1,3})?$/)]],
    imageUrl: ['', [Validators.required]],
  });


  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(param => {

      const productId = param.get('productId')

      if (productId) {
        this.formMode = 'E';
        console.log("form mode in::", this.formMode);

        this.productService.getProductById(parseInt(productId))
          .subscribe({
            next: (response) => {
              console.log("selectedProduct::", response);
              this.selectedProduct = response;
              this.productForm.patchValue({
                name: this.selectedProduct.name,
                description: this.selectedProduct.description,
                sku: this.selectedProduct.sku,
                barcode: this.selectedProduct.barcode,
                price: this.selectedProduct.price,
                weight: this.selectedProduct.weight,
                imageUrl: this.selectedProduct.imageUrl
              });
            },
            error: (err) => {
              console.log("Unable to fetch selectedProduct from backend", err);
              this.toastNotificationService.show("Unable to fetch selected product data", "error");
              this.cdr.markForCheck();
            }
          })
      }
    });
    console.log("form mode out::", this.formMode);

  }

  // Check form is valid
  onSubmit() {

    if (this.productForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('Product Data:', this.productForm.value);
      // Get form data
      // const productData = this.productForm.getRawValue() as Product;
      const formValue = this.productForm.value

      if (this.formMode === 'E' && this.selectedProduct) {

        const editProductData: ProductRequestDto = {
          productId: this.selectedProduct.productId,
          name: formValue.name ?? '',
          description: formValue.description ?? '',
          sku: formValue.sku ?? '',
          barcode: formValue.barcode ?? '',
          price: formValue.price ?? 0,
          weight: formValue.weight ?? 0,
          imageUrl: formValue.imageUrl ?? '',
        }

        // call backend
        this.productService.updateProduct(this.selectedProduct.productId, editProductData)
          .subscribe({
            // handle response --- success
            next: (savedProduct) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Product updated successfully');
              this.productForm.reset();
              this.toastNotificationService.show("Product Updated Successfully", "success");
              this.cdr.markForCheck();
            },
            // handle response ----error
            error: (err) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Unable to update product');
              console.log("Unable to update product at backend", err);
              this.toastNotificationService.show("Unable to update product", "error");
              this.cdr.markForCheck();
            }
          });
      } else {
        //      This return data to backend
        const newProductData: ProductRequestDto = {
          name: formValue.name ?? '',
          description: formValue.description ?? '',
          sku: formValue.sku ?? '',
          barcode: formValue.barcode ?? '',
          price: formValue.price ?? 0,
          weight: formValue.weight ?? 0,
          imageUrl: formValue.imageUrl ?? '',
        };

        // Call backend
        this.productService.createProduct(newProductData)
          .subscribe({
            // Handle response--Success
            next: (savedProduct) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Product saved successfully!');
              this.productForm.reset();
              this.toastNotificationService.show("Product saved successfully!", "success")
            },
            // Handle response--error
            error: (err) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Unable to save product!');
              this.toastNotificationService.show("PUnable to save product!", "error")
              console.log("Unable to save product at backend", err);
            }
          });
      }
    } else {
      this.toastNotificationService.show("Invalid form values", "error");
    }
  }

  // Clear Form Function
  clearProductForm() {
    this.productForm.reset();
  }


}
