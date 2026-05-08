import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockTransferService } from '../stockTransfer.service';
import { StockTransferItemResponseDto, StockTransferResponseDto } from '../stockTransfer.model';

@Component({
  selector: 'app-stock-transfer-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './stock-transfer-list.html',
  styleUrl: './stock-transfer-list.scss',
})
export class StockTransferList implements OnInit {

  private stockTransferService = inject(StockTransferService)

  stockTransfers: StockTransferResponseDto[] = [];
  totalStockTransfersCount = signal<number>(0);

  ngOnInit(): void {
    this.stockTransferService.getAllStockTransfer()
    .subscribe({
      next: (stockTransferList)=> {
        this.stockTransfers = stockTransferList;
        this.totalStockTransfersCount.set(stockTransferList.length);
      },
      error: (err)=>{
        console.log("Unable to fetch list from backend", err)
      }
    })
  }

  getTotalQuantity(stockTransferItems: StockTransferItemResponseDto[]){
    const totalQty = stockTransferItems.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.quantity;
    }, 0);
    return totalQty;
  }
}
