import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShiftService } from '../../../core/services/shift.service';
import { calculateEmployeeSummary, EmployeeSummary } from '../../../core/utils/employee-summary.util';

@Component({
  selector: 'app-employee-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-summary.component.html',
  styleUrl: './employee-summary.component.css'
})
export class EmployeeSummaryComponent implements OnChanges {
  @Input() employeeId: string | null = null;
  @Input() refreshToken = 0;

  loading = false;
  error: string | null = null;

  summary: EmployeeSummary = {
    total_shifts: 0,
    total_hours_worked: 0,
    total_break_hours: 0,
    average_work_length: 0
  };

  constructor(private shiftService: ShiftService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeId'] || (changes['refreshToken'] && !changes['refreshToken'].firstChange)) {
      this.load();
    }
  }

  async load(): Promise<void> {
    if (!this.employeeId) return;

    this.loading = true;
    this.error = null;

    const result = await this.shiftService.listByEmployeeId(this.employeeId);

    this.loading = false;

    if (!result.ok) {
      this.error = result.error.message;
      return;
    }

    this.summary = calculateEmployeeSummary(result.data);
  }
}