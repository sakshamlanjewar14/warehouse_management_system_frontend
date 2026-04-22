import { ToastNotificationService } from './../../../shared/services/toast-notification.service';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutboundShipmentService } from '../outboundShipment.service';
import { ProductService } from '../../products/product.service';
import { Product } from '../../products/product.model';
import { OutboundShipmentRequestDto } from '../outboundShipment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-outbound-shipment-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './outbound-shipment-form.html',
  styleUrl: './outbound-shipment-form.scss',
})
export class OutboundShipmentForm{

  private formBuilder = inject(FormBuilder)
  private outboundShipment = inject(OutboundShipmentService)
  private productService = inject(ProductService)
  private outboundShipmentService = inject(OutboundShipmentService)
  private cdr = inject(ChangeDetectorRef)
  private toastNotificatonService = inject(ToastNotificationService)

  // Signals
  
  isSubmitting = signal(false);
  submitMessage = signal('');

  products: Product[] = [];
  selectedProductIds = signal<number[]>([]);

  // form creation
  outboundShipmentForm = this.formBuilder.group({
    customerName:["",[Validators.required, Validators.minLength(2)]],
    shipmentNumber:['',[Validators.required, Validators.minLength(1)]],
    status:['',[Validators.required]],
    shipmentAddress:['',[Validators.required]],
    trackingNumber:['',[Validators.required, Validators.minLength(1)]],
    outboundShipmentItems:this.formBuilder.array([])
  });

   // A getter to easily access the 'items' FormArray in the template
  get outboundShipmentItems(): FormArray {
    return this.outboundShipmentForm.get('outboundShipmentItems') as FormArray;
  }

   addOutboundShipmentItemRow() {
    const row = new FormGroup({
      productId: new FormControl('', [Validators.required, Validators.minLength(1)]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
    this.outboundShipmentItems.push(row);
  }

  isProductSelected(productId: number, currentRowIndex: number): boolean {
    console.log("isProductSelected::", productId)
    const selected = this.selectedProductIds();
    const currentControlValue = Number(this.outboundShipmentItems.at(currentRowIndex).get('productId')?.value);

    // Disable if the ID is used elsewhere, but NOT if it's the one in this row
    return productId != undefined && selected.includes(productId) && currentControlValue !== productId;
  }

  removeOutboundShipmentItemRow(index: any) {
    this.outboundShipmentItems.removeAt(index);
  }

  
  // Clear Form Function
  clearOutboundShipmentForm() {
    this.outboundShipmentForm.reset();
  }

  // Check form is valid
    onSubmit() {
      if (this.outboundShipmentForm.valid) {
        // Start loading
        this.isSubmitting.set(true);
  
        console.log('InboundShipment Data:', this.outboundShipmentForm.value);
        // Get form data
        const formValue = this.outboundShipmentForm.value;
        const items = this.outboundShipmentItems.value;
  
        //console.log("::formValue::",formValue, "::items::", items)
  
        const outboundShipmentData: OutboundShipmentRequestDto = {
          customerName: formValue.customerName ?? '',
          shipmentNumber: formValue.shipmentNumber ?? '',
          shipmentAddress: formValue.shipmentAddress ?? '',
          trackingNumber: formValue.trackingNumber ?? '',
          status: formValue.status ?? '',
          outboundShipmentItems: items
        };
  
        console.log("outboundShipmentData::", outboundShipmentData)
  
        // Call backend
        this.outboundShipmentService.createShipment(outboundShipmentData)
          .subscribe({
            // Handle response--Success
            next: (savedOutboundShipment) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Outbound Shipment saved successfully!');
              this.outboundShipmentForm.reset();
              this.toastNotificatonService.show("Outbound Shipment saved successfully", "success");
              this.cdr.markForCheck();
            },
            // Handle response--error
            error: (err) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Unable to save Outbound Shipment!');
              console.log("Unable to save Outbound Shipment at backend", err);
              this.toastNotificatonService.show("Unable to save Outgoing Shipment", "error");
              this.cdr.markForCheck();
            }
          });
      }else{
        this.toastNotificatonService.show("Invalid form values", "error");
      }
    }
}
