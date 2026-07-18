import {
  getOrgTreeService,
  getReporteesService,
  updateManagerService,
} from './organization.service.js';

export const getOrgTree = async (req, res, next) => {
  try {
    const tree = await getOrgTreeService();
    res.status(200).json({ success: true, tree });
  } catch (error) {
    next(error);
  }
};

export const getReportees = async (req, res, next) => {
  try {
    const reportees = await getReporteesService(req.params.id);
    res.status(200).json({ success: true, reportees });
  } catch (error) {
    next(error);
  }
};

export const updateManager = async (req, res, next) => {
  try {
    const employee = await updateManagerService(
      req.params.id,
      req.body.reportingManager,
    );
    res
      .status(200)
      .json({ success: true, message: 'Manager updated', employee });
  } catch (error) {
    next(error);
  }
};
