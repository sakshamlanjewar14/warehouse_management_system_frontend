import { OutboundShipmentForm } from './outbound-shipment-form/outbound-shipment-form';
export interface OutboundShipmentRequestDto {
    shipmentId?: number;

    shipmentNumber: string;

    customerName: string;

    status?: string;

    shipmentAddress: string;

    trackingNumber: string;

    outboundShipmentItems: OutboundShipmentItemRequestDto[];
}

export interface OutboundShipmentItemRequestDto {

    shipmentItemId?: number;

    quantity: number;

    shipmentId: number;

    productId: number;

    productName: string;
}



export interface OutboundShipmentResponseDto {
    
    shipmentId?: number;

    shipmentNumber: string;

    customerName: string;

    status?: string;

    shipmentAddress: string;

    trackingNumber: string;

    outboundShipmentItems: OutboundShipmentItemResponseDto[];
}

export interface OutboundShipmentItemResponseDto {
    shipmentItemId?: number;

    quantity: number;

    shipmentId: number;

    productId: number;

    productName: string;
}