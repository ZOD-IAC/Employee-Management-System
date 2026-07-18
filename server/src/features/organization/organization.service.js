import Employee from '../employee/employee.model.js';

export const getReporteesService = async (id) => {
  const reportees = await Employee.find({
    reportingManager: id,
    isDeleted: false,
  }).select('name email department designation status');
  return reportees;
};

export const getOrgTreeService = async () => {
  const employees = await Employee.find({ isDeleted: false })
    .select('name email department designation reportingManager')
    .lean();

  const map = {};
  employees.forEach((e) => (map[e._id] = { ...e, children: [] }));

  const roots = [];
  employees.forEach((e) => {
    if (e.reportingManager && map[e.reportingManager]) {
      map[e.reportingManager].children.push(map[e._id]);
    } else {
      roots.push(map[e._id]);
    }
  });

  return roots;
};

export const updateManagerService = async (id, managerId) => {
  if (id === managerId) {
    throw new ApiError(400, 'Employee cannot be their own manager');
  }

  const employee = await Employee.findById(id);
  if (!employee || employee.isDeleted)
    throw new ApiError(404, 'Employee not found');

  if (managerId) {
    const manager = await Employee.findById(managerId);
    if (!manager || manager.isDeleted)
      throw new ApiError(404, 'Manager not found');

    // circular check: walk up manager's chain, ensure `id` isn't in it
    let current = manager;
    while (current.reportingManager) {
      if (current.reportingManager.toString() === id) {
        throw new ApiError(400, 'Circular reporting not allowed');
      }
      current = await Employee.findById(current.reportingManager);
    }
  }

  employee.reportingManager = managerId || null;
  await employee.save();
  return employee;
};
