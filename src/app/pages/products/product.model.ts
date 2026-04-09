export interface Product {
  productId?: number;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  price:number;
  weight: number;
  imageUrl: string;
  inventoryItems?: [];
}