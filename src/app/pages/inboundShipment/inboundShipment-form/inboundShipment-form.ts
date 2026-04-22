import { ShipmentStatus } from './../inboundShipment.model';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InboundShipmentService } from '../inboundShipment.service';
import { InboundShipmentRequestDto } from '../inboundShipment.model';
import { Product } from '../../products/product.model';
import { ProductService } from '../../products/product.service';
import { SupplierItemResponseDto, SupplierResponseDto } from '../../supplier/supplier.model';
import { SupplierService } from '../../supplier/supplier.service';
import { ToastNotificationService } from './../../../shared/services/toast-notification.service';


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
  private supplierService = inject(SupplierService)
  private cdr = inject(ChangeDetectorRef)
  private toastNotificationService = inject(ToastNotificationService);

  // Signals
  
  isSubmitting = signal(false);
  submitMessage = signal('');

  products: SupplierItemResponseDto[] = [];
  selectedProductIds = signal<number[]>([]);
  suppliers: SupplierResponseDto[] = [];

  shipmentStatuses = Object.keys(ShipmentStatus).filter((key) => isNaN(Number(key)));

  // Strongly typed Reactive Form
  // Form Creation
  inboundShipmentForm = this.formBuilder.group({
    shipmentCode: ['', [Validators.required, Validators.minLength(3)]],
    supplierId: [null, [Validators.required]],
    //status: ['', [Validators.required]],
    expectedDate: ['', [Validators.required]],
    // receivedDate: ['', []],
    referenceNumber: ['', []],
    notes: ['', []],
    inboundShipmentItems: this.formBuilder.array([])
  });


  ngOnInit(): void {
    // get all supplier from service
    this.supplierService.getAllSuppliers()
      .subscribe({
        next: (supplierListResponse) => {
          this.suppliers = supplierListResponse;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("Unable to fetch supplier list from backend", err);
          this.toastNotificationService.show("Unable to fetch supplier list from backend", "error");
          this.cdr.markForCheck();
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

  addInboundShipmentItemRow() {
    const row = new FormGroup({
      productId: new FormControl('', [Validators.required, Validators.minLength(1)]),
      expectedQty: new FormControl(1, [Validators.required, Validators.min(1)]),
      // receivedQty: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
      // damagedQty: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    });
    this.inboundShipmentItems.push(row);
  }
  

  removeInboundShipmentItemRow(index: any) {
    this.inboundShipmentItems.removeAt(index);
  }

  updateRows() {
    const selectedIds: number[] = [];
    this.inboundShipmentItems.controls.forEach((group, index) => {
      const productId = Number(group.get('productId')?.value);
      if (productId) selectedIds.push(productId);
    });
    this.selectedProductIds.set(selectedIds);
  }
  

  isProductSelected(productId: number, currentRowIndex: number): boolean {
    console.log("isProductSelected::", productId)
    const selected = this.selectedProductIds();
    const currentControlValue = Number(this.inboundShipmentItems.at(currentRowIndex).get('productId')?.value);

    // Disable if the ID is used elsewhere, but NOT if it's the one in this row
    return productId != undefined && selected.includes(productId) && currentControlValue !== productId;
  }


  // Clear Form Function
  clearInboundShipmentForm() {
    this.inboundShipmentForm.reset();
  }

  selectedSupplier: SupplierResponseDto | null = null;

  onSupplierSelect(event: any) {
    const selectedOption = event.target as HTMLSelectElement;
    const supplierId = selectedOption.value;
    if (supplierId && supplierId.length > 0) {
      this.supplierService.getSupplierById(supplierId)
        .subscribe({
          next: (response) => {
            this.selectedSupplier = response;
            this.products = this.selectedSupplier.supplierItems ?? [];
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.log("Unable to fetch supplier by Id", err);
            this.toastNotificationService.show("Unable to fetch selected supplier", "error");
            this.cdr.markForCheck();
          }
        })
    } else {
      this.selectedSupplier = null;
      this.cdr.markForCheck();
    }
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
        supplierId: formValue.supplierId ?? 0,
        //status: formValue.status ?? '',
        expectedDate: new Date(formValue.expectedDate ?? ''),
        //receivedDate: new Date(formValue.receivedDate ?? ''),
        referenceNumber: formValue.referenceNumber ?? '',
        notes: formValue.notes ?? '',
        inboundShipmentItems: items
      };

      console.log("inboundShipmentData::", inboundShipmentData)

      // Call backend
      this.inboundShipmentService.createShipment(inboundShipmentData)
        .subscribe({
          // Handle response--Success
          next: (savedInboundShipment) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('InboundShipment saved successfully!');
            this.inboundShipmentForm.reset();
            this.toastNotificationService.show("Inbound Shipment saved successfully", "success");
            this.cdr.markForCheck();
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save InboundShipment!');
            console.log("Unable to save InboundShipment at backend", err);
            this.toastNotificationService.show("Unable to save Incoming Shipment", "error");
            this.cdr.markForCheck();
          }
        });
    }else{
      this.toastNotificationService.show("Invalid form values", "error");
    }
  }

}
