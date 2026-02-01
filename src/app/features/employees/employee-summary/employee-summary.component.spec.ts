import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSummaryComponent } from './employee-summary.component';

describe('EmployeeSummaryComponent', () => {
  let component: EmployeeSummaryComponent;
  let fixture: ComponentFixture<EmployeeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
