import { Component, inject, OnInit } from '@angular/core';
import { InboundShipmentResponseDto } from '../inboundShipment.model';
import { InboundShipmentService } from '../inboundShipment.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inbound-shipment-details',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inbound-shipment-details.html',
  styleUrl: './inbound-shipment-details.scss',
})
export class InboundShipmentDetails implements OnInit {

  // Dependency
  private shipmentService = inject(InboundShipmentService)
  private activatedRoute = inject(ActivatedRoute)

  // states
  shipment: InboundShipmentResponseDto | null=null;
  isLoding=true;


  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id){
      this.shipmentService.getShipmentById(+id).subscribe({
        next:(response)=>{
          this.shipment = response
          this.isLoding=false;
        },
        error: () =>{
          this.isLoding=false;
        }
      })
    }
    }
}
