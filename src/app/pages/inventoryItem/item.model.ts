
interface InventoryItemRequestDto {
    productId: string;
  rows: InventoryItemQuantityRequestDto[];
}

interface InventoryItemQuantityRequestDto {
  storageBinId: string;
  quantity: number;
}

interface InventoryItemResponseDto {
    inventoryItemId: number;
    quantity: number;
    productName: string;
    storageBinCode: string;
}