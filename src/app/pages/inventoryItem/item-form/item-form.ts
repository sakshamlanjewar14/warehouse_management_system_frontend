import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ItemService } from "../item.service";
import { startWith } from "rxjs";

// Component Setup
@Component({
  selector: 'app-item-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.scss',
})
export class InventoryItemForm implements OnInit{

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private itemService = inject(ItemService);

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');
  totalQuantity = signal(0);

  products = [
    { id: 101, name: 'Laptop' },
    { id: 102, name: 'Smartphone' },
    { id: 103, name: 'Monitor' }
  ];

  availableBins = [
    {id: 1, name: 'Bin A', availableCapacity: 10},
    {id: 2, name: 'Bin B', availableCapacity: 100},
    {id: 3, name: 'Bin C', availableCapacity: 40}];
  // Signal to track which bins are currently chosen in the form
  selectedBinIds = signal<number[]>([]);

  // Strongly typed Reactive Form
  // Form Creation
  itemForm = this.formBuilder.group({
    product: [ '', [Validators.required, Validators.minLength(1)]],
    rows: this.formBuilder.array([])
  });

  // A getter to easily access the 'items' FormArray in the template
  get rows(): FormArray {
    return this.itemForm.get('rows') as FormArray;
  }

  get isProductSelected() {
    return !this.itemForm.get('product')?.value;
  }

  ngOnInit(): void {
    this.rows.valueChanges.subscribe(() => {
      this.enforceCapacityAndCalculateTotalQuantity();
    });
  }

  private enforceCapacityAndCalculateTotalQuantity() {
    let currentTotal = 0;
    const selectedIds: number[] = [];

    this.rows.controls.forEach((group, index) => {
      const binId = Number(group.get('bin')?.value);
      const bin = this.availableBins.find(b => b.id === binId);
      let quantity = Number(group.get('quantity')?.value) || 0;

      // Logic: If quantity exceeds capacity, force it back to the max
      if (bin && quantity > bin.availableCapacity) {
        quantity = bin.availableCapacity;
        // emitEvent: false prevents infinite loops in valueChanges
        group.get('quantity')?.setValue(quantity, { emitEvent: false });
      }

      currentTotal += quantity;
      if (binId) selectedIds.push(binId);
    });

    this.totalQuantity.set(currentTotal);
    this.selectedBinIds.set(selectedIds);
  }

  // Helper to find capacity based on selected ID in a row
  getBinCapacity(index: number): number | string {
    const binId = Number(this.rows.at(index).get('bin')?.value);
    const bin = this.availableBins.find(b => b.id === binId);
    return bin ? bin.availableCapacity : '-';
  }

  // Your requested helper function
  isBinDisabled(binId: number, currentRowIndex: number): boolean {
    const selected = this.selectedBinIds();
    const currentControlValue = Number(this.rows.at(currentRowIndex).get('bin')?.value);

    // Disable if the ID is used elsewhere, but NOT if it's the one in this row
    return selected.includes(binId) && currentControlValue !== binId;
  }

  addRow(){
    const row = new FormGroup({
      bin: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
      quantity: new FormControl(0, { nonNullable: true, validators: [Validators.min(1)] })
    });
    this.rows.push(row);
  }

  removeRow(index: number){
    this.rows.removeAt(index);
  }

  // Check form is valid
  onSubmit() {
    if (this.itemForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('Item Data:', this.itemForm.value);
      // Get form data
      // const itemData = this.itemForm.getRawValue() as InventoryItem;
      // // Call backend
      // this.itemService.createItem(itemData)
      //   .subscribe({
      //     // Handle response--Success
      //     next: (savedItem) => {
      //       this.isSubmitting.set(false);
      //       this.submitMessage.set('Item saved successfully!');
      //       this.itemForm.reset();
      //     },
      //     // Handle response--error
      //     error: (err) => {
      //       this.isSubmitting.set(false);
      //       this.submitMessage.set('Unable to save item!');
      //       console.log("Unable to save item at backend", err);
      //     }
      //   });
    }
  }

  // Clear Form Function
  clearInventoryItemForm() {
    this.itemForm.reset();
  }


}
