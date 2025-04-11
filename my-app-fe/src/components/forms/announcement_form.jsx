import { useState } from "react";
import { toast } from "react-toastify";

function AnnouncementForm({ initialData = {}, onSave }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    message: initialData.message || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = initialData.id ? "PUT" : "POST";
    const endpoint = initialData.id
      ? `http://localhost:3000/api/v1/announcements/${initialData.id}`
      : "http://localhost:3000/api/v1/announcements";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Chyba pri ukladaní oznamu");
      toast.success("Oznam bol uložený");
      onSave && onSave();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nadpis *</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Správa *</label>
        <textarea name="message" value={form.message} onChange={handleChange} className="form-control" required rows="3" />
      </div>
      <button type="submit" className="btn btn-primary">Uložiť</button>
    </form>
  );
}

export default AnnouncementForm;

