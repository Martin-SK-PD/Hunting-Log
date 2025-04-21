import { useState } from "react";
import { toast } from "react-toastify";

function AreaForm({ areaId = null, initialName = "", onSuccess, onCancel }) {
  const [name, setName] = useState(initialName);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };

      const url = areaId
        ? `/api/v1/areas/${areaId}`
        : "/api/v1/areas";

      const method = areaId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({ name }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.msg || "Chyba pri ukladaní oblasti.");

      toast.success(areaId ? "Oblasť bola upravená." : "Oblasť bola pridaná.");
      onSuccess?.(); 
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Názov oblasti</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="text-end">
        <button className="btn btn-secondary me-2" type="button" onClick={onCancel}>
          Zrušiť
        </button>
        <button className="btn btn-success" type="submit">Uložiť</button>
      </div>
    </form>
  );
}

export default AreaForm;
