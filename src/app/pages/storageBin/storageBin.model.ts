interface StorageBin{
    // ? → optional field ---Means: this may or may not come from backend
    binId? : number;
    binCode : string;
    capacity : number
    warehouseName? : string;
    inventoryItems? :[];
}