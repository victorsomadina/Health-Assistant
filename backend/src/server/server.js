import express from 'express';
import { syncSchema } from '../app/index.js';
import "dotenv/config";
import populateSuperAdmin from '../utils/superAdmin/superAdminSignupController.js';
import {
  adminRouter,
  doctorRouter,
  patientRouter,
  superAdminRouter,
  loginRouter,
  assistantRouter
} from '../routes/routes.js';
import cors from 'cors';
import swaggerDoc from "./swagger.js";
import swaggerUi from "swagger-ui-express";


const app = express();
await syncSchema();
await populateSuperAdmin();

app.use(express.json());
app.use(cors());
app.use('/api', loginRouter);
app.use('/api/superadmin', superAdminRouter);
app.use('/api/admin', adminRouter);
app.use('/api/practitioner', doctorRouter);
app.use('/api/patient', patientRouter);
app.use('/api/assistant', assistantRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


