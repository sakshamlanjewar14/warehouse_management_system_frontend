import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundShipmentList } from './inboundShipment-list';

describe('InboundShipmentList', () => {
  let component: InboundShipmentList;
  let fixture: ComponentFixture<InboundShipmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboundShipmentList],
    }).compileComponents();

    fixture = TestBed.createComponent(InboundShipmentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
