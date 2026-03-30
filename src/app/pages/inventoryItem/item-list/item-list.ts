import { Component, inject, OnInit, signal } from "@angular/core";
import { ItemService } from "../item.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule, MatButtonModule],
  templateUrl: './item-list.html'
})
export class InventoryItemList implements OnInit {

  private snackBar = inject(MatSnackBar);

  constructor(
    public itemService: ItemService
  ) {

  }

  inventoryItems: InventoryItemResponseDto[] = [];
  totalItemsCount = signal<number>(0);
  isOpen: boolean = false;

  ngOnInit(): void {
    this.itemService.getAllItems()
      .subscribe({
        next: (itemList) => {
          this.inventoryItems = itemList;
          this.totalItemsCount.set(itemList.length);
        },
        error: (err) => {
          this.snackBar.open(err.error.message, 'Dismiss', {
            panelClass: ['bg-red-200', 'text-red-800'],
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center', // 'start' | 'center' | 'end' | 'left' | 'right'
            verticalPosition: 'bottom', // 'top' | 'bottom'
          });
          console.log("Unable to fetch item list from backend", err);
        }
      });
  }

  onModalClose(): void {
    this.isOpen = false;
  }

  onModalOpen(): void {
    this.isOpen = true;
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }
}