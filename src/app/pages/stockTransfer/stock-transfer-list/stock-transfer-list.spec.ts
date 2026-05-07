import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferList } from './stock-transfer-list';

describe('StockTransferList', () => {
  let component: StockTransferList;
  let fixture: ComponentFixture<StockTransferList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTransferList],
    }).compileComponents();

    fixture = TestBed.createComponent(StockTransferList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
