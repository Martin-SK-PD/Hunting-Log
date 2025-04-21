import { useState } from "react";
import { toast } from "react-toastify";

function StructureForm({ areaId, initialData = null, onClose, onSuccess }) {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const isEdit = !!initialData;
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEdit
        ? `/api/v1/structures/${initialData.id}`
        : "/api/v1/structures";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? JSON.stringify({ name, type, notes })
        : JSON.stringify({ area_id: areaId, name, type, notes });

      const res = await fetch(url, { method, headers, body });
      const result = await res.json();

      if (!res.ok) throw new Error(result.msg || "Chyba pri ukladaní");

      toast.success(isEdit ? "Štruktúra bola upravená." : "Štruktúra bola pridaná.");
      if (onSuccess) onSuccess(); // napr. fetchStructures
      if (onClose) onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Názov *</label>
        <input className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="mb-2">
        <label>Typ</label>
        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Vyberte typ *</option>
          <option value="Posed">Posed</option>
          <option value="Krmelec">Krmelec</option>
          <option value="Chatka">Chatka</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Poznámka</label>
        <textarea className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="text-end">
        <button className="btn btn-secondary me-2" type="button" onClick={onClose}>Zrušiť</button>
        <button className="btn btn-primary" type="submit">Uložiť</button>
      </div>
    </form>
  );
}

export default StructureForm;
