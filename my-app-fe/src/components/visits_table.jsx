import { useState } from "react";
import { useAuth } from "./AuthContext";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}

function VisitsTable({ visits, onAddHuntingRecord, onEditVisit, editMode, onDeleteVisit }) {
  const [expandedRows, setExpandedRows] = useState([]);
  const { user } = useAuth();

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="d-none d-md-block overflow-auto">
        <table className="table table-striped table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Meno</th>
              <th>Oblasť</th>
              <th>Štruktúra</th>
              <th>Akcia</th>
              <th>Od</th>
              <th>Do</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v, i) => [
              <tr key={`main-${v.id}`}>
                <td>{i + 1}</td>
                <td>{v.hunter_name}</td>
                <td>{v.area_name}</td>
                <td>{v.structure_name || "-"}</td>
                <td>{v.purpose}</td>
                <td>{formatTime(v.start_datetime)}</td>
                <td>{formatTime(v.end_datetime)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => toggleRow(v.id)}
                  >
                    {expandedRows.includes(v.id) ? "Skryť" : "Detaily"}
                  </button>

                </td>
              </tr>,

              expandedRows.includes(v.id) && (
                <tr key={`expand-${v.id}`}>
                  <td colSpan="8" className="text-start bg-light">
                    <div className="p-2">
                      <p><strong>Dátum návštevy:</strong> {formatDate(v.start_datetime)}<br />
                        <strong>Čas príchodu:</strong> {formatTime(v.start_datetime)}<br />
                        <strong>Čas odchodu:</strong> {formatTime(v.end_datetime)}<br />
                        <strong>Poznámka: </strong> {v.notes || "-"}</p>
                      {v.updated_at && (
                        <p className="text-muted"><small>Posledná zmena: {formatDate(v.updated_at)} {formatTime(v.updated_at)}</small></p>
                      )}

                      <div className="mt-3 d-flex flex-wrap gap-2">
                        {v.purpose === "Lov" && user?.id === v.hunter_id && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => onAddHuntingRecord(v)}
                          >
                            Pridať úlovok
                          </button>
                        )}
                        {(user?.id === v.hunter_id || user?.role === "Admin") && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEditVisit(v)}
                          >
                            Upraviť
                          </button>
                        )}
                        {editMode && user?.role === "Admin" && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDeleteVisit(v)}
                          >
                            Vymazať
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            ])}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-block d-md-none">
        {visits.map((v, i) => (
          <div key={`card-${v.id}`} className="card mb-3">
            <div className="card-header d-flex justify-content-between">
              <strong>{v.hunter_name}</strong>
              <span className="badge bg-secondary">{v.purpose}</span>
            </div>
            <div className="card-body">
              <p className="mb-1"><strong>Oblasť:</strong> {v.area_name}</p>
              <p className="mb-1"><strong>Štruktúra:</strong> {v.structure_name || "-"}</p>
              <p className="mb-1"><strong>Začiatok:</strong> {formatTime(v.start_datetime)}</p>
              <p className="mb-1"><strong>Koniec:</strong> {formatTime(v.end_datetime)}</p>
              {v.notes && <p className="mb-1"><strong>Poznámka:</strong> {v.notes}</p>}
              {v.purpose === "Lov" && user?.id === v.hunter_id && (
                <button
                  className="btn btn-sm btn-success mt-2 me-2"
                  onClick={() => onAddHuntingRecord(v)}
                >
                  Pridať úlovok
                </button>
              )}
              {user?.id === v.hunter_id && (
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={() => onEditVisit(v)}
                >
                  Upraviť
                </button>
              )}

              {editMode && user?.role === "Admin" && (
                <button
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => onDeleteVisit(v)}
                >
                  Vymazať
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default VisitsTable;
