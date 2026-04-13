import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProduct } from './assign-product';

describe('AssignProduct', () => {
  let component: AssignProduct;
  let fixture: ComponentFixture<AssignProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
