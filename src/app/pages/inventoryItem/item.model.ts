
export interface InventoryItemRequestDto {

  inventoryItemId?: number;

  // quantity : number;

  productId: number;

  // storageBinId : number;
}

export interface InventoryItemBinRequestDto {

  inventoryItemBinId: number;

  quantity: number;

  storageBinId: number;

  inventoryItemId: number;

}


export interface InventoryItemResponseDto {

  inventoryItemId: number;

  quantity: number;

  productName: string;

  productId: number;

  inventoryItemBins: InventoryItemBinResponseDto;

  // storageBinId: number;

  // storageBinCode : string;
}

export interface InventoryItemBinResponseDto {

  inventoryItemBinId: number;

  storageBinId: number;

  storageBinCode: number;

  quantity: number;

  inventoryItemId: number;

  productId: number;

  productName: string;

}