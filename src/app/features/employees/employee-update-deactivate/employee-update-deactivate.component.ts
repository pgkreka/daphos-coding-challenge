import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-update-deactivate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-update-deactivate.component.html',
  styleUrl: './employee-update-deactivate.component.css'
})
export class EmployeeUpdateDeactivateComponent implements OnChanges {
  @Input() employeeId: string | null = null;
  @Output() changed = new EventEmitter<void>();

  loading = false;
  saving = false;

  employee: Employee | null = null;

  name = '';
  role = '';

  error: string | null = null;
  fieldErrors: Record<string, string> = {};

  constructor(private employeeService: EmployeeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeId']) {
      this.load();
    }
  }

  async load(): Promise<void> {
    if (!this.employeeId) return;

    this.loading = true;
    this.error = null;
    this.fieldErrors = {};

    const result = await this.employeeService.getById(this.employeeId);

    this.loading = false;

    if (result.ok) {
      this.employee = result.data;
      if (this.employee) {
        this.name = this.employee.name;
        this.role = this.employee.role;
      }
    } else {
      this.error = result.error.message;
    }
  }

  async save(): Promise<void> {
    if (!this.employeeId) return;

    this.saving = true;
    this.error = null;
    this.fieldErrors = {};

    const result = await this.employeeService.update(this.employeeId, {
      name: this.name,
      role: this.role
    });

    this.saving = false;

    if (!result.ok) {
      this.error = result.error.message;
      this.fieldErrors = result.error.fieldErrors ?? {};
      return;
    }

    this.employee = result.data;
    this.changed.emit();
  }

  async deactivate(): Promise<void> {
    if (!this.employeeId) return;

    this.saving = true;
    this.error = null;
    this.fieldErrors = {};

    const result = await this.employeeService.deactivate(this.employeeId);

    this.saving = false;

    if (!result.ok) {
      this.error = result.error.message;
      return;
    }

    this.employee = result.data;
    this.changed.emit();
  }
}