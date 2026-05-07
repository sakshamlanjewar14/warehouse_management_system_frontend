import { Product } from "../products/product.model";
import { WarehouseResponseDto } from "../warehouse/warehouse.model";

export interface StockTransferRequestDto {
    id?: number;

    sourceWarehouseId: number;

    destinationWarehouseId: number;

    status?: string;

    stockTransferItems?: StockTransferItemRequestDto[];
}

export interface StockTransferItemRequestDto {

    id?: number;

    stockTransferId: number;

    productId: number;

    quantity: number;
}

export interface StockTransferResponseDto {

    id?: number;

    sourceWarehouse: WarehouseResponseDto;

    destinationWarehouse: WarehouseResponseDto;

    status: TransferStatus;

    stockTransferItems: StockTransferItemResponseDto[];
}

export interface StockTransferItemResponseDto {
    
    id?: number;

    stockTransferId: number;

    product: Product[];

    quantity: number;
}

export enum TransferStatus {
    DRAFT,
    APPROVED,
    COMPLETED,
    CANCELLED
}