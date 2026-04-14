import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundShipmentDetails } from './inbound-shipment-details';

describe('InboundShipmentDetails', () => {
  let component: InboundShipmentDetails;
  let fixture: ComponentFixture<InboundShipmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboundShipmentDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(InboundShipmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
