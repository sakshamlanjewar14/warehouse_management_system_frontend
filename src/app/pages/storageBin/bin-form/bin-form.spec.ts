import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorageBinForm } from './bin-form';

describe('StorageBinForm', () => {
  let component: StorageBinForm;
  let fixture: ComponentFixture<StorageBinForm>;

  //This method Runs before every test and  use for Setup and Initialization
  beforeEach(async () => {
    // Creates a testing module
    await TestBed.configureTestingModule({
      imports: [StorageBinForm],
    }).compileComponents();

    // creates component
    fixture = TestBed.createComponent(StorageBinForm); 
    // actual TS class
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
