export const getDashboardStatsService = async () => {
  const [total, active, inactive, departments] = await Promise.all([
    Employee.countDocuments({ isDeleted: false }),
    Employee.countDocuments({ isDeleted: false, status: 'ACTIVE' }),
    Employee.countDocuments({ isDeleted: false, status: 'INACTIVE' }),
    Employee.distinct('department', { isDeleted: false }),
  ]);

  return {
    totalEmployees: total,
    activeEmployees: active,
    inactiveEmployees: inactive,
    departmentCount: departments.length,
  };
};
