interface Warehouse{
  warehouseId?: number;
  name: string;
  location: string;
  capacity: string;
  barcode: string;
  storageBins?: []; 
}