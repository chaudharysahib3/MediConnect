import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req, res) => {
    try {
        console.log("USer", req.user);
        console.log("Body", req.body);
        const { doctorId, date, reason } = req.body;

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            date,
            reason
        });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMyAppointments = async (req, res) => {
    try {
        let appointments;

        if (req.user.role === "doctor") {
            appointments = await Appointment.find({ doctor: req.user._id })
                .populate("patient", "name email")
        } else {
            appointments = await Appointment.find({ patient: req.user._id })
                .populate("doctor", "name email specialization")
        }
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        //Only doctor can update
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Access denied" });
        }

        appointment.status = status;
        await appointment.save()

        res.json(appointment)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};