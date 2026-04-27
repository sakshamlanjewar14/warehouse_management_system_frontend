import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OutboundShipmentService } from '../outboundShipment.service';
import { OutboundShipmentResponseDto } from '../outboundShipment.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-outbound-shipment-details',
  standalone:true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './outbound-shipment-details.html',
  styleUrl: './outbound-shipment-details.scss',
})
export class OutboundShipmentDetails {

  private outboundShipmentService = inject(OutboundShipmentService)
  private activatedRoute = inject(ActivatedRoute)

  shipment: OutboundShipmentResponseDto | null=null;
  isLoding=true;

  ngOnInit(): void{

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id){
      this.outboundShipmentService.getShipmentById(+id).subscribe({
        next:(response)=>{
          this.shipment = response
          this.isLoding = false;
        },
        error:()=>{
          this.isLoding=false
        }
      })
    }
  }
}
