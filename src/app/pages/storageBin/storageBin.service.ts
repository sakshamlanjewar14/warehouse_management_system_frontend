import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
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
        map((Response: any) => {
          return Response.data;
        })
      );
  }

  getStorageBinBYiD(binId: Number) {

  }

  createStorageBin(storageBinData: StorageBinRequestDto): Observable<StorageBinResponseDto> {
    return this.httpClient.post<StorageBinRequestDto>(this.baseUrl, storageBinData)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  updateStorageBinById(binId: number) {

  }

  deleteStorageBinById(binId: number) {

  }
}
