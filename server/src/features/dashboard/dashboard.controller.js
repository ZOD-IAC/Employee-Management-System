import { getDashboardStatsService } from './dashboard.service.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};
