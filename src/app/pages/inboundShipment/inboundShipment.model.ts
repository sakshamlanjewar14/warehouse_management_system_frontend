export interface InboundShipmentRequestDto{
    shipmentId?: number;
    shipmentCode: string;
    supplierName: string;
    status: string;
    expectedDate: Date;
    receivedDate: Date;
    referenceNumber: string;
    notes: string;
    inboundShipmentItems?: InboundShipmentItemRequestDto[];
}

export interface InboundShipmentItemRequestDto{
    shipmentItemId: number;
    productId: number;
    expectedQty: number;
    receivedQty: number;
    damagedQty: number;
    status: string;
}

export interface InboundShipmentResponseDto{
    shipmentId?: number;
    shipmentCode: string;
    supplierName: string;
    status: string;
    expectedDate: Date;
    receivedDate: Date;
    referenceNumber: string;
    notes: string;
    inboundShipmentItems: InboundShipmentItemResponseDto[];
}

export interface InboundShipmentItemResponseDto{
    shipmentItemId: number;
    productId: number;
    expectedQty: number;
    receivedQty: number;
    damagedQty: number;
    status: string;
}