import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AddHuntingRecordForm({ visit, onSave }) {
  const [form, setForm] = useState({
    animal: "",
    weight: "",
    date_time: new Date().toISOString().slice(0, 16),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      visit_id: visit.id,
      ...form,
    };

    try {
      const res = await fetch("http://localhost:3000/api/v1/hunting-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.msg || "Neznáma chyba");
      }

      const data = await res.json();
      toast.success("Úlovok bol úspešne uložený");
      onSave && onSave(data); // zatvorenie modalu + refresh
    } catch (err) {
      toast.error(`Chyba: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="mb-3">
        <label className="form-label">Zver *</label>
        <input
          type="text"
          name="animal"
          className="form-control"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Váha (kg) *</label>
        <input
          type="number"
          name="weight"
          className="form-control"
          step="0.01"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Čas strelenia *</label>
        <input
          type="datetime-local"
          name="date_time"
          className="form-control"
          value={form.date_time}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">Uložiť úlovok</button>
    </form>
  );
}

export default AddHuntingRecordForm;
