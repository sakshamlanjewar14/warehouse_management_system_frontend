import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class StorageBinService{
    baseUrl ="http://localhost:8080/api/v1/storagebins";

    private readonly httpClient = inject(HttpClient);

    getAllStorageBins() :Observable<StorageBin[]>{
        return this.httpClient.get<StorageBin[]>(this.baseUrl)
        .pipe(
            map((Response : any)=>{
                return Response.data;
            })
        );
    }

    getStorageBinBYiD(binId : Number){

    }

     createStorageBin(storageBinData: StorageBin): Observable<StorageBin>{
    return this.httpClient.post<StorageBin>(this.baseUrl, storageBinData)
    .pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  updateStorageBinById(binId : number){

  }

  deleteStorageBinById(binId : number){

  }
}
