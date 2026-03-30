import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class StorageBinService {
  baseUrl = "http://localhost:8080/api/v1/storagebins";

  private readonly httpClient = inject(HttpClient);

  getAllStorageBins(): Observable<StorageBinResponse[]> {
    return this.httpClient.get<StorageBinResponse[]>(this.baseUrl)
      .pipe(
        map((Response: any) => {
          return Response.data;
        })
      );
  }

  getStorageBinBYiD(binId: Number) {

  }

  createStorageBin(storageBinData: StorageBinRequest): Observable<StorageBinResponse> {
    return this.httpClient.post<StorageBinRequest>(this.baseUrl, storageBinData)
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