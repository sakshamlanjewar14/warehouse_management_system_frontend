import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { WarehouseRequestDto, WarehouseResponseDto } from "./warehouse.model";

@Injectable({
  providedIn: 'root',
})

export class WarehouseService {
  baseUrl = "http://localhost:8080/api/v1/warehouse";

  //  Inject HttpClient
  private readonly httpClient = inject(HttpClient);

  //  Calls backend
  getAllWarehouses(): Observable<WarehouseResponseDto[]> {
    // Get data
    return this.httpClient.get<WarehouseResponseDto[]>(this.baseUrl)
      .pipe(
        map((response: any) => {
          //console.log("getAllWarehouses::", response);
          return response.data;
        })
      );
  }

  getWarehouseById(warehouseId: number): Observable<WarehouseResponseDto> {
    return this.httpClient
    .get<WarehouseResponseDto>(`${this.baseUrl}/${warehouseId}`)
    .pipe(
      map((response: any)=>{
        console.log(response);
        return response.data;
      })
    );
  }

  createWarehouse(warehouseData: WarehouseResponseDto): Observable<WarehouseResponseDto> {
    // Post Data
    return this.httpClient.post<WarehouseResponseDto>(this.baseUrl, warehouseData)
      .pipe(
        map((response: any) => {
          //console.log("savedProduct::", response);
          return response.data;
        })
      );
  }

  updateWarehouse(warehouseId: number, warehouseData: any) {
    return this.httpClient.put<WarehouseRequestDto>(this.baseUrl + "/" + warehouseId, warehouseData)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  deleteWarehouseById(warehouseId: number) {

  }

}