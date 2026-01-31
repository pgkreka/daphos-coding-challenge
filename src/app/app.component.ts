import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { AddEmployeeComponent } from './features/employees/add-employee/add-employee.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeListComponent, AddEmployeeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'daphos-coding-challenge';
}
