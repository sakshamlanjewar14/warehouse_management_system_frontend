import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../warehouse.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastNotificationService } from '../../../shared/services/toast-notification.service';
import { WarehouseResponseDto } from '../warehouse.model';

@Component({
  selector: 'app-warehouse-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.scss',
})
export class WarehouseForm {

  private formBuilder = inject(FormBuilder)
  private warehouseService = inject(WarehouseService);
  private toastNotificationService = inject(ToastNotificationService)
  
  isSubmitting = signal(false);
  submitMessage = signal('');

  warehouseForm = this.formBuilder.group({
     name: ['', [Validators.required, Validators.minLength(3)]],
     location : ['', [Validators.required, Validators.minLength(3)]],
    //  capacity : ['', [Validators.required, Validators.minLength(1)]]
  }) 

  onSubmit(){
    if(this.warehouseForm.valid){
      this.isSubmitting.set(true);

      console.log('Warehouse Data:', this.warehouseForm.value);
      const warehouseData = this.warehouseForm.getRawValue() as WarehouseResponseDto;
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


