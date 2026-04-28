
export interface StorageBinRequestDto{
    // ? → optional field ---Means: this may or may not come from backend
    binId? : number;
    binCode : string;
    capacity : number;
    warehouseName? : string;
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