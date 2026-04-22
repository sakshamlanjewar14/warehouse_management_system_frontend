import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundShipmentDetails } from './outbound-shipment-details';

describe('OutboundShipmentDetails', () => {
  let component: OutboundShipmentDetails;
  let fixture: ComponentFixture<OutboundShipmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutboundShipmentDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(OutboundShipmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
