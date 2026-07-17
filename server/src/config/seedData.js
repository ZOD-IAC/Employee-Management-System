import authModel from "../features/auth/auth.model";
import bcrypt from "bcrypt";


const bootStrap = async() =>{
    try {

        const salt = bcrypt.genSalt(10);
        const hashpass = bcrypt.hash("admin@123" , salt);

        await authModel.create({
            email : "superadmin@ems.com",
            password : hashpass,
            role : "SUPER_ADMIN"
        })

        console.log("superAdmin has been created");
        
    } catch (error) {
        
    }
}