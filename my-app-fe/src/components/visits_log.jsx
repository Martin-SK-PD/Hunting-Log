import { useEffect, useState } from "react";
import VisitsTable from "./visits_table";
import CenteredModal from "./centered_modal";
import AddVisitForm from "./add_visit_form";
import AddHuntingRecordForm from "./add_hunting_record_form";

function Visits_log() {
  const [visits, setVisits] = useState([]);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null); 

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

  const handleHuntingRecordSave = async () => {
    setSelectedVisit(null);
    await fetchVisits();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card scrollable-card my-md-3 m-3 p-2">
            <div className="card-title px-3 pt-2">
              <div className="row">
                <div className="col-12 col-md-9">
                  <h4 className="text-start font-weight-bold m-2">Záznamy o návštevách</h4>
                </div>
                <div className="col-12 col-md-3 text-md-end">
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setEditingVisit(null); setShowVisitModal(true);  }} >
                    + Nová návšteva
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <VisitsTable
                visits={visits}
                onAddHuntingRecord={(visit) => setSelectedVisit(visit)}
                onEditVisit={(visit) => {
                  setEditingVisit(visit);
                  setShowVisitModal(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <CenteredModal
        show={showVisitModal}
        onClose={() => setShowVisitModal(false)}
        title={editingVisit ? "Upraviť návštevu" : "Nová návšteva"}
      >
        <AddVisitForm
          initialData={editingVisit}
          onSave={() => {
            fetchVisits();
            setShowVisitModal(false);
            setEditingVisit(null);
          }}
        />
      </CenteredModal>

      <CenteredModal
        show={!!selectedVisit}
        onClose={() => setSelectedVisit(null)}
        title="Pridať úlovok"
      >
        <AddHuntingRecordForm
          visit={selectedVisit}
          onSave={handleHuntingRecordSave}
        />
      </CenteredModal>
    </div>
  );
}

export default Visits_log;
