import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit, OnChanges {
  @Input() refreshToken = 0;

  employees: Employee[] = [];
  loading = false;
  error: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      this.loadEmployees();
    }
  }

  async loadEmployees(): Promise<void> {
    this.loading = true;
    this.error = null;

    const result = await this.employeeService.list();

    this.loading = false;

    if (result.ok) {
      this.employees = result.data;
    } else {
      this.error = result.error.message;
    }
  }
}