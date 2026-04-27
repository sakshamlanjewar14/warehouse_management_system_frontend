// interface Warehouse {
//   warehouseId?: number;
//   name: string;
//   location: string;
//   capacity: string;
//   storageBins?: [];
// }

export interface WarehouseRequestDto {
  name: string;
  location: string;
  capacity: number;
}

export interface WarehouseResponseDto {
  warehouseId?: number;
  name: string;
  location: string;
  capacity: number;
  storageBins?: [];
}