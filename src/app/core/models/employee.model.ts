export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
}
