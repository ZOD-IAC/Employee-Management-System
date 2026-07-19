import { Counter } from '../features/employee/employee.model.js';

export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

export const generateEmployeeId = async (session) => {
  const counter = await Counter.findByIdAndUpdate(
    'employeeId',
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session },
  );
  const year = new Date().getFullYear();
  return `EMP-${year}-${String(counter.seq).padStart(4, '0')}`;
};

export const parseCsv = (buffer) => {
  const lines = buffer.toString('utf-8').trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row = {};
    headers.forEach((h, i) => (row[h] = values[i]));
    return row;
  });
};
