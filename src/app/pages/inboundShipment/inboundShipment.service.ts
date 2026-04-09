import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InboundShipmentRequestDto, InboundShipmentResponseDto } from './inboundShipment.model';

@Injectable({
  providedIn: 'root',
})
export class InboundShipmentService {
  baseUrl= "http://localhost:8080/api/v1/inbound_shipment";

  private readonly httpClient = inject(HttpClient);

  getAllShipment() : Observable<InboundShipmentResponseDto[]>{
    return this.httpClient.get<InboundShipmentResponseDto[]>(this.baseUrl)
    .pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getShipmentById(shipmentId: number){

  }

  createShipment(inboundShipmentData: InboundShipmentRequestDto): Observable<InboundShipmentResponseDto>{
    return this.httpClient.post<InboundShipmentRequestDto>(this.baseUrl, inboundShipmentData)
    .pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  updateShipment(shipmentId: number){

  }

  deleteShipment(shipmentId: number){
  
  }
}
