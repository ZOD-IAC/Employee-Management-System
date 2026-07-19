import bcrypt from 'bcrypt';
import Auth from './auth.model.js';
import {
  generateAccessToken,
  // generateRefreshToken,
} from '../../utils/generateToken.js';
import ApiError from '../../utils/ApiError.js';
import jwt from 'jsonwebtoken';

export const loginService = async ({ email, password }) => {
  const user = await Auth.findOne({ email }).select('+password');

  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  if (!user.isActive) throw new ApiError(403, 'Account disabled');

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  // const refreshToken = generateRefreshToken({ id: user._id });

  // user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    // refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  };
};

//Update reefresh Token
export const refreshService = async (token) => {
  if (!token) throw new ApiError(401, 'No refresh token');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    console.log(decoded, '<--- decoded ');
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await Auth.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token)
    throw new ApiError(401, 'Invalid refresh token');

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  return accessToken;
};
