import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SupplierRequestDto, SupplierResponseDto } from './supplier.model';

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

  getSupplierById(supplierId: number){

  }

  createSupplier(supplierData: SupplierRequestDto): Observable<SupplierResponseDto>{
    return this.httpClient.post<SupplierRequestDto>(this.baseUrl, supplierData)
    .pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  updateSupplierById(supplierId: number, supplierDetail: any){

  }

  deleteSupplierById(supplierId: number){
  
  }
}
