import { ToastNotificationService } from './../../../shared/services/toast-notification.service';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutboundShipmentService } from '../outboundShipment.service';
import { ProductService } from '../../products/product.service';
import { ProductResponseDto } from '../../products/product.model';
import { OutboundShipmentRequestDto, OutboundShipmentResponseDto } from '../outboundShipment.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-outbound-shipment-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './outbound-shipment-form.html',
  styleUrl: './outbound-shipment-form.scss',
})
export class OutboundShipmentForm implements OnInit {

  private formBuilder = inject(FormBuilder)
  private outboundShipment = inject(OutboundShipmentService)
  private productService = inject(ProductService)
  private outboundShipmentService = inject(OutboundShipmentService)
  private cdr = inject(ChangeDetectorRef)
  private toastNotificatonService = inject(ToastNotificationService)
  private activatedRoute = inject(ActivatedRoute);


  formMode: 'N' | 'E' = 'N';

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  products: ProductResponseDto[] = [];
  selectedProductIds = signal<number[]>([]);

  selectedOutboundShipment: OutboundShipmentResponseDto | null = null;

  // form creation
  outboundShipmentForm = this.formBuilder.group({
    customerName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z ]+$/)]],
    shipmentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
    // status:['',[Validators.required]],
    shipmentAddress: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[a-zA-Z0-9\s,.\-#/]+$/)]],
    trackingNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
    outboundShipmentItems: this.formBuilder.array([])
  });


  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe(params => {

      const shipmentId = params.get('shipmentid');

      if (shipmentId) {
        this.formMode = 'E';
        console.log("form mode in::", this.formMode);

        this.outboundShipmentService.getShipmentById(parseInt(shipmentId))
          .subscribe({
            next: (response) => {
              console.log("selected::", response);
              this.selectedOutboundShipment = response;
              this.outboundShipmentForm.patchValue({

                customerName: this.selectedOutboundShipment.customerName,
                shipmentNumber: this.selectedOutboundShipment.shipmentNumber,
                shipmentAddress: this.selectedOutboundShipment.shipmentAddress,
                trackingNumber: this.selectedOutboundShipment.trackingNumber

              });

              this.selectedOutboundShipment.outboundShipmentItems.forEach((item) => {
                const row = new FormGroup({
                  productId: new FormControl(item.productId, [Validators.required, Validators.minLength(1)]),
                  quantity: new FormControl(item.quantity, [Validators.required, Validators.min(1)]),
                });
                this.outboundShipmentItems.push(row);
              });
              this.cdr.markForCheck();
            },
            error: (err) => {
              console.log("Unable to fetch outbound shipment from backend", err);
              this.toastNotificatonService.show("Unable to fetch selected outbound shipment data", "error");
              this.cdr.markForCheck();
            }
          })
      }
    });
    console.log("form mode out::", this.formMode);

    this.productService.getAllProducts().subscribe({
      next: (productListResponse) => {
        this.products = productListResponse;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log("Unable to fetch product list from backend", err);
      }
    });

    this.outboundShipmentItems.valueChanges.subscribe(() => {
      this.updateRows();
    });
  }

  // A getter to easily access the 'items' FormArray in the template
  get outboundShipmentItems(): FormArray {
    return this.outboundShipmentForm.get('outboundShipmentItems') as FormArray;
  }

  // Adding the row with button
  addOutboundShipmentItemRow() {
    const row = new FormGroup({
      productId: new FormControl('', [Validators.required, Validators.minLength(1)]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
    this.outboundShipmentItems.push(row);
  }

  // If product already selected in another row → disable it
  updateRows() {
    const selectedIds: number[] = [];
    this.outboundShipmentItems.controls.forEach((group, index) => {
      const productId = Number(group.get('productId')?.value);
      if (productId) selectedIds.push(productId);
    });
    this.selectedProductIds.set(selectedIds);
  }


  isProductSelected(productId: number, currentRowIndex: number): boolean {
    console.log("isProductSelected::", productId)
    const selected = this.selectedProductIds();
    const currentControlValue = Number(this.outboundShipmentItems.at(currentRowIndex).get('productId')?.value);

    // Disable if the ID is used elsewhere, but NOT if it's the one in this row
    return productId != undefined && selected.includes(productId) && currentControlValue !== productId;
  }

  // Remove the row 
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

      console.log('OutboundShipment Data:', this.outboundShipmentForm.value);

      // Get form data
      const formValue = this.outboundShipmentForm.value;
      const items = this.outboundShipmentItems.value;

      console.log("::formValue::", formValue, "::items::", items)

      if (this.formMode === 'E' && this.selectedOutboundShipment) {

        const editOutboundShipmentData: OutboundShipmentRequestDto = {
          shipmentId: this.selectedOutboundShipment.shipmentId,
          customerName: formValue.customerName ?? '',
          shipmentNumber: formValue.shipmentNumber ?? '',
          shipmentAddress: formValue.shipmentAddress ?? '',
          trackingNumber: formValue.trackingNumber ?? '',
          outboundShipmentItems: items
        }

        this.outboundShipmentService.updateShipment(this.selectedOutboundShipment.shipmentId, editOutboundShipmentData)
          .subscribe({
            // Handle response--Success
            next: (savedStockTransfer) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Outbound shipment updated successfully!');
              this.outboundShipmentForm.reset();
              this.toastNotificatonService.show("Outbound shipment updated successfully", "success");
              this.cdr.markForCheck();
            },
            // Handle response--error
            error: (err) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Unable to update Outbound shipment!');
              console.log("Unable to update Outbound shipment at backend", err);
              this.toastNotificatonService.show("Unable to update Outbound shipment", "error");
              this.cdr.markForCheck();
            }
          });
      } else {
        const newOutboundShipmentData: OutboundShipmentRequestDto = {
          customerName: formValue.customerName ?? '',
          shipmentNumber: formValue.shipmentNumber ?? '',
          shipmentAddress: formValue.shipmentAddress ?? '',
          trackingNumber: formValue.trackingNumber ?? '',
          outboundShipmentItems: items
        };

         const outboundShipmentData: OutboundShipmentRequestDto = {
        customerName: formValue.customerName ?? '',
        shipmentNumber: formValue.shipmentNumber ?? '',
        shipmentAddress: formValue.shipmentAddress ?? '',
        trackingNumber: formValue.trackingNumber ?? '',
        // status: formValue.status ?? '',
        outboundShipmentItems: items
      };

      console.log("outboundShipmentData::", outboundShipmentData)

      // Call backend
      this.outboundShipmentService.createShipment(newOutboundShipmentData)
        .subscribe({
          // Handle response--Success
          next: (savedOutboundShipment) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('');
            this.outboundShipmentForm.reset();
            this.toastNotificatonService.show("Outbound Shipment saved successfully", "success");
            this.cdr.markForCheck();
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('');
            // console.log("Unable to save Outbound Shipment at backend", err);
            this.toastNotificatonService.show("Unable to save Outgoing Shipment", "error");
            this.cdr.markForCheck();
          }
        });
      }
    } else {
      this.toastNotificatonService.show("Invalid form values", "error");
    }
  }
}
