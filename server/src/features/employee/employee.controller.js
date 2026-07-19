import {
  createEmployeeService,
  deleteEmployeeService,
  getEmployeeByIdService,
  getEmployeesService,
  importEmployeesService,
  updateEmployeeService,
} from './employee.service.js';
import bcrypt from 'bcrypt';
import ApiError from '../../utils/ApiError.js';
import { parseCsv } from '../../utils/helper.js';

// create new Employee
export const createEmployee = async (req, res, next) => {
  try {
    const {
      email,
      role,
      employeeId,
      name,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      password,
      reportingManager,
    } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);

    const authData = { email, password: hashpassword, role };
    const employeeData = {
      employeeId,
      email,
      name,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      reportingManager,
    };

    const result = await createEmployeeService(
      authData,
      employeeData,
      req.user.role,
    );

    return res.status(201).json({
      success: true,
      message: 'Created successful',
      employee: result.employee,
    });
  } catch (error) {
    next(error);
  }
};

//get Employee list
export const getEmployees = async (req, res, next) => {
  try {
    const result = await getEmployeesService(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

//update Employee
export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await updateEmployeeService(
      req.params.id,
      req.body,
      req.user,
    );
    res
      .status(200)
      .json({ success: true, message: 'Updated successful', employee });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await getEmployeeByIdService(req.params.id, req.user);
    res.status(200).json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

//Soft delete Employee
export const deleteEmployee = async (req, res, next) => {
  try {
    await deleteEmployeeService(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successful' });
  } catch (error) {
    next(error);
  }
};

export const importEmployees = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'CSV file required');

    const rows = parseCsv(req.file.buffer);
    const result = await importEmployeesService(rows, req.user.role);

    res
      .status(200)
      .json({ success: true, message: 'Import completed', ...result });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res) => {};
export const getReportees = async (req, res) => {};
export const updateManager = async (req, res) => {};
