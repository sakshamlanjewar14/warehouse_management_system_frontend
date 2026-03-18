import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root',
})
export class ItemService {
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

  getProductById(productId: number){

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

  updateProductById(productId: number, productDetail: any){

  }

  deleteProductById(productId: number){
  
  }
}
