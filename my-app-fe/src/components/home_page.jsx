import { useEffect, useState } from "react";
import Announcement_card from "./announcement";
import CenteredModal from "./centered_modal";
import AddVisitForm from "./add_visit_form";
import AddHuntingRecordForm from "./add_hunting_record_form";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Home() {
  const [lastVisit, setLastVisit] = useState(null);
  const [stats, setStats] = useState(null);
  const [futureVisits, setFutureVisits] = useState([]);
  const [editingVisit, setEditingVisit] = useState(null);
  const [addingHuntingRecord, setAddingHuntingRecord] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const lastRes = await fetch("/api/v1/visits/last", { headers });
      if (lastRes.ok) {
        const lastData = await lastRes.json();
        setLastVisit(lastData);
      }

      const plannedRes = await fetch("/api/v1/visits/planned", { headers });
      if (plannedRes.ok) {
        const plannedData = await plannedRes.json();
        setFutureVisits(plannedData);
      }

      const statsRes = await fetch("/api/v1/hunting-records/monthly-stats", { headers });
      const rawStats = await statsRes.json();

      const hunting_counts = {};
      let total = 0;
      for (const row of rawStats) {
        if (row.animal) {
          const count = Number(row.count_per_animal);
          hunting_counts[row.animal] = count;
          total += count;
        }
      }

      setStats({
        total_hunts: total,
        hunting_counts,
      });
    } catch (err) {
      console.error("Chyba pri načítaní dát:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCloseModal = () => {
    fetchAll();
    setShowModal(false);
    setEditingVisit(null);
    setAddingHuntingRecord(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Oznamy */}
        <div className="col-lg-4 order-lg-2 order-1 py-sm-5 py-md-0">
          <Announcement_card />
        </div>

        <div className="col-lg-8 order-lg-1 order-2 scrollable-column">
          {/* Posledná návšteva */}
          <div className="card m-3">
            <div className="card-header">Posledná návšteva</div>
            <div className="card-body">
              {lastVisit ? (
                <>
                  <h5>{new Date(lastVisit.start_datetime).toLocaleDateString()}</h5>
                  <p>
                    <strong>Začiatok:</strong> {new Date(lastVisit.start_datetime).toLocaleTimeString()} <br />
                    <strong>Koniec:</strong> {lastVisit.end_datetime ? new Date(lastVisit.end_datetime).toLocaleTimeString() : "Prebieha"} <br />
                    <strong>Oblasť:</strong> {lastVisit.area_name} <br />
                    <strong>Štruktúra:</strong> {lastVisit.structure_name || "-"} <br />
                    <strong>Účel:</strong> {lastVisit.purpose} <br />
                    <strong>Poznámka:</strong> {lastVisit.notes || "-"}
                  </p>

                  <div className="mt-3">
                    {lastVisit.purpose === "Lov" && (
                      <button
                        className="btn btn-success me-2"
                        onClick={() => {
                          setEditingVisit(lastVisit);
                          setAddingHuntingRecord(true);
                          setShowModal(true);
                        }}
                      >
                        Pridať úlovok
                      </button>
                    )}
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingVisit(lastVisit);
                        setAddingHuntingRecord(false);
                        setShowModal(true);
                      }}
                    >
                      Upraviť
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-muted">Žiadna zaznamenaná návšteva.</p>
              )}
            </div>
          </div>

          {/* Kalendár budúcich návštev */}
          <div className="card m-3">
            <div className="card-header">Plánované návštevy</div>
            <div className="card-body">
              {futureVisits.length > 0 ? (
                <ul className="list-group">
                  {futureVisits.map((v) => (
                    <li key={v.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{new Date(v.start_datetime).toLocaleDateString()} </strong>
                        {formatTime(v.start_datetime)} - {formatTime(v.end_datetime)}<br />
                        <span className="text-muted">{v.purpose} – {v.area_name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Žiadne budúce návštevy.</p>
              )}
            </div>
          </div>

          {/* Štatistiky */}
          <div className="card m-3">
            <div className="card-header">Štatistiky (tento mesiac)</div>
            <div className="card-body">
              {stats ? (
                <>
                  <p><strong>Počet úlovkov:</strong> {stats.total_hunts}</p>
                  <p><strong>Úlovky:</strong></p>
                  {stats.hunting_counts && Object.keys(stats.hunting_counts).length > 0 ? (
                    <ul className="list">
                      {Object.entries(stats.hunting_counts).map(([animal, count]) => (
                        <li key={animal}>{animal}: {count}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">Žiadne úlovky tento mesiac.</p>
                  )}
                </>
              ) : (
                <p className="text-muted">Načítavam štatistiky...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CenteredModal
        show={showModal}
        onClose={handleCloseModal}
        title={addingHuntingRecord ? "Pridať úlovok" : "Upraviť návštevu"}
      >
        {addingHuntingRecord ? (
          <AddHuntingRecordForm visit={editingVisit} onSave={handleCloseModal} />
        ) : (
          <AddVisitForm initialData={editingVisit} onSave={handleCloseModal} />
        )}
      </CenteredModal>
    </div>
  );
}

export default Home;
