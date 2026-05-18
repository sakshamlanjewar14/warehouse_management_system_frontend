import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductRequestDto, ProductResponseDto } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl= "http://localhost:8080/api/v1/products";

  private readonly httpClient = inject(HttpClient);

  getAllProducts() : Observable<ProductResponseDto[]>{
    return this.httpClient.get<ProductResponseDto[]>(this.baseUrl)
    .pipe(
      map((response: any) => {
        //console.log("getAllProducts::", response);
        return response.data;
      })
    );
  }

  getProductById(productId: number):Observable<ProductResponseDto>{
    return this.httpClient
    .get<ProductResponseDto>(`${this.baseUrl}/${productId}`)
    .pipe(
      map((response: any)=>{
        console.log(response);
        return response.data;
      })
    );
    
  }


  createProduct(productData: ProductRequestDto): Observable<ProductResponseDto>{
    return this.httpClient.post<ProductRequestDto>(this.baseUrl, productData)
    .pipe(
      map((response: any) => {
        //console.log("savedProduct::", response);
        return response.data;
      })
    );
  }

  updateProduct(productId: number, productData: ProductRequestDto){
    return this.httpClient.put<ProductRequestDto>(this.baseUrl+"/"+productId, productData)
    .pipe(
      map((response: any)=>{
        return response.data;
      })
    )
  }

  deleteProductById(productId: number){
  
  }
}
