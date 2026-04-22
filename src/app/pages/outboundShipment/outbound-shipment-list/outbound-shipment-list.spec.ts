import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundShipmentList } from './outbound-shipment-list';

describe('OutboundShipmentList', () => {
  let component: OutboundShipmentList;
  let fixture: ComponentFixture<OutboundShipmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutboundShipmentList],
    }).compileComponents();

    fixture = TestBed.createComponent(OutboundShipmentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
