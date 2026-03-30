import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";



@Injectable({
  providedIn: 'root',
})
export class ItemService {
  baseUrl= "http://localhost:8080/api/v1/inventoryitems";

  private readonly httpClient = inject(HttpClient);

  getAllItems() : Observable<InventoryItemResponseDto[]>{
    return this.httpClient.get<InventoryItemResponseDto[]>(this.baseUrl)
    .pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getItemById(inventoryItemId: number){

  }

  createItem(itemData: InventoryItemRequestDto): Observable<InventoryItemResponseDto[]>{
    return this.httpClient.post<InventoryItemResponseDto[]>(this.baseUrl, itemData)
    .pipe(
      map((response: any) => {
        //console.log("savedProduct::", response);
        return response.data;
      })
    );
  }

  updateItemById(inventoryItemId: number, inventoryItemDetails: any){

  }

  deleteProductById(inventoryItemId: number){
  
  }
}
