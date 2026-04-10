import { Supplier } from './../supplier.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {SupplierForm} from './supplier-form';

describe('SupplierForm', () => {
  let component: SupplierForm ;
  let fixture: ComponentFixture<SupplierForm>;

  //This method Runs before every test and  use for Setup and Initialization
  beforeEach(async () => {
    // Creates a testing module
    await TestBed.configureTestingModule({
      imports: [SupplierForm],
    }).compileComponents();

    // creates component
    fixture = TestBed.createComponent(SupplierForm); 
    // actual TS class
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
