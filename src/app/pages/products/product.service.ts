import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl= "http://localhost:8080/api/v1/products";

  private readonly httpClient = inject(HttpClient);

  getAllProducts() : Observable<Product[]>{
    return this.httpClient.get<Product[]>(this.baseUrl)
    .pipe(
      map((response: any) => {
        //console.log("getAllProducts::", response);
        return response.data;
      })
    );
  }

  getProductById(productId: number):Observable<Product>{
    return this.httpClient
    .get<Product>(`${this.baseUrl}/${productId}`)
    .pipe(
      map((response: any)=>{
        console.log(response);
        return response.data;
      })
    );
    
  }


  createProduct(productData: Product): Observable<Product>{
    return this.httpClient.post<Product>(this.baseUrl, productData)
    .pipe(
      map((response: any) => {
        //console.log("savedProduct::", response);
        return response.data;
      })
    );
  }

  updateProduct(productId: number, productData: Product){
    return this.httpClient.put<Product>(this.baseUrl+"/"+productId, productData)
    .pipe(
      map((response: any)=>{
        return response.data;
      })
    )
  }

  deleteProductById(productId: number){
  
  }
}
