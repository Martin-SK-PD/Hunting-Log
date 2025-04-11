import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import CenteredModal from "./centered_modal";
import ConfirmDeleteForm from "./forms/confirm_delete_form";
import AnnouncementForm from "./forms/announcement_form";
import { toast } from "react-toastify";



function Announcement_card() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);   
  const [announcements, setAnnouncements] = useState([]);
  const [modalData, setModalData] = useState({ show: false, title: "", content: null });      

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/v1/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Nepodarilo sa načítať oznamy");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openModal = (title, content) => {
    setModalData({ show: true, title, content });
  };

  const handleAdd = () => {
    openModal("Pridať oznam", <AnnouncementForm onSave={() => {
      setModalData({ show: false });
      fetchAnnouncements();
    }} />);
  };

  const handleEdit = (a) => {
    openModal("Upraviť oznam", <AnnouncementForm initialData={a} onSave={() => {
      setModalData({ show: false });
      fetchAnnouncements();
    }} />);
  };

  const handleDelete = (id) => {
    openModal("Vymazať oznam", (
      <ConfirmDeleteForm
        resourceType="announcements"
        resourceId={id}
        message="Naozaj chceš vymazať tento oznam?"
        onSuccess={() => {
          setModalData({ show: false });
          fetchAnnouncements();
        }}
        onClose={() => setModalData({ show: false })}
      />
    ));
  };

  return (
    <div className="card scrollable-card my-md-3 m-3 p-2 text-center ">
      <div className="card-title pt-2 d-flex justify-content-between align-items-center px-3">
        <h4 className="text-start font-weight-bold m-2">Oznamy</h4>
        {user?.role === "Admin" && (
          <div className="d-flex align-items-center gap-3">
            <div className="form-check form-switch">
              <label className="form-check-label" htmlFor="editSwitch">
                Režim úprav
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="editSwitch"
                checked={editMode}
                onChange={() => setEditMode(!editMode)}
              />

            </div>
            <button className="btn btn-sm btn-outline-primary" onClick={handleAdd}>+ Pridať</button>
          </div>
        )}
      </div>
      <div className="card-body">
        <ul className="list-group pt-2">
          {announcements.map((a) => (
            <li className="list-group-item text-start" key={a.id}>
              <h5>{a.title}</h5>
              <p>{a.message}</p>
              <small className="text-muted">
                {"Vytvorené " + new Date(a.created_at).toLocaleString()}
              </small>
              {user?.role === "Admin" && editMode && (
                <div className="mt-2 d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(a)}>Upraviť</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}>Vymazať</button>
                </div>
              )}
            </li>
          ))}
          {announcements.length === 0 && (
            <li className="list-group-item">Žiadne oznamy</li>
          )}
        </ul>
      </div>

      <CenteredModal
        show={modalData.show}
        onClose={() => setModalData({ show: false })}
        title={modalData.title}
      >
        {modalData.content}
      </CenteredModal>
    </div>
  );
}

export default Announcement_card;
