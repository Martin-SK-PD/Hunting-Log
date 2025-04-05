import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function toLocalDateTimeInputValue(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function AddHuntingRecordForm({ visit, onSave, initialData }) {
  const [form, setForm] = useState({
    animal: "",
    weight: "",
    date_time: toLocalDateTimeInputValue(new Date()),
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        animal: initialData.animal,
        weight: initialData.weight,
        date_time: toLocalDateTimeInputValue(initialData.date_time),
      });
    }
  }, [initialData]);

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

    const isEditing = !!initialData?.id;
    const endpoint = isEditing
      ? `http://localhost:3000/api/v1/hunting-records/${initialData.id}`
      : "http://localhost:3000/api/v1/hunting-records";

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Neznáma chyba");

      toast.success(isEditing ? "Úlovok bol upravený" : "Úlovok bol úspešne uložený");
      onSave && onSave(data);
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
          value={form.animal}
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
          value={form.weight}
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

      <button type="submit" className="btn btn-primary">
        {initialData ? "Uložiť zmeny" : "Uložiť úlovok"}
      </button>
    </form>
  );
}

export default AddHuntingRecordForm;
