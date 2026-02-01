import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmployeeService } from './core/services/employee.service';
import { EmployeeStatus } from './core/models/employee.model';
import { AddEmployeeComponent } from './features/employees/add-employee/add-employee.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { EmployeeUpdateDeactivateComponent } from './features/employees/employee-update-deactivate/employee-update-deactivate.component';
import { EmployeeShiftsComponent } from './features/shifts/employee-shifts/employee-shifts.component';
import { EmployeeSummaryComponent } from './features/employees/employee-summary/employee-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    EmployeeListComponent, 
    AddEmployeeComponent, 
    EmployeeUpdateDeactivateComponent, 
    EmployeeShiftsComponent,
    EmployeeSummaryComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  refreshToken = 0;

  selectedEmployeeId: string | null = null;
  selectedEmployeeStatus: EmployeeStatus | null = null;

  constructor(private employeeService: EmployeeService) {}

  onEmployeeCreated(): void {
    this.refreshToken++;
  }

  async onEmployeeSelected(id: string): Promise<void> {
    this.selectedEmployeeId = id;
    await this.refreshSelectedEmployeeStatus();
  }

  async onEmployeeUpdatedOrDeactivated(): Promise<void> {
    this.refreshToken++;
    await this.refreshSelectedEmployeeStatus();
  }

  onShiftsChanged(): void {
    this.refreshToken++;
  }

  private async refreshSelectedEmployeeStatus(): Promise<void> {
    if (!this.selectedEmployeeId) {
      this.selectedEmployeeStatus = null;
      return;
    }

    const result = await this.employeeService.getById(this.selectedEmployeeId);

    if (result.ok && result.data) {
      this.selectedEmployeeStatus = result.data.status;
      return;
    }

    this.selectedEmployeeStatus = null;
  }
}