import { Component, signal, computed, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InboundShipmentService } from '../inboundShipment.service';
import { InboundShipmentResponseDto } from '../inboundShipment.model';


@Component({
  selector: 'app-inboundShipment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inboundShipment-list.html',
  styleUrls: ["./inboundShipment-list.scss"]
})
export class InboundShipmentList implements OnInit {

  constructor(
    public inboundShipmentService: InboundShipmentService
  ){

  }

  inboundShipments: InboundShipmentResponseDto[] = [];
  totalInboundShipmentsCount = signal<number>(0);

  ngOnInit(): void {
    this.inboundShipmentService.getAllShipment()
    .subscribe({
      next: (inboundShipmentList)=> {
        this.inboundShipments = inboundShipmentList;
        this.totalInboundShipmentsCount.set(inboundShipmentList.length);
      },
      error: (err)=>{
        console.log("Unable to fetch inboundShipment list from backend", err);
      }
    });
  }
  
}