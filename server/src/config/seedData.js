import Auth from '../features/auth/auth.model.js';
import bcrypt from 'bcrypt';

export const seedSuperAdmin = async () => {
  try {
    const checkExist = await Auth.findOne({
      email: 'superadmin@ems.com',
    });

    if (checkExist) {
      console.log('Super Admin already exists');
      return;
    }

    const hashpass = await bcrypt.hash('admin123', 10);

    await Auth.create({
      email: 'superadmin@ems.com',
      password: hashpass,
      role: 'SUPER_ADMIN',
    });

    console.log('Super Admin created successfully');
  } catch (error) {
    console.error('Something went wrong:', error);
  }
};
