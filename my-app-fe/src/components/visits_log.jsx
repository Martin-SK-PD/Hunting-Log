import { useEffect, useState } from "react";
import VisitsTable from "./visits_table";
import CenteredModal from "./centered_modal";
import AddVisitForm from "./add_visit_form";
import AddHuntingRecordForm from "./add_hunting_record_form";
import ConfirmDeleteForm from "./forms/confirm_delete_form";
import { useAuth } from "./AuthContext";
import VisitFilters from "./visit_filters";
import DateNavigator from "./date_navigator";


function Visits_log() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);


  const [filters, setFilters] = useState({
    date: new Date().toISOString().slice(0, 10),
    location: "",
    purpose: "",
    hunter: "",
  });
  const [modalData, setModalData] = useState({
    show: false,
    title: "",
    content: null,
  });

  const fetchVisits = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });

      const res = await fetch(`/api/v1/visits?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Chyba pri načítaní návštev");
      }
      setVisits(data);
    } catch (err) {
      console.error("Chyba:", err);
    }
  };

  useEffect(() => {
    fetchVisits();
    const interval = setInterval(fetchVisits, 10000);
    return () => clearInterval(interval);
  }, [filters]);

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
              <div className="row align-items-center">
                <div className="col-md-4">
                  <h4 className="text-start font-weight-bold m-2">Záznamy o návštevách</h4>
                </div>
                <div className="col-md-4">
                  <DateNavigator
                    mode="day"
                    date={filters.date}
                    onChange={(newDate) => setFilters((prev) => ({ ...prev, date: newDate }))}
                  />
                </div>
                <div className="col-md-2">
                  {user?.role === "Admin" && (
                    <div className="my-2 me-2 text-md-end">
                      <label className="me-2" htmlFor="mazat">Povoliť mazanie</label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="mazat"
                        checked={editMode}
                        onChange={() => setEditMode(!editMode)}
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-2 text-md-end">
                  <button className="btn btn-secondary" onClick={() => handleAddOrEditVisit()}>
                    + Nová návšteva
                  </button>
                </div>
              </div>
              <div className="mt-3">

                {/* Tlačidlo na filtre pre menšíe obrazovky */}
                <div className="d-block d-lg-none">
                  <button
                    className="btn btn-sm btn-outline-secondary mb-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? "Skryť filtre" : "Zobraziť filtre"}
                  </button>

                  {showFilters && (
                    <VisitFilters filters={filters} onChange={setFilters} />
                  )}
                </div>

                {/* Na veľkých obrazovkách budú filtre vždy viditeľné */}
                <div className="d-none d-lg-block">
                  <VisitFilters filters={filters} onChange={setFilters} />
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
