import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundShipmentList } from './inboundShipment-list';

describe('InboundShipmentList', () => {
  let component: InboundShipmentList;
  let fixture: ComponentFixture<InboundShipmentList>;

  //   Angular creates a test module
  // Loads your component into it
  // Compiles template + styles
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboundShipmentList],
    }).compileComponents();

    // Instantiates component + template
    fixture = TestBed.createComponent(InboundShipmentList);
    // Now you can call methods, access variables
    component = fixture.componentInstance;
  // calls API
  // uses async pipes
  // uses signals
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
