import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { map, Observable } from 'rxjs';
import { StockTransferRequestDto, StockTransferResponseDto } from './stockTransfer.model';

@Injectable({
    providedIn: 'root'
})
export class StockTransferService{
    baseUrl= "http://localhost:8080/api/v1/stock_transfer";

    private readonly hjttpClient = inject(HttpClient);

    createStockTransfer(stockTransferData: StockTransferRequestDto):Observable<StockTransferResponseDto>{
        return this.hjttpClient.post<StockTransferRequestDto>(this.baseUrl, stockTransferData)
        .pipe(
            map((response: any)=>{
                return response.data;
            })
        );
    }


    getAllStockTransfer():Observable<StockTransferResponseDto[]>{
        return this.hjttpClient.get<StockTransferResponseDto[]>(this.baseUrl)
        .pipe(
            map((response:any)=>{
                return response.data;
            })
        );
    }


    getStockTransferById(): Observable<StockTransferResponseDto[]>{
        return this.hjttpClient.get<StockTransferResponseDto[]>(this.baseUrl)
        .pipe(
            map((response: any)=>{
                return response.data;
            })
        );
    }


    updateStockTransfer(id: number){

    }

    deleteStockTransfer(id: number){
        
    }
}