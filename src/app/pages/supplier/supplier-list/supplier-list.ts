import { SupplierService } from './../supplier.service';
import { Component, signal, computed, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierResponseDto } from '../supplier.model';


@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-list.html',
  styleUrls: ['./supplier-list.scss']
})
export class SupplierList implements OnInit {

  constructor(
    public supplierService: SupplierService
  ){

  }

  suppliers: SupplierResponseDto[] = [];
  totalSuppliersCount = signal<number>(0);

  ngOnInit(): void {
    this.supplierService.getAllSuppliers()
    .subscribe({
      next: (supplierList)=> {
        this.suppliers = supplierList;
        this.totalSuppliersCount.set(supplierList.length);
      },
      error: (err)=>{
        console.log("Unable to fetch supplier list from backend", err);
      }
    });
  }
  
}