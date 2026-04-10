import { ShipmentStatus } from './../inboundShipment.model';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InboundShipmentService } from '../inboundShipment.service';
import { InboundShipmentRequestDto } from '../inboundShipment.model';
import { Product } from '../../products/product.model';
import { ProductService } from '../../products/product.service';

// Component Setup
@Component({
  selector: 'app-inboundShipment-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inboundShipment-form.html',
  styleUrl: './inboundShipment-form.scss',
})
export class InboundShipmentForm implements OnInit {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private inboundShipmentService = inject(InboundShipmentService);
  private productService = inject(ProductService);

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  products: Product[] = [];
  selectedProductIds = signal<number[]>([]);

  shipmentStatuses = Object.keys(ShipmentStatus).filter((key) => isNaN(Number(key)));

  // Strongly typed Reactive Form
  // Form Creation
  inboundShipmentForm = this.formBuilder.group({
    shipmentCode: ['', [Validators.required, Validators.minLength(3)]],
    supplierName: ['', [Validators.required, Validators.minLength(2)]],
    status:       ['', [Validators.required]],
    expectedDate: ['', [Validators.required]],
    receivedDate: ['', []],
    referenceNumber: ['', []],
    notes: ['', []],          
    inboundShipmentItems: this.formBuilder.array([])
  });


  ngOnInit(): void {
    this.productService.getAllProducts()
      .subscribe({
        next: (productList) => {
          this.products = productList;
          this.addInboundShipmentItemRow();
        },
        error: (err) => {
          console.log("Unable to fetch product list from backend", err);
        }
      });

    this.inboundShipmentItems.valueChanges.subscribe(() => {
      this.updateRows();
    });
  }

  // A getter to easily access the 'items' FormArray in the template
  get inboundShipmentItems(): FormArray {
    return this.inboundShipmentForm.get('inboundShipmentItems') as FormArray;
  }

  updateRows() {
    const selectedIds: number[] = [];
    this.inboundShipmentItems.controls.forEach((group, index) => {
      const productId = Number(group.get('productId')?.value);
      if (productId) selectedIds.push(productId);
    });
    this.selectedProductIds.set(selectedIds);
  }

  addInboundShipmentItemRow() {
    const row = new FormGroup({
      productId: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
      expectedQty: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
      receivedQty: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
      damagedQty: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    });
    this.inboundShipmentItems.push(row);
  }

  removeInboundShipmentItemRow(index: any) {
    this.inboundShipmentItems.removeAt(index);
  }

  isProductDisabled(productId: number, currentRowIndex: number): boolean {
    const selected = this.selectedProductIds();
    const currentControlValue = Number(this.inboundShipmentItems.at(currentRowIndex).get('productId')?.value);

    // Disable if the ID is used elsewhere, but NOT if it's the one in this row
    return selected.includes(productId) && currentControlValue !== productId;
  }

  // Check form is valid
  onSubmit() {
    if (this.inboundShipmentForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('InboundShipment Data:', this.inboundShipmentForm.value);
      // Get form data
      const formValue = this.inboundShipmentForm.value;
      const items = this.inboundShipmentItems.value;

      //console.log("::formValue::",formValue, "::items::", items)

      const inboundShipmentData: InboundShipmentRequestDto = {
        shipmentCode: formValue.shipmentCode ?? '',
        supplierName: formValue.supplierName ?? '',
        //status: formValue.status ?? '',
        expectedDate: new Date(formValue.expectedDate ?? ''),
        receivedDate: new Date(formValue.receivedDate ?? ''),
        referenceNumber: formValue.referenceNumber ?? '',
        notes: formValue.notes ?? '',
        inboundShipmentItems: items
      };

      console.log("inboundShipmentData::", inboundShipmentData)

      // Call backend
      // this.inboundShipmentService.createShipment(inboundShipmentData)
      //   .subscribe({
      //     // Handle response--Success
      //     next: (savedInboundShipment) => {
      //       this.isSubmitting.set(false);
      //       this.submitMessage.set('InboundShipment saved successfully!');
      //       this.inboundShipmentForm.reset();
      //     },
      //     // Handle response--error
      //     error: (err) => {
      //       this.isSubmitting.set(false);
      //       this.submitMessage.set('Unable to save InboundShipment!');
      //       console.log("Unable to save InboundShipment at backend", err);
      //     }
      //   });
    }
  }

  // Clear Form Function
  clearInboundShipmentForm() {
    this.inboundShipmentForm.reset();
  }

}
