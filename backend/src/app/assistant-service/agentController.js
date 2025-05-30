import {
    admin,
    doctor
} from '../index.js';

const getHospital = async (req, res) => {
    try {
         const hospitals = await admin.findAll ({
            attributes: ['hospitalName', 'location']
         })
        if (hospitals.length === 0) {
            return res.status(404).json({
                message: "No hospitals found"
            });
        }
        return res.status(200).json({
            hospitals
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving hospital data",
            error
        });
    }
};

const getDoctorByHospital = async (req, res) => {
    const { hospitalName } = req.body;
    try {
        const hospital = await admin.findOne({
            where: { hospitalName },
            attributes: ['id']
        });
        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }
        const doctors = await doctor.findAll({
            where: { hospitalId: hospital.id },
            attributes: ['id', 'name', 'location', 'field', 'professionalDescription']
        });
        if (doctors.length === 0) {
            return res.status(404).json({
                message: "No doctors found for this hospital"
            });
        }
        return res.status(200).json({
            doctors
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving doctors",
            error
        });
    }
};

export {
    getHospital,
    getDoctorByHospital
};
