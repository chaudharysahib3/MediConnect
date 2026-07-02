import User from "../models/User.js";

//Get profile
export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update profile 
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      //Only for doctors
      if (user.role === "doctor") {
        user.specialization = req.body.specialization || user.specialization;
      }
      const updateUser = await user.save();
      res.json(updateUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};