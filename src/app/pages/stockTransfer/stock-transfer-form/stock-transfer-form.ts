import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { StockTransferItemResponseDto, StockTransferRequestDto, StockTransferResponseDto } from '../stockTransfer.model';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { WarehouseResponseDto } from '../../warehouse/warehouse.model';
import { ToastNotificationService } from '../../../shared/services/toast-notification.service';
import { Product } from '../../products/product.model';
import { StockTransferService } from '../stockTransfer.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-stock-transfer-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './stock-transfer-form.html',
  styleUrl: './stock-transfer-form.scss',
})
export class StockTransferForm implements OnInit {

  private formBuilder = inject(FormBuilder);
  private warehouseService = inject(WarehouseService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private toastNotificationService = inject(ToastNotificationService);
  private stockTransferService = inject(StockTransferService);


  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

  products: Product[] = [];
  selectedProductIds = signal<number[]>([]);
  warehouses: WarehouseResponseDto[] = [];
  selectedWarehouse: WarehouseResponseDto | null = null;

  // Strongly typed Reactive Form
  // Form Creation
  stockTransferForm = this.formBuilder.group({
    sourceWarehouseId: [null, [Validators.required]],
    destinationWarehouseId: [null, [Validators.required]],
    // status: ['', [Validators.required]],
    stockTransferItems: this.formBuilder.array([])
  });

  ngOnInit(): void {
    // get all warehouse from service
    this.warehouseService.getAllWarehouses()
      .subscribe({
        next: (warerhouseListResponse) => {
          this.warehouses = warerhouseListResponse;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("Unable to fetch warehouse list from backend", err);
          this.toastNotificationService.show("Unable to fetch warehouse list", "error");
          this.cdr.markForCheck();
        }
      });

    this.stockTransferItems.valueChanges.subscribe(() => {
      this.updateRows();
    });

     // get all product from service
    this.productService.getAllProducts()
      .subscribe({
        next: (productListResponse) => {
          this.products = productListResponse;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("Unable to fetch product list from backend", err);
          this.toastNotificationService.show("Unable to fetch product list", "error");
          this.cdr.markForCheck();
        }
      });
  }

  // A getter to easily the 'items' FormArray in the template
  get stockTransferItems(): FormArray {
    return this.stockTransferForm.get('stockTransferItems') as FormArray;
  }

  // Adding the row with button
  addTransferItemRow() {
    const row = new FormGroup({
      productId: new FormControl('', [Validators.required, Validators.minLength(1)]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
    this.stockTransferItems.push(row);
  }


  updateRows() {
    const selectedIds: number[] = [];
    this.stockTransferItems.controls.forEach((group, index) => {
      const productId = Number(group.get('productId')?.value);
      if (productId) selectedIds.push(productId);
    });
    this.selectedProductIds.set(selectedIds);
  }

  // For checking the product selected in any row. If selected, so it cant be add in another row
  isProductSelected(productId: number, currentRowIndex: number): boolean {
    console.log("isProductSelected::", productId)
    const selected = this.selectedProductIds();
    const currentControlValue = Number(this.stockTransferItems.at(currentRowIndex).get('productId')?.value);

    // Disable if the ID is used elsewhere, but NOT if it's the one in this row
    return productId != undefined && selected.includes(productId) && currentControlValue !== productId;
  }

  // Remove the row
  removeTransferItemRow(index: any) {
    this.stockTransferItems.removeAt(index);
  }

  // Clear Form Function
  clearStockTransferForm() {
    this.stockTransferForm.reset();
  }


  // Check form is valid
  onSubmit() {
    if (this.stockTransferForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('StockTransfer Data:', this.stockTransferForm.value);
      // Get form data
      const formValue = this.stockTransferForm.value;
      const items = this.stockTransferItems.value;

      //console.log("::formValue::",formValue, "::items::", items)

      const stockTransferData: StockTransferRequestDto = {
        sourceWarehouseId: formValue.sourceWarehouseId ?? 0,
        destinationWarehouseId: formValue.destinationWarehouseId ?? 0,
        // status: formValue.status ?? '',
        stockTransferItems: items
      };

      console.log("stockTransferData::", stockTransferData)

      // Call backend
      this.stockTransferService.createStockTransfer(stockTransferData)
        .subscribe({
          // Handle response--Success
          next: (savedStockTransfer) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Stock Transfer saved successfully!');
            this.stockTransferForm.reset();
            this.toastNotificationService.show("Stock Transfer saved successfully", "success");
            this.cdr.markForCheck();
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save Stock Transfer!');
            console.log("Unable to save Stock Transfer at backend", err);
            this.toastNotificationService.show("Unable to save Stock Transfer", "error");
            this.cdr.markForCheck();
          }
        });
    } else {
      this.toastNotificationService.show("Invalid form values", "error");
    }
  }



}
