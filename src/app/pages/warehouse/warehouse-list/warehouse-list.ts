import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WarehouseService } from '../warehouse.service';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './warehouse-list.html',
})
export class WarehouseList  implements OnInit{

 constructor(
    public warehouseService : WarehouseService
  ){

  }

  warehouses: Warehouse[] = [];
  totalWarehousesCount = signal<number>(0);

  ngOnInit(): void {
    this.warehouseService.getAllWarehouses()
    .subscribe({
      next: (warehouseList)=> {
        this.warehouses = warehouseList;
        this.totalWarehousesCount.set(warehouseList.length);
      },
      error: (err)=>{
        console.log("Unable to fetch warehouse list from backend", err);
      }
    });
  }
}
