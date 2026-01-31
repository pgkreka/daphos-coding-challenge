import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddEmployeeComponent } from './features/employees/add-employee/add-employee.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { EmployeeUpdateDeactivateComponent } from './features/employees/employee-update-deactivate/employee-update-deactivate.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeeListComponent, AddEmployeeComponent, EmployeeUpdateDeactivateComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  refreshToken = 0;
  selectedEmployeeId: string | null = null;

  onEmployeeCreated(): void {
    this.refreshToken++;
  }

  onEmployeeSelected(id: string): void {
    this.selectedEmployeeId = id;
  }

  onEmployeeUpdatedOrDeactivated(): void {
    this.refreshToken++;
  }
}