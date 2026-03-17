import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../product.service';

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

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  // Strongly typed Reactive Form
  // Form Creation
  productForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    sku: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    barcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
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
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save product!');
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
