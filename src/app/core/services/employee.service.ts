import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Employee } from '../models/employee.model';
import { ApiResult } from '../models/api-result.model';
import { DAPHOS_EMPLOYEES_KEY } from '../constants/storage-keys';

type CreateEmployeeInput = {
  name: string;
  role: string;
};

type UpdateEmployeeInput = {
  name: string;
  role: string;
};

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private storage: StorageService) {}

  async list(): Promise<ApiResult<Employee[]>> {
    await this.simulateLatency();
    return { ok: true, data: this.readAll() };
  }

  async getById(id: string): Promise<ApiResult<Employee | null>> {
    await this.simulateLatency();
    const employees = this.readAll();
    const found = employees.find(e => e.id === id) ?? null;
    return { ok: true, data: found };
  }

  async create(input: CreateEmployeeInput): Promise<ApiResult<Employee>> {
    await this.simulateLatency();

    const fieldErrors: Record<string, string> = {};
    if (!input.name.trim()) fieldErrors['name'] = 'Name is required';
    if (!input.role.trim()) fieldErrors['role'] = 'Role is required';

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        error: { status: 422, message: 'Validation failed', fieldErrors }
      };
    }

    const employees = this.readAll();
    const employee: Employee = {
      id: this.createId('emp'),
      name: input.name.trim(),
      role: input.role.trim(),
      status: 'active'
    };

    employees.push(employee);
    this.writeAll(employees);

    return { ok: true, data: employee };
  }

  async update(id: string, input: UpdateEmployeeInput): Promise<ApiResult<Employee>> {
    await this.simulateLatency();

    const fieldErrors: Record<string, string> = {};
    if (!input.name.trim()) fieldErrors['name'] = 'Name is required';
    if (!input.role.trim()) fieldErrors['role'] = 'Role is required';

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        error: { status: 422, message: 'Validation failed', fieldErrors }
      };
    }

    const employees = this.readAll();
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) {
      return {
        ok: false,
        error: { status: 404, message: 'Employee not found' }
      };
    }

    const updated: Employee = {
      ...employees[index],
      name: input.name.trim(),
      role: input.role.trim()
    };

    employees[index] = updated;
    this.writeAll(employees);

    return { ok: true, data: updated };
  }

  async deactivate(id: string): Promise<ApiResult<Employee>> {
    await this.simulateLatency();

    const employees = this.readAll();
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) {
      return {
        ok: false,
        error: { status: 404, message: 'Employee not found' }
      };
    }

    const current = employees[index];
    const updated: Employee = { ...current, status: 'inactive' };
    employees[index] = updated;
    this.writeAll(employees);

    return { ok: true, data: updated };
  }

  private readAll(): Employee[] {
    return this.storage.get<Employee[]>(DAPHOS_EMPLOYEES_KEY) ?? [];
  }

  private writeAll(employees: Employee[]): void {
    this.storage.set(DAPHOS_EMPLOYEES_KEY, employees);
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