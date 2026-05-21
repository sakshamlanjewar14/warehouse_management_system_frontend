import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { InboundShipmentResponseDto } from '../inboundShipment.model';
import { InboundShipmentService } from '../inboundShipment.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierResponseDto } from '../../supplier/supplier.model';

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
  private cdr = inject(ChangeDetectorRef)

  // states
  shipment: InboundShipmentResponseDto | null=null;
  supplier: SupplierResponseDto | null = null;
  isLoding=true;


  ngOnInit(): void {
    const shipmentId = this.activatedRoute.snapshot.paramMap.get('shipmentId');
    const supplierId = this.activatedRoute.snapshot.paramMap.get('supplierId') ?? 0;

    if(shipmentId){
      this.shipmentService.getShipmentDetails(+shipmentId, +supplierId).subscribe({
        next:(response)=>{
          this.shipment = response['inboundShipmentResponseDto'];
          this.supplier = response['supplierResponseDto'];
          this.isLoding=false;
          this.cdr.markForCheck();
        },
        error: () =>{
          this.isLoding=false;
        }
      })
    }
  }
}
