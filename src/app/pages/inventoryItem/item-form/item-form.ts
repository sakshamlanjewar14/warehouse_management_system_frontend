import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ItemService } from "../item.service";

// Component Setup
@Component({
  selector: 'app-item-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.scss',
})
export class InventoryItemForm {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private itemService = inject(ItemService);

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  // Strongly typed Reactive Form
  // Form Creation
  itemForm = this.formBuilder.group({
    quantity: [ 0, [Validators.required, Validators.minLength(1)]],
  });

  // Check form is valid
  onSubmit() {
    if (this.itemForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('Item Data:', this.itemForm.value);
      // Get form data
      const itemData = this.itemForm.getRawValue() as InventoryItem;
      // Call backend
      this.itemService.createItem(itemData)
        .subscribe({
          // Handle response--Success
          next: (savedItem) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Item saved successfully!');
            this.itemForm.reset();
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save item!');
            console.log("Unable to save item at backend", err);
          }
        });
    }
  }

  // Clear Form Function
  clearInventoryItemForm() {
    this.itemForm.reset();
  }


}