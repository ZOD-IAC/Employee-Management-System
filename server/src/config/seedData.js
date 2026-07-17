import Auth from "../features/auth/auth.model.js";
import bcrypt from "bcrypt";

export const bootStrap = async () => {
  try {
    // This automatically generates a salt and hashes the password

    const checkExist = Auth.findOne({ email: "superadmin@ems.com" });
    if (!checkExist) {
      console.log("superAdmin already exists");
      return;
    }
    const hashpass = await bcrypt.hash("admin123", 10);

    await Auth.create({
      email: "superadmin@ems.com",
      password: hashpass,
      role: "SUPER_ADMIN",
    });

    console.log("superAdmin has been created");
  } catch (error) {
    console.error("Something went wrong: ", error);
  }
};
