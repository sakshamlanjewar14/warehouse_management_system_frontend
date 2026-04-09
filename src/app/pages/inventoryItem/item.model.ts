interface InventoryItem{
      // ? → optional field ---Means: this may or may not come from backend
    inventoryItemId? : number,
    quantity : number,
    product?: [],
    storageBin? : [];
    // when we get many things that time we use [].
}
