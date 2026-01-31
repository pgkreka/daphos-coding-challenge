import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee.component.html'
})
export class AddEmployeeComponent {
  @Output() employeeCreated = new EventEmitter<void>();

  name = '';
  role = '';
  loading = false;
  error: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  async submit(): Promise<void> {
    this.error = null;
    this.loading = true;

    const result = await this.employeeService.create({
      name: this.name,
      role: this.role
    });

    this.loading = false;

    if (!result.ok) {
      this.error = result.error.message;
      return;
    }

    this.name = '';
    this.role = '';

    this.employeeCreated.emit();
  }
}