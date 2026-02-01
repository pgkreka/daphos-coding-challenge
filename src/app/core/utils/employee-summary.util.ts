import { Shift } from '../models/shift.model';
import { minutesBetween } from './time.util';

export interface EmployeeSummary {
  total_shifts: number;
  total_hours_worked: number;
  total_break_hours: number;
  average_work_length: number;
}

export function calculateEmployeeSummary(shifts: Shift[]): EmployeeSummary {
  const total_shifts = shifts.length;

  let totalWorkMinutes = 0;
  let totalBreakMinutes = 0;

  for (const s of shifts) {
    const duration = minutesBetween(s.startTime, s.endTime);
    if (duration === null || duration <= 0) continue;

    const breakMin = Math.max(0, s.breakMinutes || 0);
    const workMin = Math.max(0, duration - breakMin);

    totalWorkMinutes += workMin;
    totalBreakMinutes += breakMin;
  }

  const total_hours_worked = round2(totalWorkMinutes / 60);
  const total_break_hours = round2(totalBreakMinutes / 60);

  const average_work_length =
    total_shifts === 0 ? 0 : round2(totalWorkMinutes / total_shifts / 60);

  return {
    total_shifts,
    total_hours_worked,
    total_break_hours,
    average_work_length
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}