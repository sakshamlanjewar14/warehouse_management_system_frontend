import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { InventoryItemRequestDto, InventoryItemResponseDto } from "./item.model";



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

  getInventoryItemById(inventoryItemId: number): Observable<InventoryItemResponseDto>{
    return this.httpClient.get<InventoryItemResponseDto>(`${this.baseUrl}/${inventoryItemId}`)
    .pipe(
      map((response: any)=>{
        console.log(response);
        return response.data;
      })
    );
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

  updateInventoryItemById(inventoryItemId: number, inventoryItemData: InventoryItemRequestDto){
    return this.httpClient.put<InventoryItemRequestDto>(this.baseUrl+"/"+inventoryItemId, inventoryItemData)
    .pipe(
      map((response: any)=>{
        return response.data;
      })
    );
  }

  deleteProductById(inventoryItemId: number){
  
  }
}
