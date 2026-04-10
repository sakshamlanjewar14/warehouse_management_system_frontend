import { SupplierService } from './../supplier.service';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupplierRequestDto } from '../supplier.model';

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

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  // For getting an list in select on form
  stateList = [
    {id:"1", name: "Maharashtra"},
    {id:"2", name: "Goa"},
    {id:"3", name: "Karnatka"},
    {id:"4", name: "Panjab"},
    {id:"5", name: "Hariyana"},
    {id:"6", name: "Uttar Pradesh"},
    {id:"7", name: "Madhya Pradesh"},
  ]

  cityList = [
    {id:"1", name: "Pune"},
    {id:"2", name: "Mumbai"},
    {id:"3", name: "Gondia"},
    {id:"4", name: "Nagpur"},
    {id:"5", name: "Delhi"},
    {id:"6", name: "Chandigarh"},
    {id:"7", name: "Bilaspur"},
  ]


 countryList = [
    {id:"1", name: "India"},
    {id:"2", name: "Australia"},
    {id:"3", name: "Brazil"},
    {id:"4", name: "Colombia"},
    {id:"5", name: "Denmark"},
    {id:"6", name: "Egypt"},
    {id:"7", name: "Germany"},
  ]



  // Strongly typed Reactive Form
  // Form Creation
  supplierForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    supplierCode: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [ Validators.minLength(5)]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    address1: ['', [Validators.required, Validators.minLength(3)]],
    address2: ['', [ Validators.minLength(3)]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['', [Validators.required]],
    postalCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
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
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save Supplier!');
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
