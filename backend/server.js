import express from 'express';
import { syncSchema } from './src/app/index.js';
import "dotenv/config";
import populateSuperAdmin from './src/utils/superAdmin/superAdminSignupController.js';


const app = express();
await syncSchema();
await populateSuperAdmin();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

