import { loginService, refreshService } from './auth.service.js';
import { cookieOptions } from '../../utils/helper.js';
import Auth from '../auth/auth.model.js';

// Login user
export const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);

    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: 'Login successful', user: result.user });
  } catch (error) {
    next(error);
  }
};

// update Refresh token
export const refresh = async (req, res, next) => {
  try {
    const accessToken = await refreshService(req.cookies.refreshToken);
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// logout User
export const logout = async (req, res, next) => {
  try {
    await Auth.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};
