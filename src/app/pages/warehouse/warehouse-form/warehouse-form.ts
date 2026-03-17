import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../warehouse.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-warehouse-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.scss',
})
export class WarehouseForm {

  private formBuilder = inject(FormBuilder)
  private warehouseService = inject(WarehouseService);
  
  isSubmitting = signal(false);
  submitMessage = signal('');

  warehouseForm = this.formBuilder.group({
     name: ['', [Validators.required, Validators.minLength(3)]],
     location : ['', [Validators.required, Validators.minLength(3)]],
     capacity : ['', [Validators.required, Validators.minLength(1)]]
  }) 

  onSubmit(){
    if(this.warehouseForm.valid){
      this.isSubmitting.set(true);

      console.log('Warehouse Data:', this.warehouseForm.value);
      const warehouseData = this.warehouseForm.getRawValue() as Warehouse;
      this.warehouseService.createWarehouse(warehouseData)
        .subscribe({
          next: (savedWarehouse) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Warehouse saved successfully!');
            this.warehouseForm.reset();
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save warehouse!');
            console.log("Unable to save warehouse at backend", err);
          }
        })
    }
  }

  // Clear Form Function
  clearProductForm() {
    this.warehouseForm.reset();
  }
}


