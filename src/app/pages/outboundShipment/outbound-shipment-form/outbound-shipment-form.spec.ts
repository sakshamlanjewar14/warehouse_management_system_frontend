import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundShipmentForm } from './outbound-shipment-form';

describe('OutboundShipmentForm', () => {
  let component: OutboundShipmentForm;
  let fixture: ComponentFixture<OutboundShipmentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutboundShipmentForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OutboundShipmentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
