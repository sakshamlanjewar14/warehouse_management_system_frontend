import { ToastNotificationService } from './../../../shared/services/toast-notification.service';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from "@angular/core";
import { StorageBinService } from "../storageBin.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { StorageBinRequestDto } from "../storageBin.model";
import { WarehouseService } from '../../warehouse/warehouse.service';
import { WarehouseResponseDto } from '../../warehouse/warehouse.model';


// Component Setup
@Component({
  selector: 'app-bin-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './bin-form.html',
  styleUrl: './bin-form.scss',
})
export class StorageBinForm implements OnInit{

    // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private storageBinService = inject(StorageBinService);
  private warehouseService = inject(WarehouseService);
  private toastnotificationService = inject(ToastNotificationService);
  private cdr = inject(ChangeDetectorRef)

   // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  warehouses: WarehouseResponseDto[] = [];

  // Strongly typed Reactive Form
  // Form Creation
  storageBinForm = this.formBuilder.group({
    binCode: ['', [Validators.required, Validators.minLength(1)]],
    capacity: [0, [Validators.required, Validators.minLength(1)]],
    warehouseName: ['', [Validators.required, Validators.minLength(1)]],
  });

   ngOnInit(): void {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouseListResponse) => {
        this.warehouses = warehouseListResponse;
         this.cdr.markForCheck();
      },
      error: (err) => {
         console.log("Unable to fetch warehouse list from backend", err);
      }
    });
  }

  // isWarehouseSelected(warehouseId: number, currentRowIndex: number): boolean {
  //   console.log("isWarehouseSelected::", warehouseId)
  //   // const selected = this.selectedProductIds();
  //   const currentControlValue = Number(this.storageBinForm.at(currentRowIndex).get('warehouseId')?.value);

  //   // // Disable if the ID is used elsewhere, but NOT if it's the one in this row
  //   // return warehouseId != undefined && selected.includes(warehouseId) && currentControlValue !== warehouseId;
  // }


   // Check form is valid
  onSubmit() {
    if (this.storageBinForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('StorageBin Data:', this.storageBinForm.value);
      // Get form data
      const storageBinData = this.storageBinForm.getRawValue() as StorageBinRequestDto;


      // Call backend
      this.storageBinService.createStorageBin(storageBinData)
        .subscribe({
          // Handle response--Success
          next: (savedStorageBin) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('StorageBin saved successfully!');
            this.storageBinForm.reset();
            this.toastnotificationService.show("StorageBin saved successfully!", "success")
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save storagebin!');
            this.toastnotificationService.show("Unable to save storagebin!", "error")
            console.log("Unable to save storagebin at backend", err);
          }
        });
    }
  }

  // Clear Form Function
  clearStorageBinForm() {
    this.storageBinForm.reset();
  }
}