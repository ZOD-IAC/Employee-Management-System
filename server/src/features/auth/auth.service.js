import bcrypt from "bcrypt";
import Auth from "./auth.model.js";
import generateToken from "../../utils/generateToken.js";

export const loginService = async ({ email, password }) => {
  const user = await Auth.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account disabled");
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return {
    token,

    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};
