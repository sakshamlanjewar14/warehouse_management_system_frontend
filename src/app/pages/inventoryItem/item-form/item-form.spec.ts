import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InventoryItemForm } from "./item-form";



describe('ItemForm', () => {
  let component: InventoryItemForm;
  let fixture: ComponentFixture<InventoryItemForm>;

  //This method Runs before every test and  use for Setup and Initialization
  beforeEach(async () => {
    // Creates a testing module
    await TestBed.configureTestingModule({
      imports: [InventoryItemForm],
    }).compileComponents();

    // creates component
    fixture = TestBed.createComponent(InventoryItemForm); 
    // actual TS class
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});