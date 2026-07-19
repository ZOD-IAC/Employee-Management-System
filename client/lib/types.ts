export type Role = 'SUPER_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface Employee {
  _id: string;
  employeeId: string;
  authId:
    | { _id: string; email: string; role: Role; isActive: boolean }
    | string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  reportingManager: string | null;
  profileImage: string | null;
}
