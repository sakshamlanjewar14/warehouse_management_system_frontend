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
          return Response.data;
          console.log("getAllStorageBins" +Response.data)
        })
      );
  }

  getStorageBinBYiD(binId: Number) {

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
      )
  }

  updateStorageBinById(binId: number) {

  }

  deleteStorageBinById(binId: number) {

  }
}
