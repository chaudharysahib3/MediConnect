import { useState, useEffect } from "react";
import API from "../services/api";

const Appointment = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users/doctors");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  //Load doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await API.get("/users/doctors");
      setDoctors(res.data);
    };

    if (role === "patient") fetchDoctors();
  }, [role]);

  //Load appointments
  const loadAppointments = async () => {
    const res = await API.get("/appointments");
    setAppointments(res.data);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  //Book appointment
  const bookAppointment = async () => {
    try {
      await API.post("/appointments", {
        doctorId: selectedDoctor._id,
        date,
        reason,
      });

      alert("Appointment booked");
      loadAppointments();
    } catch (error) {
      alert("Error booking appointment");
    }
  };

  //Update status (doctor)
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}`, { status });
      loadAppointments();
    } catch (error) {
      alert("Error updating");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Appointments</h2>

      {/*Patient: Book Appointment */}
      {role === "patient" && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Book Appointment</h3>

          <select onChange={(e) => setSelectedDoctor(users.find((u) => e.target.value))}>
            <option>Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            placeholder="Reason"
            onChange={(e) => setReason(e.target.value)}
          />

          <button onClick={bookAppointment}>Book</button>
        </div>
      )}

      {/* Appointment List */}
      <div>
        <h3>My Appointments</h3>

        {appointments.map((app) => (
          <div
            key={app._id}
            style={{
              border: "1px solid #090909",
              margin: "10px 0",
              padding: "10px",            
            }}
          >
            <p>
              <b>Doctor:</b> {app.doctor?.name}
            </p>
            <p>
              <b>Patient:</b> {app.patient?.name}
            </p>
            <p>
              <b>Date:</b> {new Date(app.date).toLocaleString()}
            </p>
            <p>
              <b>Status:</b> {app.status}
            </p>

            {/*Doctor actions */}
            {role === "doctor" && app.status === "pending" && (
              <>
                <button onClick={() => updateStatus(app._id, "accepted")}>
                  Accept
                </button>
                <button onClick={() => updateStatus(app._id, "rejected")}>
                  Reject
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointment;