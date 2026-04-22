import { Component, inject, OnInit, signal } from '@angular/core';
import { OutboundShipmentService } from '../outboundShipment.service';
import { OutboundShipmentResponseDto } from '../outboundShipment.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-outbound-shipment-list',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './outbound-shipment-list.html',
  styleUrl: './outbound-shipment-list.scss'
})
export class OutboundShipmentList implements OnInit{

  private outboundShipmentService = inject(OutboundShipmentService)

  outboundShipments: OutboundShipmentResponseDto[] = [];
  totalOutboundShipmentsCount= signal<number>(0);


  ngOnInit(): void {
    this.outboundShipmentService.getAllShipment()
    .subscribe({
      next: (outboundShipmentList)=> {
        this.outboundShipments = outboundShipmentList;
        this.totalOutboundShipmentsCount.set(outboundShipmentList.length);
      },
      error: (err)=>{
        console.log("Unable to fetch outboundShipment list from backend", err);
      }
    });
  }
}
