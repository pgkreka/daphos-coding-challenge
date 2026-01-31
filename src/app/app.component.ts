import { Component } from '@angular/core';
import { AddEmployeeComponent } from './features/employees/add-employee/add-employee.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeListComponent, AddEmployeeComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  refreshToken = 0;

  onEmployeeCreated(): void {
    this.refreshToken++;
  }
}