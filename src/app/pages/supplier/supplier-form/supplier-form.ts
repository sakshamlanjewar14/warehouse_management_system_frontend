import { SupplierService } from './../supplier.service';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupplierRequestDto } from '../supplier.model';
import { ToastNotificationService } from '../../../shared/services/toast-notification.service';

// Component Setup
@Component({
  selector: 'app-supplier-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.scss',
})
export class SupplierForm {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private toastnotificationService = inject(ToastNotificationService);

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  // For getting an list in select on form
  stateList = [
    { id: "1", name: "Maharashtra" },
    { id: "2", name: "Goa" },
    { id: "3", name: "Karnatka" },
    { id: "4", name: "Panjab" },
    { id: "5", name: "Hariyana" },
    { id: "6", name: "Uttar Pradesh" },
    { id: "7", name: "Madhya Pradesh" },
  ]

  cityList = [
    { id: "1", name: "Pune" },
    { id: "2", name: "Mumbai" },
    { id: "3", name: "Gondia" },
    { id: "4", name: "Nagpur" },
    { id: "5", name: "Delhi" },
    { id: "6", name: "Chandigarh" },
    { id: "7", name: "Bilaspur" },
  ]


  countryList = [
    { id: "1", name: "India" },
    { id: "2", name: "Australia" },
    { id: "3", name: "Brazil" },
    { id: "4", name: "Colombia" },
    { id: "5", name: "Denmark" },
    { id: "6", name: "Egypt" },
    { id: "7", name: "Germany" },
  ]



  // Strongly typed Reactive Form
  // Form Creation
  supplierForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
    supplierCode: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Z0-9_-]+$/)]],
    email: ['', [ Validators.required, Validators.email, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    phone: ['', [ Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
    address1: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[a-zA-Z0-9\s,.\-/#]+$/)]],
    address2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[a-zA-Z0-9\s,.\-/#]+$/)]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['', [Validators.required]],
    postalCode: ['', [ Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]]
  });

  // Check form is valid
  onSubmit() {
    if (this.supplierForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('Supplier Data:', this.supplierForm.value);

      // Get form data
      const supplierData = this.supplierForm.getRawValue() as SupplierRequestDto;


      // Call backend
      this.supplierService.createSupplier(supplierData)
        .subscribe({
          // Handle response--Success
          next: (savedSupplier) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Supplier saved successfully!');
            this.supplierForm.reset();
            this.toastnotificationService.show("Supplier saved successfully!", 'success')
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save Supplier!');
            this.toastnotificationService.show("Unable to save Supplier!", "error")
            console.log("Unable to save Supplier at backend", err);
          }
        });
    }
  }

  // Clear Form Function
  clearForm() {
    this.supplierForm.reset();
  }

}
