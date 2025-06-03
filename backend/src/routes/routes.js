import express from 'express';
import {
    authMiddleware,
    superAdminMiddleware,
    adminMiddleware,
    userMiddleware,
    doctorMiddleware
} from '../middleware/middleware.js';
import signupAdmin from '../app/superadmin-service/controller/signupAdminController.js';
import changePassword from '../app/admin-service/controller/changePassword.js';
import signupDoctor from '../app/admin-service/controller/signupDoctor.js';
import doctorChangePassword from '../app/doctor-service/controller/doctorChangePassword.js';
import doctorUpdateProfile from '../app/doctor-service/controller/doctorUpdateProfile.js';
import {
    getAllDoctors,
    getDoctorById,
} from '../app/doctor-service/controller/getDoctor.js';
import patientSignup from '../app/patient-service/controller/patientSignup.js';
import patientDeleteProfile from '../app/patient-service/controller/patientdeleteprofile.js';
import getPatientById from '../app/patient-service/controller/getPatient.js';
import upload from '../middleware/multerMemory.js';
import audiotranscribe from '../app/conversation-service/controller/convocontroller.js';
import loginController  from '../app/login-service/loginController.js';
import assistantController from '../app/assistant-service/assistantController.js';
import {
    getHospital,
    getDoctorByHospital
} from '../app/assistant-service/agentController.js'
import patientUpdateProfile from '../app/patient-service/controller/updateInformation.js';
import viewPatients from '../app/doctor-service/controller/viewPatients.js';
import getConversedDoctors from '../app/patient-service/controller/getconversedDoctors.js';


// create a router for login
const loginRouter = express.Router();
loginRouter.post('/login', loginController);

// create SUPERADMIN routes
const superAdminRouter = express.Router();
superAdminRouter.post('/signupadmin', authMiddleware, superAdminMiddleware, signupAdmin);

// create ADMIN routes
const adminRouter = express.Router();
adminRouter.post('/changepassword', authMiddleware, adminMiddleware, changePassword);
adminRouter.post('/signupdoctor/:id', authMiddleware, adminMiddleware, signupDoctor);

// create DOCTOR routes
const doctorRouter = express.Router();
doctorRouter.post('/changepassword/:id', authMiddleware, doctorMiddleware, doctorChangePassword);
doctorRouter.post('/updateprofile/:id', authMiddleware, doctorMiddleware, doctorUpdateProfile);
doctorRouter.get('/doctors/:id', authMiddleware, doctorMiddleware, getDoctorById);
doctorRouter.get('/viewpatients', authMiddleware, doctorMiddleware, viewPatients);


// create PATIENT routes
const patientRouter = express.Router();
patientRouter.post('/signup', patientSignup);
patientRouter.get('/getpatient/:id', authMiddleware, userMiddleware, getPatientById);
patientRouter.delete('/deletepatient/:id', authMiddleware, userMiddleware, patientDeleteProfile);
patientRouter.post('/updateprofile/:id', authMiddleware, userMiddleware, patientUpdateProfile)
patientRouter.post('/audiotranscribe/:id', authMiddleware, userMiddleware, upload.single('audio'), audiotranscribe);
patientRouter.get('/getdoctors', authMiddleware, userMiddleware, getAllDoctors);
patientRouter.post('/getconversedoctors', authMiddleware, userMiddleware, getConversedDoctors);

// assistant routes
const assistantRouter = express.Router();
assistantRouter.post('/chatassistant', authMiddleware, assistantController);
assistantRouter.get('/gethospital', getHospital);
assistantRouter.post('/getdoctorbyhospital', getDoctorByHospital);

export {
    superAdminRouter,
    adminRouter,
    doctorRouter,
    patientRouter,
    loginRouter,
    assistantRouter
};