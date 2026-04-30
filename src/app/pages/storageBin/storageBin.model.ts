
export interface StorageBinRequestDto{
    // ? → optional field ---Means: this may or may not come from backend
    binId? : number;
    binCode : string;
    totalCapacity : number;
    warehouseId : number;
}

export interface StorageBinResponseDto{
    // ? → optional field ---Means: this may or may not come from backend
    binId? : number;
    binCode : string;
    totalCapacity : number;
    availableCapacity: number;
    warehouseName? : string;
    inventoryItems? :[];
}