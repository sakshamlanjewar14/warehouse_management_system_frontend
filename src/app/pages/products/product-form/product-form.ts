import { ToastNotificationService } from './../../../shared/services/toast-notification.service';
import { ToastNotification } from './../../../shared/components/toast-notification/toast-notification';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

// Component Setup
@Component({
  selector: 'app-product-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private toastNotificationService = inject(ToastNotificationService);
  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  // Strongly typed Reactive Form
  // Form Creation
  productForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9\s\-()]+$/)]],
    description: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(500),Validators.pattern(/^[a-zA-Z0-9\s.,\-()]+$/)]],
    sku: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20),Validators.pattern(/^[A-Z0-9\-_]+$/)]],
    barcode: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13), Validators.pattern(/^[0-9]+$/)]],
    price: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    weight: [0, [Validators.min(0), Validators.max(99999), Validators.pattern(/^\d+(\.\d{1,3})?$/)]],
    imageUrl: ['', [Validators.required, Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif))$/i)]],
  });

  // Check form is valid
  onSubmit() {
    if (this.productForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('Product Data:', this.productForm.value);
      // Get form data
      const productData = this.productForm.getRawValue() as Product;
      // Call backend
      this.productService.createProduct(productData)
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
  }

  // Clear Form Function
  clearProductForm() {
    this.productForm.reset();
  }


}
