import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function AddVisitForm({ onSave, initialData = null }) {
  const [areas, setAreas] = useState([]);
  const [structures, setStructures] = useState([]);
  const [form, setForm] = useState({
    area_id: "",
    structure_id: "",
    start_datetime: "",
    end_datetime: "",
    purpose: "",
    notes: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/v1/areas", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setAreas(data);

        if (initialData) {
          const matchingArea = data.find(a => a.name === initialData.area_name);
          if (matchingArea) {
            setForm(prev => ({ ...prev, area_id: matchingArea.id }));
          }
        }
      });
  }, [initialData]);

  useEffect(() => {
    if (!form.area_id) return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/v1/structures?area_id=${form.area_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setStructures(data);
        console.log(initialData);

        if (initialData) {
          const matchingStructure = data.find(s => s.name === initialData.structure_name);
          if (matchingStructure) {
            setForm(prev => ({ ...prev, structure_id: matchingStructure.id }));
          }
        }
      });
  }, [form.area_id, initialData]);

  useEffect(() => {
    if (initialData) {
      const toDatetimeLocal = (isoString) => {
        const dt = new Date(isoString);
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
        return dt.toISOString().slice(0, 16);
      };

      setForm(prev => ({
        ...prev,
        start_datetime: initialData.start_datetime ? toDatetimeLocal(initialData.start_datetime) : "",
        end_datetime: initialData.end_datetime ? toDatetimeLocal(initialData.end_datetime) : "",
        purpose: initialData.purpose || "",
        notes: initialData.notes || ""
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      hunting_area_id: form.area_id,
      structure_id: form.structure_id || null,
      start_datetime: form.start_datetime,
      end_datetime: form.end_datetime || null,
      purpose: form.purpose,
      notes: form.notes
    };

    if (form.end_datetime && form.end_datetime <= form.start_datetime) {
      toast.error("Dátum konca musí byť po dátume začiatku.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/visits${initialData ? "/" + initialData.id : ""}`,
        {
          method: initialData ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Chyba pri ukladaní návštevy");

      toast.success(initialData ? "Návšteva bola upravená." : "Návšteva bola pridaná.");
      onSave && onSave(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="mb-3">
        <label className="form-label">Oblasť *</label>
        <select
          name="area_id"
          className="form-select"
          onChange={handleChange}
          value={form.area_id}
          required
        >
          <option value="">Vyber oblasť</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Štruktúra</label>
        <select
          name="structure_id"
          className="form-select"
          onChange={handleChange}
          value={form.structure_id}
          disabled={!structures.length}
        >
          <option value="">(žiadna)</option>
          {structures.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Začiatok *</label>
        <input
          type="datetime-local"
          name="start_datetime"
          className="form-control"
          onChange={handleChange}
          value={form.start_datetime}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Koniec</label>
        <input
          type="datetime-local"
          name="end_datetime"
          className="form-control"
          onChange={handleChange}
          value={form.end_datetime}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Účel *</label>
        <select
          name="purpose"
          className="form-select"
          onChange={handleChange}
          value={form.purpose}
          required
        >
          <option value="">Vyber účel</option>
          <option value="Lov">Lov</option>
          <option value="Obhliadka">Obhliadka</option>
          <option value="Prikrmovanie">Prikrmovanie</option>
          <option value="Oprava">Oprava</option>
          <option value="Prenocovanie">Prenocovanie</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Poznámka</label>
        <textarea
          name="notes"
          className="form-control"
          onChange={handleChange}
          value={form.notes}
        ></textarea>
      </div>

      <button type="submit" className="btn btn-secondary">
        {initialData ? "Uložiť zmeny" : "Uložiť návštevu"}
      </button>
    </form>
  );
}

export default AddVisitForm;
