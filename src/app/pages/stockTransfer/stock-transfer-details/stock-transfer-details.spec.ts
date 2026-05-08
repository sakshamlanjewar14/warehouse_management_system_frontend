import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferDetails } from './stock-transfer-details';

describe('StockTransferDetails', () => {
  let component: StockTransferDetails;
  let fixture: ComponentFixture<StockTransferDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTransferDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(StockTransferDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
