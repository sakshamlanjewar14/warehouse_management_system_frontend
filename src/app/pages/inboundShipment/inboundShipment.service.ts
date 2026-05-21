import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InboundShipmentRequestDto, InboundShipmentResponseDto } from './inboundShipment.model';

@Injectable({
  providedIn: 'root',
})
export class InboundShipmentService {
  baseUrl = "http://localhost:8080/api/v1/inbound_shipment";

  private readonly httpClient = inject(HttpClient);

  createShipment(inboundShipmentData: InboundShipmentRequestDto): Observable<InboundShipmentResponseDto> {
    return this.httpClient.post<InboundShipmentRequestDto>(this.baseUrl, inboundShipmentData)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }


  getAllShipment(): Observable<InboundShipmentResponseDto[]> {
    return this.httpClient.get<InboundShipmentResponseDto[]>(this.baseUrl)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }


  getShipmentDetails(shipmentId: number,supplierId:number){
    return this.httpClient.get<{ data: InboundShipmentResponseDto }>(`${this.baseUrl}/${shipmentId}?supplierId=${supplierId}`)
      .pipe(
        map((response: any) => {
          console.log(response);
          return response.data
        })
      );
  }


  getShipmentById(shipmentId: number): Observable<InboundShipmentResponseDto> {
    return this.httpClient.get<{ data: InboundShipmentResponseDto }>(`${this.baseUrl}/${shipmentId}`)
      .pipe(
        map((response: any) => {
          console.log(response);
          return response.data
        })
      );
  }



  updateShipment(shipmentId: number, shipmentData: InboundShipmentRequestDto) {
    return this.httpClient.put<InboundShipmentRequestDto>(this.baseUrl+"/"+shipmentId, shipmentData)
    .pipe(
      map((response:any)=>{
        return response.data;
      })
    );

  }


  deleteShipment(shipmentId: number) {

  }
}
