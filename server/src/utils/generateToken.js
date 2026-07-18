import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
  console.log(process.env.JWT_ACCESS_SECRET ,process.env.JWT_REFRESH_SECRET , '<---- token')
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d',
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '15m',
  });
};
