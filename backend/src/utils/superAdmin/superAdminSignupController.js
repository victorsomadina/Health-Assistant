import superAdminData from "./superAdminInfo.js";
import { superAdmin } from '../../app/index.js'
import bcrypt from 'bcryptjs'

const populateSuperAdmin = async () => {
  try {
    for (const superAdminUser of superAdminData) {
      await superAdmin.findOrCreate({
        where: { email: superAdminUser.email },
        defaults: {
          email: superAdminUser.email,
          password: await bcrypt.hash(superAdminUser.password, 10),
        },
      });
    }
  } catch (error) {
    console.error("Error populating admin data:", error);
  }
};

export default populateSuperAdmin;
