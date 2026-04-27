
export interface InventoryItemRequestDto {
  //   productId: string;
  // rows: InventoryItemQuantityRequestDto[];

    inventoryItemId: number;

    quantity: number;

     productId: number;

    storageBinId: number;
}


export interface InventoryItemResponseDto {
  
    inventoryItemId: number;

    quantity: number;

    productName: string;

    storageBinCode: string;
}