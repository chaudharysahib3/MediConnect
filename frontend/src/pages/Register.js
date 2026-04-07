import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
  });

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);

      alert("Registered successfully");
      navigate("/"); // go to login
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <select
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>

      {/* Show only if doctor */}
      {form.role === "doctor" && (
        <input
          placeholder="Specialization"
          onChange={(e) =>
            setForm({ ...form, specialization: e.target.value })
          }
        />
      )}

      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;