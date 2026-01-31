import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Output() employeeSelected = new EventEmitter<string>();

  employees: Employee[] = [];
  loading = false;
  error: string | null = null;

  selectedId: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      this.loadEmployees();
    }
  }

  selectEmployee(id: string): void {
    this.selectedId = id;
    this.employeeSelected.emit(id);
  }

  async loadEmployees(): Promise<void> {
    this.loading = true;
    this.error = null;

    const result = await this.employeeService.list();

    this.loading = false;

    if (result.ok) {
      this.employees = result.data;
      if (this.selectedId && !this.employees.some(e => e.id === this.selectedId)) {
        this.selectedId = null;
      }
    } else {
      this.error = result.error.message;
    }
  }
}