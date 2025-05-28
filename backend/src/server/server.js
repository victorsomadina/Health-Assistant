import express from 'express';
import { syncSchema } from '../app/index.js';
import "dotenv/config";
import populateSuperAdmin from '../utils/superAdmin/superAdminSignupController.js';
import {
  adminRouter,
  doctorRouter,
  patientRouter,
  superAdminRouter
} from '../routes/routes.js';
import cors from 'cors';


const app = express();
await syncSchema();
await populateSuperAdmin();

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api/superadmin', superAdminRouter);
app.use('/api/admin', adminRouter);
app.use('/api/practitioner', doctorRouter);
app.use('/api/patient', patientRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

