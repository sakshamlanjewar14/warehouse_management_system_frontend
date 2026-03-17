import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class WarehouseService{
     baseUrl= "http://localhost:8080/api/v1/warehouse";

    //  Inject HttpClient
     private readonly httpClient = inject(HttpClient);

    //  Calls backend
     getAllWarehouses() : Observable<Warehouse[]>{
        // Get data
        return this.httpClient.get<Warehouse[]>(this.baseUrl)
       .pipe(
             map((response: any) => {
               //console.log("getAllWarehouses::", response);
               return response.data;
            })
        );
     }

     getWarehouseById(warehouseId: number){
     
       }
     
       createWarehouse(warehouseData: Warehouse): Observable<Warehouse>{
        // Post Data
         return this.httpClient.post<Warehouse>(this.baseUrl, warehouseData)
         .pipe(
           map((response: any) => {
             //console.log("savedProduct::", response);
             return response.data;
           })
         );
       }
     
       updateWarehouseById(warehouseId: number, warehouseDetail: any){
     
       }
     
       deleteWarehouseById(warehouseId: number){
       
       }
     
}