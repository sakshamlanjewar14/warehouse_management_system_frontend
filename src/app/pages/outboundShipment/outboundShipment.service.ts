import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { OutboundShipmentRequestDto, OutboundShipmentResponseDto } from "./outboundShipment.model";

@Injectable({
    providedIn: 'root'
})
export class OutboundShipmentService {
    baseUrl = "http://localhost:8080/api/v1/outbound_shipment";

    private readonly httpClient = inject(HttpClient);

    createShipment(outboundShipmentData: OutboundShipmentRequestDto): Observable<OutboundShipmentResponseDto> {
        return this.httpClient.post<OutboundShipmentRequestDto>(this.baseUrl, outboundShipmentData)
            .pipe(
                map((response: any) => {
                    return response.data;
                })
            );
    }

    getAllShipment(): Observable<OutboundShipmentResponseDto[]> {
        return this.httpClient.get<OutboundShipmentResponseDto[]>(this.baseUrl)
            .pipe(
                map((response: any) => {
                    return response.data;
                })
            )
    }


    getShipmentById(shipmentId: number): Observable<OutboundShipmentResponseDto> {
        return this.httpClient
            .get<OutboundShipmentResponseDto>(`${this.baseUrl}/${shipmentId}`)
            .pipe(
                map((response: any) => {
                    console.log(response);
                    return response.data
                })
            );
    }


    updateShipment(shipmentId: number) {

    }

    deleteShipment(shipmentId: number) {

    }

}