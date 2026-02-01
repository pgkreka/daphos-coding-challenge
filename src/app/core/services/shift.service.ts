import { Injectable } from '@angular/core';
import { Shift } from '../models/shift.model';
import { ApiResult } from '../models/api-result.model';
import { StorageService } from './storage.service';
import { DAPHOS_SHIFTS_KEY } from '../constants/storage-keys';

type CreateShiftInput = {
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
};

type UpdateShiftInput = {
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
};

@Injectable({ providedIn: 'root' })
export class ShiftService {
  constructor(private storage: StorageService) {}

  async listByEmployeeId(employeeId: string): Promise<ApiResult<Shift[]>> {
    await this.simulateLatency();
    const shifts = this.readAll().filter(s => s.employeeId === employeeId);
    shifts.sort((a, b) => {
        const aStartDateTime = `${a.date} ${a.startTime}`;
        const bStartDateTime = `${b.date} ${b.startTime}`;
        return aStartDateTime.localeCompare(bStartDateTime);
    });
    return { ok: true, data: shifts };
  }

  async create(input: CreateShiftInput): Promise<ApiResult<Shift>> {
    await this.simulateLatency();

    const validation = this.validateShiftInput(input);
    if (!validation.ok) return validation;

    const shifts = this.readAll();
    const shift: Shift = {
      id: this.createId('shift'),
      employeeId: input.employeeId,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      breakMinutes: input.breakMinutes
    };

    shifts.push(shift);
    this.writeAll(shifts);

    return { ok: true, data: shift };
  }

  async update(shiftId: string, input: UpdateShiftInput): Promise<ApiResult<Shift>> {
    await this.simulateLatency();

    const validation = this.validateShiftInput(input);
    if (!validation.ok) return validation;

    const shifts = this.readAll();
    const idx = shifts.findIndex(s => s.id === shiftId);
    if (idx === -1) {
      return { ok: false, error: { status: 404, message: 'Shift not found' } };
    }

    const updated: Shift = {
      ...shifts[idx],
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      breakMinutes: input.breakMinutes
    };

    shifts[idx] = updated;
    this.writeAll(shifts);

    return { ok: true, data: updated };
  }

  async delete(shiftId: string): Promise<ApiResult<void>> {
    await this.simulateLatency();

    const shifts = this.readAll();
    const idx = shifts.findIndex(s => s.id === shiftId);
    if (idx === -1) {
      return { ok: false, error: { status: 404, message: 'Shift not found' } };
    }

    shifts.splice(idx, 1);
    this.writeAll(shifts);

    return { ok: true, data: undefined };
  }

  private validateShiftInput(input: {
    date: string;
    startTime: string;
    endTime: string;
    breakMinutes: number;
  }): ApiResult<any> {
    const fieldErrors: Record<string, string> = {};

    if (!input.date?.trim()) fieldErrors['date'] = 'Date is required';
    if (!input.startTime?.trim()) fieldErrors['startTime'] = 'Start time is required';
    if (!input.endTime?.trim()) fieldErrors['endTime'] = 'End time is required';

    if (Number.isNaN(Number(input.breakMinutes)) || input.breakMinutes < 0) {
      fieldErrors['breakMinutes'] = 'Break minutes must be 0 or greater';
    }

    const durationMinutes = this.minutesBetween(input.startTime, input.endTime);
    if (durationMinutes !== null && durationMinutes <= 0) {
      fieldErrors['endTime'] = 'End time must be after start time';
    }

    if (durationMinutes !== null && input.breakMinutes > durationMinutes) {
      fieldErrors['breakMinutes'] = 'Break time cannot exceed shift duration';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, error: { status: 422, message: 'Validation failed', fieldErrors } };
    }

    return { ok: true, data: null };
  }

  private minutesBetween(startTime: string, endTime: string): number | null {
    const s = this.parseTimeToMinutes(startTime);
    const e = this.parseTimeToMinutes(endTime);
    if (s === null || e === null) return null;
    return e - s;
  }

  private parseTimeToMinutes(time: string): number | null {
    const m = /^(\d{2}):(\d{2})$/.exec(time);
    if (!m) return null;
    const hh = Number(m[1]);
    const mm = Number(m[2]);
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
    return hh * 60 + mm;
  }

  private readAll(): Shift[] {
    return this.storage.get<Shift[]>(DAPHOS_SHIFTS_KEY) ?? [];
  }

  private writeAll(shifts: Shift[]): void {
    this.storage.set(DAPHOS_SHIFTS_KEY, shifts);
  }

  private createId(prefix: string): string {
    const rand = Math.random().toString(16).slice(2, 10);
    const time = Date.now().toString(16);
    return `${prefix}_${time}_${rand}`;
  }

  private simulateLatency(ms: number = 250): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}