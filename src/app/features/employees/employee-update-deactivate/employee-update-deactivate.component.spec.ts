import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUpdateDeactivateComponent } from './employee-update-deactivate.component';

describe('EmployeeUpdateDeactivateComponent', () => {
  let component: EmployeeUpdateDeactivateComponent;
  let fixture: ComponentFixture<EmployeeUpdateDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeUpdateDeactivateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeUpdateDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
