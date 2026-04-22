import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OutboundShipmentService } from '../outboundShipment.service';
import { OutboundShipmentResponseDto } from '../outboundShipment.model';

@Component({
  selector: 'app-outbound-shipment-details',
  standalone:true,
  imports: [],
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
