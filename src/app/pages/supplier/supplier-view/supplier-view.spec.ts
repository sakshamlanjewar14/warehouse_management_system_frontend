import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierView } from './supplier-view';

describe('SupplierView', () => {
  let component: SupplierView;
  let fixture: ComponentFixture<SupplierView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierView],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
