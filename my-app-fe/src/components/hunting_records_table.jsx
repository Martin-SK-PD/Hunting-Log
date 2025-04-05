import { useState } from "react";
import { useAuth } from "./AuthContext";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}

function Hunting_records_table({ records, user, editMode, onEdit, onDelete }) {
  const [expandedRows, setExpandedRows] = useState([]);

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
              <th>Zver</th>
              <th>Váha</th>
              <th>Dátum</th>
              <th>Čas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const canAccess = user.role === "Admin" || user.id === r.hunter_id;
              return [
                <tr key={`main-${r.id}`}>
                  <td>{i + 1}</td>
                  <td>{r.hunter_name}</td>
                  <td>{r.area_name}</td>
                  <td>{r.structure_name || "-"}</td>
                  <td>{r.animal}</td>
                  <td>{r.weight} kg</td>
                  <td>{formatDate(r.date_time)}</td>
                  <td>{formatTime(r.date_time)}</td>
                  <td>
                    {canAccess && (
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => toggleRow(r.id)}
                      >
                        {expandedRows.includes(r.id) ? "Skryť" : "Detaily"}
                      </button>
                    )}
                  </td>
                </tr>,

                expandedRows.includes(r.id) && canAccess && (
                  <tr key={`expand-${r.id}`}>
                    <td colSpan="9" className="text-start bg-light">
                      <div className="p-2">
                        <div className="mt-1 d-flex flex-wrap gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(r)}
                          >
                            Upraviť
                          </button>
                          {editMode && user?.role === "Admin" && (
                            <button className="btn btn-sm btn-danger" onClick={() => onDelete(r)}>Vymazať</button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              ];
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-block d-md-none">
        {records.map((r, i) => {
          const canAccess = user.role === "Admin" || user.id === r.hunter_id;
          return (
            <div key={`card-${r.id}`} className="card mb-3">
              <div className="card-header d-flex justify-content-between">
                <strong>{r.hunter_name}</strong>
                <span className="badge bg-secondary">{r.animal}</span>
              </div>
              <div className="card-body">
                <p className="mb-1"><strong>Oblasť:</strong> {r.area_name}</p>
                <p className="mb-1"><strong>Štruktúra:</strong> {r.structure_name || "-"}</p>
                <p className="mb-1"><strong>Váha:</strong> {r.weight} kg</p>
                <p className="mb-1"><strong>Dátum:</strong> {formatDate(r.date_time)}</p>
                <p className="mb-1"><strong>Čas:</strong> {formatTime(r.date_time)}</p>
                {canAccess && (
                  <>
                    <button className="btn btn-sm btn-warning mt-2 me-2" onClick={() => onEdit(r)}>
                      Upraviť
                    </button>
                    {user.role === "Admin" && editMode && (
                      <button className="btn btn-sm btn-danger mt-2" onClick={() => onDelete(r)}>Vymazať</button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Hunting_records_table;
