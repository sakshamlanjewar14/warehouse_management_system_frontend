import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { StorageBinRequestDto, StorageBinResponseDto } from "./storageBin.model";


@Injectable({
  providedIn: 'root',
})
export class StorageBinService {
  baseUrl = "http://localhost:8080/api/v1/storagebins";

  private readonly httpClient = inject(HttpClient);

  getAllStorageBins(): Observable<StorageBinResponseDto[]> {
    return this.httpClient.get<StorageBinResponseDto[]>(this.baseUrl)
      .pipe(
        tap((response) => {
          console.log("Full API Response:", response);
        }),
        map((Response: any) => {
           console.log("getAllStorageBins" + Response.data)
          return Response.data;
        })
      );
  }

  createStorageBin(storageBinData: StorageBinRequestDto, warehouseId: number): Observable<StorageBinResponseDto> {
    return this.httpClient.post<StorageBinRequestDto>(this.baseUrl + "/" + warehouseId, storageBinData)
      // .pipe(
      //   map((response: any) => {
      //     return response.data;
      //     console.log("Response:" response.Data)
      //   })
      // );
      .pipe(
        tap((response) => {
          console.log("Full API Response:", response);
        }),
        map((response: any) => response.data)
      );
  }

  getstorageBinById(binId: number): Observable<StorageBinResponseDto> {
    return this.httpClient
      .get<StorageBinResponseDto>(`${this.baseUrl}/${binId}`)
      .pipe(
        map((response: any) => {
          console.log(response);
          return response.data;
        })
      );
  }



  updateStorageBinById( warehouseId: number, binId: number,storageBinData: StorageBinRequestDto):Observable<StorageBinResponseDto> {
    return this.httpClient.put<StorageBinRequestDto>(this.baseUrl + "/" + warehouseId + "/" + binId , storageBinData) 
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );

  }

  deleteStorageBinById(binId: number) {

  }
}
