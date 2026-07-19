import Auth from '../auth/auth.model.js';
import { Employee } from '../employee/employee.model.js';
import { withTransaction } from '../../utils/withtransaction.js';
import { generateEmployeeId } from '../../utils/helper.js';
import ApiError from '../../utils/ApiError.js';
import bcrypt from 'bcrypt';

export const createEmployeeService = async (
  authData,
  employeeData,
  requesterRole,
) => {
  if (requesterRole === 'HR_MANAGER' && authData.role === 'SUPER_ADMIN') {
    throw new ApiError(403, 'HR cannot assign Super Admin role');
  }

  return withTransaction(async (session) => {
    const isAuthExist = await Auth.findOne({ email: authData.email }).session(
      session,
    );
    if (isAuthExist) throw new ApiError(409, 'Email already exists');

    const employeeId = await generateEmployeeId(session);

    const [auth] = await Auth.create([authData], { session });
    const [employee] = await Employee.create(
      [{ ...employeeData, employeeId, authId: auth._id }],
      { session },
    );
    return { auth, employee };
  });
};

export const getEmployeesService = async (query) => {
  const {
    search,
    department,
    status,
    role,
    sortBy,
    order = 'asc',
    page = 1,
    limit = 10,
  } = query;

  const filter = { isDeleted: false };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (department) filter.department = department;
  if (status) filter.status = status;

  const sortField = ['joiningDate', 'name'].includes(sortBy)
    ? sortBy
    : 'joiningDate';
  const sortOrder = order === 'desc' ? -1 : 1;

  const skip = (Number(page) - 1) * Number(limit);

  let employeeQuery = Employee.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  if (role) {
    employeeQuery = employeeQuery.populate({
      path: 'authId',
      match: { role },
      select: 'email role isActive',
    });
  } else {
    employeeQuery = employeeQuery.populate('authId', 'email role isActive');
  }

  let employees = await employeeQuery;

  if (role) employees = employees.filter((e) => e.authId !== null);

  const total = await Employee.countDocuments(filter);

  return { employees, total, page: Number(page), limit: Number(limit) };
};

export const getEmployeeByIdService = async (id, requester) => {
  const employee = await Employee.findById(id).populate(
    'authId',
    'email role isActive',
  );
  if (!employee) throw new ApiError(404, 'Employee not found');

  if (
    requester.role === 'EMPLOYEE' &&
    employee.authId._id.toString() !== requester.id
  ) {
    throw new ApiError(403, 'Forbidden');
  }

  return employee;
};

export const updateEmployeeService = async (id, updates, requester) => {
  const employee = await Employee.findById(id).populate('authId');
  if (!employee || employee.isDeleted)
    throw new ApiError(404, 'Employee not found');

  if (
    requester.role === 'HR_MANAGER' &&
    employee.authId.role === 'SUPER_ADMIN'
  ) {
    throw new ApiError(403, 'HR cannot modify Super Admin');
  }

  const { role, ...employeeFields } = updates;

  if (role) {
    if (requester.role === 'HR_MANAGER' && role === 'SUPER_ADMIN') {
      throw new ApiError(403, 'HR cannot assign Super Admin role');
    }
    employee.authId.role = role;
    await employee.authId.save();
  }

  Object.assign(employee, employeeFields);
  await employee.save();

  return employee;
};

export const deleteEmployeeService = async (id) => {
  return withTransaction(async (session) => {
    const employee = await Employee.findById(id).session(session);
    if (!employee || employee.isDeleted)
      throw new ApiError(404, 'Employee not found');

    employee.isDeleted = true;
    employee.status = 'INACTIVE';
    await employee.save({ session });

    await Auth.findByIdAndUpdate(
      employee.authId,
      { isActive: false },
      { session },
    );

    return employee;
  });
};

export const importEmployeesService = async (rows, requesterRole) => {
  const results = { success: 0, failed: [] };

  for (const row of rows) {
    try {
      if (requesterRole === 'HR_MANAGER' && row.role === 'SUPER_ADMIN') {
        throw new Error('HR cannot assign Super Admin role');
      }

      await withTransaction(async (session) => {
        const exists = await Auth.findOne({ email: row.email }).session(
          session,
        );
        if (exists) throw new Error('Email already exists');

        const hashpassword = await bcrypt.hash(
          row.password || 'Welcome@123',
          10,
        );
        row.employeeId = await generateEmployeeId();

        const [auth] = await Auth.create(
          [
            {
              email: row.email,
              password: hashpassword,
              role: row.role || 'EMPLOYEE',
            },
          ],
          { session },
        );

        await Employee.create(
          [
            {
              employeeId: row.employeeId,
              authId: auth._id,
              name: row.name,
              email: row.email,
              phone: row.phone,
              department: row.department,
              designation: row.designation,
              salary: Number(row.salary),
              joiningDate: new Date(row.joiningDate),
            },
          ],
          { session },
        );
      });

      results.success++;
    } catch (error) {
      results.failed.push({ email: row.email, reason: error.message });
    }
  }

  return results;
};
