import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -------------------- CHECK AVAILABILITY --------------------
app.post("/check-availability", async (req, res) => {
  try {
    const { doctor_id, date } = req.body;

    const { data, error } = await supabase.rpc("check_availability", {
      p_doctor_id: doctor_id,
      p_date: date,
    });

    if (error) throw error;

    const slots = data.map((d) => `${d.start_time} - ${d.end_time}`);

    res.json({ slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- BOOK APPOINTMENT --------------------
app.post("/book", async (req, res) => {
  try {
    const {
      hospital_id,
      doctor_id,
      patient_name,
      patient_phone,
      date,
      time,
    } = req.body;

    const { data, error } = await supabase.rpc("book_appointment", {
      p_hospital_id: hospital_id,
      p_doctor_id: doctor_id,
      p_patient_name: patient_name,
      p_patient_phone: patient_phone,
      p_date: date,
      p_time: time,
    });

    if (error) throw error;

    res.json({ message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- CANCEL APPOINTMENT --------------------
app.post("/cancel", async (req, res) => {
  try {
    const { phone, date } = req.body;

    const { data, error } = await supabase.rpc("cancel_appointment", {
      p_phone: phone,
      p_date: date,
    });

    if (error) throw error;

    res.json({ message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- START SERVER --------------------
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});