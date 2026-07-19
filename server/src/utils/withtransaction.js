import mongoose from 'mongoose';

export const withTransaction = async (fn) => {
  let result;
  if (process.env.NODE_ENV !== 'production') {
    result = await fn();
    return result;
  }
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } finally {
    session.endSession();
  }
};
