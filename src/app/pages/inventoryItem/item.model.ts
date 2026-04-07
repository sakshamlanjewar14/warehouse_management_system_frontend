interface InventoryItem {
  // ? → optional field ---Means: this may or may not come from backend
  inventoryItemId?: number,
  quantity: number,
  product?: [],
  storageBin?: [];
  // when we get many things(list) that time we use [].
}

interface InventoryItemResponseDto {
  inventoryItemId: number;
  quantity: number;
  productName: string;
  storageBinCode: string;
}