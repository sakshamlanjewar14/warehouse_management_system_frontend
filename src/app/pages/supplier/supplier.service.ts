import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SupplierItemRequestDto, SupplierItemResponseDto, SupplierRequestDto, SupplierResponseDto } from './supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  baseUrl= "http://localhost:8080/api/v1/suppliers";

  private readonly httpClient = inject(HttpClient);

  getAllSuppliers() : Observable<SupplierResponseDto[]>{
    return this.httpClient.get<SupplierResponseDto[]>(this.baseUrl)
    .pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getSupplierById(supplierId: any): Observable<SupplierResponseDto>{
    return this.httpClient.get<SupplierResponseDto>(this.baseUrl+"/"+supplierId)
    .pipe(map((response: any) => response.data));
  }

  createSupplier(supplierData: SupplierRequestDto): Observable<SupplierResponseDto>{
    return this.httpClient.post<SupplierRequestDto>(this.baseUrl, supplierData)
    .pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  assignProductsToSupplier(supplierId: number, assignedProductList: SupplierItemRequestDto[]) {
    return this.httpClient.post(this.baseUrl+"/assign-products/"+supplierId, assignedProductList)
    .pipe(map((response: any) => response.data));
  }

  updateSupplierById(supplierId: number, supplierDetail: any){

  }

  deleteSupplierById(supplierId: number){
  
  }
}
