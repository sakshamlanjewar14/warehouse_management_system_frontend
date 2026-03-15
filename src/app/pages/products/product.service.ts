import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl= "http://localhost:8080/api/v1/products";

  private readonly httpClient = inject(HttpClient);

  getAllProducts(){
    return this.httpClient.get(this.baseUrl)
    .pipe(
      map((response: any) => {
        console.log("getAllProducts::", response);
        return response;
      })
    );
  }

  getProductById(productId: number){

  }

  createProduct(product: any){

  }

  updateProductById(productId: number, productDetail: any){

  }

  deleteProductById(productId: number){
  
  }
}
