import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundShipmentForm } from './inboundShipment-form';

describe('InboundShipmentForm', () => {
  let component: InboundShipmentForm;
  let fixture: ComponentFixture<InboundShipmentForm>;

  //This method Runs before every test and  use for Setup and Initialization
  beforeEach(async () => {
    // Creates a testing module
    await TestBed.configureTestingModule({
      imports: [InboundShipmentForm],
    }).compileComponents();

    // creates component
    fixture = TestBed.createComponent(InboundShipmentForm); 
    // actual TS class
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
