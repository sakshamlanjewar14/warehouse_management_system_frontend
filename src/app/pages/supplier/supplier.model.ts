
export interface SupplierRequestDto{

    supplierId? : number;
    name : string;
    supplierCode : string;
    email : string;
    phone : string;
    address1 : string;
    address2 : string;
    city : string;
    state : string;
    country : string;
    postalCode : string;
    supplierItem? : [];
}

export interface SupplierResponseDto{

    supplierId? : number;
    name : string;
    supplierCode : string;
    email : string;
    phone : string;
    address1 : string;
    address2 : string;
    city : string;
    state : string;
    country : string;
    postalCode : string;
    supplierItem? : [];
}

export interface SupplierItemRequestDto{

    itemId? : number;
    productName : string;
    price : number;
    quantity : number;
    productid : number;
}

export interface SupplierItemResponseDto{

    itemId? : number;
    productName : string;
    price : number;
    quantity : number;
    productid : number;
}