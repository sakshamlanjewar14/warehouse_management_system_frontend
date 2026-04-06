import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InboundShipmentService } from '../inboundShipment.service';
import { InboundShipmentRequestDto } from '../inboundShipment.model';

// Component Setup
@Component({
  selector: 'app-inboundShipment-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inboundShipment-form.html',
  styleUrl: './inboundShipment-form.scss',
})
export class InboundShipmentForm {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private inboundShipmentService = inject(InboundShipmentService);

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  // Strongly typed Reactive Form
  // Form Creation
  inboundShipmentForm = this.formBuilder.group({
    shipmentCode: ['', [Validators.required, Validators.minLength(3)]],
    supplierName: ['', [Validators.required, Validators.minLength(2)]],
    status: ['', [Validators.required]],
    expectedDate: ['', [Validators.required]],
    receivedDate: ['', [Validators.required]],
    referenceNumber: ['', [Validators.required]],
    notes: ['', [Validators.required]],
    inboundShipmentItems: this.formBuilder.array([])
  });

  get inboundShipmentItems(): FormArray {
    return this.inboundShipmentForm.get('inboundShipmentItems') as FormArray;
  }

  addInboundShipmentItemRow(){
    const row = new FormGroup({
      bin: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
      quantity: new FormControl(0, { nonNullable: true, validators: [Validators.min(1)] })
    });
    this.inboundShipmentItems.push(row);
  }

  // Check form is valid
  onSubmit() {
    if (this.inboundShipmentForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('InboundShipment Data:', this.inboundShipmentForm.value);
      // Get form data
      const formValue = this.inboundShipmentForm.value;

      const inboundShipmentData: InboundShipmentRequestDto = {
        shipmentCode: formValue.shipmentCode ?? '',
        supplierName: formValue.supplierName ?? '',
        status: formValue.status ?? '',
        expectedDate: new Date(formValue.expectedDate ?? ''),
        receivedDate: new Date(formValue.receivedDate ?? ''),
        referenceNumber: formValue.referenceNumber ?? '',
        notes: formValue.notes ?? '',
        //inboundShipmentItems: formValue.inboundShipmentItems?.values ?? []
      };

      //const inboundShipmentData = this.inboundShipmentForm.getRawValue() as InboundShipment;
      // Call backend
      this.inboundShipmentService.createShipment(inboundShipmentData)
        .subscribe({
          // Handle response--Success
          next: (savedInboundShipment) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('InboundShipment saved successfully!');
            this.inboundShipmentForm.reset();
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save InboundShipment!');
            console.log("Unable to save InboundShipment at backend", err);
          }
        });
    }
  }

  // Clear Form Function
  clearInboundShipmentForm() {
    this.inboundShipmentForm.reset();
  }


}
