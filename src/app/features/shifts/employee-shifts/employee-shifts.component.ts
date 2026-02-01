import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shift } from '../../../core/models/shift.model';
import { ShiftService } from '../../../core/services/shift.service';

type FieldErrors = Record<string, string>;

@Component({
  selector: 'app-employee-shifts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-shifts.component.html',
  styleUrl: './employee-shifts.component.css'
})
export class EmployeeShiftsComponent implements OnChanges {
  @Input() employeeId: string | null = null;
  @Input() isEmployeeInactive = false;
  @Output() changed = new EventEmitter<void>();

  loading = false;
  saving = false;

  shifts: Shift[] = [];

  error: string | null = null;
  fieldErrors: FieldErrors = {};

  isEditing = false;
  editingShiftId: string | null = null;

  date = '';
  startTime = '';
  endTime = '';
  breakMinutes: number | null = 0;

  constructor(private shiftService: ShiftService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeId']) {
      this.resetForm();
      this.load();
    }
  }

  async load(): Promise<void> {
    if (!this.employeeId) return;

    this.loading = true;
    this.error = null;

    const result = await this.shiftService.listByEmployeeId(this.employeeId);

    this.loading = false;

    if (result.ok) {
      this.shifts = result.data;
    } else {
      this.error = result.error.message;
    }
  }

  startCreate(): void {
    this.isEditing = false;
    this.editingShiftId = null;
    this.resetForm();
    this.clearErrors();
  }

  startEdit(shift: Shift): void {
    this.isEditing = true;
    this.editingShiftId = shift.id;

    this.date = shift.date;
    this.startTime = shift.startTime;
    this.endTime = shift.endTime;
    this.breakMinutes = shift.breakMinutes;

    this.clearErrors();
  }

  cancelEdit(): void {
    this.startCreate();
  }

  async submit(): Promise<void> {
    if (this.isEmployeeInactive) return;
    if (!this.employeeId) return;

    this.saving = true;
    this.error = null;
    this.fieldErrors = {};

    const breakValue = this.breakMinutes ?? 0;

    const result = this.isEditing && this.editingShiftId
      ? await this.shiftService.update(this.editingShiftId, {
          date: this.date,
          startTime: this.startTime,
          endTime: this.endTime,
          breakMinutes: breakValue
        })
      : await this.shiftService.create({
          employeeId: this.employeeId,
          date: this.date,
          startTime: this.startTime,
          endTime: this.endTime,
          breakMinutes: breakValue
        });

    this.saving = false;

    if (!result.ok) {
      this.error = result.error.message;
      this.fieldErrors = result.error.fieldErrors ?? {};
      return;
    }

    await this.load();
    this.changed.emit();
    this.startCreate();
  }

  async deleteShift(shiftId: string): Promise<void> {
    if (this.isEmployeeInactive) return;
    if (!confirm('Delete this shift?')) return;

    this.saving = true;
    this.error = null;

    const result = await this.shiftService.delete(shiftId);

    this.saving = false;

    if (!result.ok) {
      this.error = result.error.message;
      return;
    }

    await this.load();
    this.changed.emit();

    if (this.editingShiftId === shiftId) {
      this.startCreate();
    }
  }

  private resetForm(): void {
    this.date = '';
    this.startTime = '';
    this.endTime = '';
    this.breakMinutes = 0;
  }

  private clearErrors(): void {
    this.error = null;
    this.fieldErrors = {};
  }
}