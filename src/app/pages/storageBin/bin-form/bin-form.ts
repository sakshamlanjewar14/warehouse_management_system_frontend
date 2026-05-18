import { ToastNotificationService } from './../../../shared/services/toast-notification.service';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from "@angular/core";
import { StorageBinService } from "../storageBin.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { StorageBinRequestDto, StorageBinResponseDto } from "../storageBin.model";
import { WarehouseService } from '../../warehouse/warehouse.service';
import { WarehouseResponseDto } from '../../warehouse/warehouse.model';


// Component Setup
@Component({
  selector: 'app-bin-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './bin-form.html',
  styleUrl: './bin-form.scss',
})
export class StorageBinForm implements OnInit {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private storageBinService = inject(StorageBinService);
  private warehouseService = inject(WarehouseService);
  private toastnotificationService = inject(ToastNotificationService);
  private cdr = inject(ChangeDetectorRef)
  private activatedRoute = inject(ActivatedRoute)

  formMode: 'N' | 'E' = 'N';

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  selectedStorageBin: StorageBinResponseDto | null = null;

  warehouses: WarehouseResponseDto[] = [];

  // Strongly typed Reactive Form
  // Form Creation
  storageBinForm = this.formBuilder.group({
    binCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9-_]+$/)]],
    totalCapacity: [0, [Validators.required, Validators.min(1), Validators.max(999999), Validators.pattern(/^[0-9]+$/)]],
    warehouseId: [0, [Validators.required]],
  });

  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe(param => {

      const storageBinId = param.get('storageBinId');

      if (storageBinId) {
        this.formMode = 'E';
        console.log("form mode in:", this.formMode);

        // Api call--This calls backend:
        this.storageBinService.getstorageBinById(parseInt(storageBinId))
          .subscribe({
            next: (response) => {
              console.log("selectedStorageBin::", response);
              this.selectedStorageBin = response;
              this.storageBinForm.patchValue({
                binCode: this.selectedStorageBin.binCode,
                totalCapacity: this.selectedStorageBin.totalCapacity,
                warehouseId: this.selectedStorageBin.warehouseId
              });
            },
            error: (err) => {
              console.log("Unable to fetch storage bin from backend", err);
              this.toastnotificationService.show("Unable to fetch selected storage bin data", "error");
              this.cdr.markForCheck();
            }
          });
      }
    });
    console.log("form mode out::", this.formMode);

    //  get all warehouses
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

  // Check form is valid
  onSubmit() {
    if (this.storageBinForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('StorageBin Data:', this.storageBinForm.value);
      // Get form data
      const storageBinData = this.storageBinForm.getRawValue() as StorageBinRequestDto;
      const formValue = this.storageBinForm.value;

      if (this.formMode === 'E' && this.selectedStorageBin) {

        const editStorageBinData: StorageBinRequestDto = {
          binId: this.selectedStorageBin.binId,
          binCode: formValue.binCode ?? '',
          totalCapacity: formValue.totalCapacity ?? 0,
          warehouseId: formValue.warehouseId ?? 0
       }

        this.storageBinService.updateStorageBinById(formValue.warehouseId ?? 0, this.selectedStorageBin.binId ?? 0, editStorageBinData)
          .subscribe({
            // handle response---success
            next: (savedStorageBin) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Storage bin updated successfully');
              // this.storageBinForm.reset();
              this.toastnotificationService.show("Storage bin updated successfully", "success");
              this.cdr.markForCheck();
            },
            // handle response ----error
            error: (err) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('unable to update storage bin');
              console.log("Unable to update storage bin at backend", err);
              this.toastnotificationService.show("Unable to update storage bin", "error");
              this.cdr.markForCheck();
            }
          });
      } else {
        const newStorageBinDat: StorageBinRequestDto = {
          binCode: formValue.binCode ?? '',
          totalCapacity: formValue.totalCapacity ?? 0,
          warehouseId: formValue.warehouseId ?? 0
        };
        // Call backend
        this.storageBinService.createStorageBin(storageBinData, storageBinData.warehouseId)
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
              this.toastnotificationService.show("Unable to save storagebin!", "error");
              console.log("Unable to save storagebin at backend", err);
            }
          });
      }
    }
    else {
      this.toastnotificationService.show("Invalid form values", "error");
    }

  }

  // Clear Form Function
  clearStorageBinForm() {
    this.storageBinForm.reset();
  }
}

