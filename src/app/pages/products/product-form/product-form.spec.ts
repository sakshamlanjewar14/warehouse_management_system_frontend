import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductForm } from './product-form';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  //This method Runs before every test and  use for Setup and Initialization
  beforeEach(async () => {
    // Creates a testing module
    await TestBed.configureTestingModule({
      imports: [ProductForm],
    }).compileComponents();

    // creates component
    fixture = TestBed.createComponent(ProductForm); 
    // actual TS class
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
