import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../warehouse.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastNotificationService } from '../../../shared/services/toast-notification.service';
import { WarehouseRequestDto, WarehouseResponseDto } from '../warehouse.model';

@Component({
  selector: 'app-warehouse-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.scss',
})
export class WarehouseForm implements OnInit {

  private formBuilder = inject(FormBuilder)
  private warehouseService = inject(WarehouseService);
  private toastNotificationService = inject(ToastNotificationService)
  private activatedRoute = inject(ActivatedRoute)
  private cdr = inject(ChangeDetectorRef)
  
formMode: 'N' | 'E' = 'N';

  isSubmitting = signal(false);
  submitMessage = signal('');

selectedWarehouse: WarehouseResponseDto | null = null;

  warehouseForm = this.formBuilder.group({
     name: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s&.-]+$/)]],
     location : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s,.-]+$/)]],
  }) ;


  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(param=>{

      const warehouseId = param.get('warehouseId');

      if(warehouseId){
        this.formMode = 'E';
        console.log("form mode in::", this.formMode);

        // Api call
        this.warehouseService.getWarehouseById(parseInt(warehouseId))
        .subscribe({
          next: (response)=>{
            console.log("selectedWarehouse::", response);
            this.selectedWarehouse = response;
            this.warehouseForm.patchValue({
              name: this.selectedWarehouse.name,
              location: this.selectedWarehouse.location
            });
          },
          error:(err)=>{
            console.log("Unable to fetch selected warehouse data", err);
            this.toastNotificationService.show("Unable to fetch selected warehouse data", "error");
            this.cdr.markForCheck();
          }
        })
      }
    });
    console.log("form mode out::", this.formMode);

  }

  onSubmit(){
    if(this.warehouseForm.valid){
      this.isSubmitting.set(true);

      console.log('Warehouse Data:', this.warehouseForm.value);
      const warehouseData = this.warehouseForm.getRawValue() as WarehouseResponseDto;
      const formValue = this.warehouseForm.value

      if(this.formMode === 'E' && this.selectedWarehouse){
        const editWarehouseData: WarehouseRequestDto = {
          warehouseId: this.selectedWarehouse.warehouseId,
          name: this.selectedWarehouse.name,
          location: this.selectedWarehouse.location
        }

        // call backend
        this.warehouseService.updateWarehouse(this.selectedWarehouse.warehouseId, editWarehouseData)
         .subscribe({
            // Handle response--Success
            next: (savedStockTransfer) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Warehouse updated successfully!');
              this.warehouseForm.reset();
              this.toastNotificationService.show("Warehouse updated successfully", "success");
              this.cdr.markForCheck();
            },
            // Handle response--error
            error: (err) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Unable to update warehouse!');
              console.log("Unable to update warehouse at backend", err);
              this.toastNotificationService.show("Unable to update warehouse", "error");
              this.cdr.markForCheck();
            }
          });
      }else{
        
      }







      this.warehouseService.createWarehouse(warehouseData)
        .subscribe({
          next: (savedWarehouse) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Warehouse saved successfully!');
            this.warehouseForm.reset();
            this.toastNotificationService.show("Warehouse saved successfully!", "success")
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save warehouse!');
            this.toastNotificationService.show("Unable to save warehouse!", "error")
            console.log("Unable to save warehouse at backend", err);
          }
        })
    }
  }

  // Clear Form Function
  clearWarehouseForm() {
    this.warehouseForm.reset();
  }
}


