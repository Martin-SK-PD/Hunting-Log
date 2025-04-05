import { toast } from "react-toastify";

function ConfirmDeleteForm({
  resourceType,      // "areas" alebo "structures"....
  resourceId,        // ID položky
  onClose,
  onSuccess,
  message = "Chcete naozaj vymazať túto položku?",
}) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  const handleDelete = async () => {
    try {
      const endpoint = `http://localhost:3000/api/v1/${resourceType}/${resourceId}`;
      const res = await fetch(endpoint, { method: "DELETE", headers });
      const result = await res.json();

      if (!res.ok) throw new Error(result.msg || "Chyba pri mazaní.");
      toast.success(result.msg);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      toast.error(err.message || "Chyba pri mazaní.");
    }
  };

  return (
    <>
      <p>{message}</p>
      <div className="text-end">
        <button className="btn btn-secondary me-2" onClick={onClose}>Zrušiť</button>
        <button className="btn btn-danger" onClick={handleDelete}>Vymazať</button>
      </div>
    </>
  );
}

export default ConfirmDeleteForm;
