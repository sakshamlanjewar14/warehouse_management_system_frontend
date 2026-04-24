import { ToastNotificationService } from './../../../shared/services/toast-notification.service';
import { Component, inject, signal } from "@angular/core";
import { StorageBinService } from "../storageBin.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { StorageBinRequest } from "../storageBin.model";


// Component Setup
@Component({
  selector: 'app-bin-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './bin-form.html',
  styleUrl: './bin-form.scss',
})
export class StorageBinForm{

    // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private storageBinService = inject(StorageBinService);
  private toastnotificationService = inject(ToastNotificationService);

   // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  // Strongly typed Reactive Form
  // Form Creation
  storageBinForm = this.formBuilder.group({
    binCode: ['', [Validators.required, Validators.minLength(1)]],
    capacity: [0, [Validators.required, Validators.minLength(1)]],
  });

   // Check form is valid
  onSubmit() {
    if (this.storageBinForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('StorageBin Data:', this.storageBinForm.value);
      // Get form data
      const storageBinData = this.storageBinForm.getRawValue() as StorageBinRequest;


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