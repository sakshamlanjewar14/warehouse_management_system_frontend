import { StorageBinService } from './../../storageBin/storageBin.service';
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ItemService } from "../item.service";
import { startWith } from "rxjs";
import { ProductService } from "../../products/product.service";
import { StorageBinResponseDto } from '../../storageBin/storageBin.model';
import { ToastNotificationService } from '../../../shared/services/toast-notification.service';
import { InventoryItemRequestDto, InventoryItemResponseDto } from '../item.model';
import { ProductResponseDto } from '../../products/product.model';

// Component Setup
@Component({
  selector: 'app-item-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryItemForm implements OnInit {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private itemService = inject(ItemService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private binService = inject(StorageBinService);
  private toastNotificatonService = inject(ToastNotificationService)
  private activatedRoute = inject(ActivatedRoute)

  formMode: 'N' | 'E' = 'N';

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');
  totalQuantity = signal(0);

  products: ProductResponseDto[] = [];
  bins: StorageBinResponseDto[] = [];

  selectedInventoryItem: InventoryItemResponseDto | null = null;

  // Signal to track which bins are currently chosen in the form
  selectedBinIds = signal<number[]>([]);

  // Strongly typed Reactive Form
  // Form Creation
  itemForm = this.formBuilder.group({
    productId: [0, [Validators.required]],
    rows: this.formBuilder.array([])
  });

  // A getter to easily access the 'items' FormArray in the template
  get rows(): FormArray {
    return this.itemForm.get('rows') as FormArray;
  }

  get isProductSelected() {
    const prod = this.itemForm.get('productId')?.value ?? 0;
    return prod > 0;
  }


  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe(params => {

      const inventoryItemId = params.get('inventoryItemId');

      if (inventoryItemId) {
        this.formMode = 'E';
        console.log("form mode in::", this.formMode);

        // Api call
        this.itemService.getInventoryItemById(parseInt(inventoryItemId))
          .subscribe({
            next: (response) => {
              console.log("selectedInventoryItem::", response);
              this.selectedInventoryItem = response;
              this.itemForm.patchValue({
                productId: this.selectedInventoryItem.productId

              });
            },
            error: (err) => {
              console.log("Unable to fetch inventory item from backend", err);
              this.toastNotificatonService.show("Unable to fetch selected inventory item data", "error");
              this.cdr.markForCheck();
            }
          })
      }
    });
    console.log("form mode out::", this.formMode);

    this.productService.getAllProducts()
      .subscribe({
        next: (productListResponse) => {
          this.products = productListResponse;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("Unable to fetch product list from backend", err);
        }
      });

    this.binService.getAllStorageBins()
      .subscribe({
        next: (binListResponse) => {
          this.bins = binListResponse;
          this.addRow();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("Unable to fetch bin list from backend", err);
        }
      })

    this.rows.valueChanges.subscribe(() => {
      this.enforceCapacityAndCalculateTotalQuantity();
    });
  }

  private enforceCapacityAndCalculateTotalQuantity() {
    let currentTotal = 0;
    const selectedIds: number[] = [];

    this.rows.controls.forEach((group, index) => {
      const binId = Number(group.get('storageBinId')?.value);
      const bin = this.bins.find(b => b.binId === binId);
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
    const binId = Number(this.rows.at(index).get('storageBinId')?.value);
    const bin = this.bins.find(b => b.binId === binId);
    return bin ? bin.availableCapacity : '-';
  }

  // Your requested helper function
  isBinDisabled(binId: number | undefined, currentRowIndex: number): boolean {
    const selected = this.selectedBinIds();
    const currentControlValue = Number(this.rows.at(currentRowIndex).get('storageBinId')?.value);

    // Disable if the ID is used elsewhere, but NOT if it's the one in this row
    return binId != undefined && selected.includes(binId) && currentControlValue !== binId;
  }

  addRow() {
    const row = new FormGroup({
      storageBinId: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
      quantity: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] })
    });
    this.rows.push(row);
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  // Check form is valid
  onSubmit() {
    if (this.itemForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('Item Data:', this.itemForm.value);
      // Get form data
      //const itemData = this.itemForm.getRawValue() as InventoryItemRequestDto;
      const formValue = this.itemForm.value;

      if (this.formMode === 'E' && this.selectedInventoryItem) {

        const editInventoryItemData: InventoryItemRequestDto = {
          inventoryItemId: this.selectedInventoryItem.inventoryItemId,
          quantity: formValue.quantity  ?? 0,
          productId: formValue.productId ?? 0,
          storageBinId: formValue.storageBinId ?? 0
        }

        // Call backend
        this.itemService.updateInventoryItemById(this.selectedInventoryItem.inventoryItemId, editInventoryItemData)
          .subscribe({
            // Handle response---success
            next: (savedInventoryItem) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Inventory item saved successfully');
              this.itemForm.reset();
              this.toastNotificatonService.show("Inventory item saved successfully");
              this.cdr.markForCheck();
            },
            // handle response---error
            error: (err) => {
              this.isSubmitting.set(false);
              this.submitMessage.set("Unable to update inventory item");
              console.log("Unable to update inventory item at backend");
              this.toastNotificatonService.show("Unable to update inventory item", "error");
              this.cdr.markForCheck();
            }
          });
      } else {
        const newInventoryItem: InventoryItemRequestDto = {
          quantity: formValue.quantity ?? 0,
          productId: formValue.productId ?? 0,
          storageBinId: formValue.storageBinId ?? 0
        };

        // // Call backend
        this.itemService.createItem(itemData)
          .subscribe({
            // Handle response--Success
            next: (savedItem) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Item saved successfully!');
              this.itemForm.reset();
              this.toastNotificatonService.show("Item saved successfully!", "success");
            },
            // Handle response--error
            error: (err) => {
              this.isSubmitting.set(false);
              this.submitMessage.set('Unable to save item!');
              this.toastNotificatonService.show("Unable to save item!", "error");
              console.log("Unable to save item at backend", err);
            }
          });
      }
    } else {
      this.toastNotificatonService.show("Invalid form values", "error");
    }
  }

   // Clear Form Function
    clearInventoryItemForm() {
      this.itemForm.reset();
      this.itemForm.get('productId')?.setValue(0);
      this.cdr.markForCheck();
    }
}
