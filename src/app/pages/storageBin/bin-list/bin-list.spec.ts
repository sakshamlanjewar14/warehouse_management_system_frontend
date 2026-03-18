import { ComponentFixture, TestBed } from "@angular/core/testing";


describe('StorageBinList', () => {
  let component: StorageBinList;
  let fixture: ComponentFixture<StorageBinList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageBinList],
    }).compileComponents();

    fixture = TestBed.createComponent(StorageBinList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
