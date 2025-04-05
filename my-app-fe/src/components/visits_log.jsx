import { useEffect, useState } from "react";
import VisitsTable from "./visits_table";
import CenteredModal from "./centered_modal";
import AddVisitForm from "./add_visit_form";
import AddHuntingRecordForm from "./add_hunting_record_form";
import ConfirmDeleteForm from "./forms/confirm_delete_form";
import { useAuth } from "./AuthContext";

function Visits_log() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [modalData, setModalData] = useState({
    show: false,
    title: "",
    content: null,
  });

  const fetchVisits = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/visits", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Chyba pri načítaní návštev");
      const data = await res.json();
      setVisits(data);
    } catch (err) {
      console.error("Chyba:", err);
    }
  };

  useEffect(() => {
    fetchVisits();
    const interval = setInterval(fetchVisits, 10000);
    return () => clearInterval(interval);
  }, []);

  const openModal = (title, content) => {
    setModalData({ show: true, title, content });
  };

  const handleDeleteVisit = (visit) => {
    openModal("Vymazať návštevu", (
      <ConfirmDeleteForm
        resourceType={"visits"}
        resourceId={visit.id}
        onSuccess={() => {
          setModalData({ show: false });
          fetchVisits();
        }}
        onClose={() => setModalData({ show: false })}
      />
    ));
  };

  const handleAddOrEditVisit = (visit = null) => {
    openModal(visit ? "Upraviť návštevu" : "Nová návšteva", (
      <AddVisitForm
        initialData={visit}
        onSave={() => {
          setModalData({ show: false });
          fetchVisits();
        }}
      />
    ));
  };

  const handleAddHuntingRecord = (visit) => {
    openModal("Pridať úlovok", (
      <AddHuntingRecordForm
        visit={visit}
        onSave={() => {
          setModalData({ show: false });
          fetchVisits();
        }}
      />
    ));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card scrollable-card my-md-3 m-3 p-2">
            <div className="card-title px-3 pt-2">
              <div className="row">
                <div className="col-12 col-md-8">
                  <h4 className="text-start font-weight-bold m-2">Záznamy o návštevách</h4>
                </div>
                <div className="col-12 col-md-2">
                  {user?.role === "Admin" && (
                    <div>
                      <label className="my-2 me-2 text-md-end">Povoliť mazanie </label>
                      <input
                        type="checkbox"
                        checked={editMode}
                        onChange={() => setEditMode(!editMode)}
                      />
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-2 text-md-end">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleAddOrEditVisit()}
                  >
                    + Nová návšteva
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <VisitsTable
                visits={visits}
                editMode={editMode}
                onDeleteVisit={handleDeleteVisit}
                onAddHuntingRecord={handleAddHuntingRecord}
                onEditVisit={handleAddOrEditVisit}
              />
            </div>
          </div>
        </div>
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

export default Visits_log;
