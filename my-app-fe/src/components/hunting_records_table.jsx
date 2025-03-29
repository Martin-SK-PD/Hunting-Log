function formatDateTime(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function Hunting_records_table({ records }) {
  return (
    <>
      <div className="d-none d-md-block overflow-auto">
        <table className="table table-striped table-hover text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Meno</th>
              <th>Oblasť</th>
              <th>Štruktúra</th>
              <th>Zver</th>
              <th>Váha</th>
              <th>Čas strelenia</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={`record-${r.id}`}>
                <td>{i + 1}</td>
                <td>{r.hunter_name}</td>
                <td>{r.area_name}</td>
                <td>{r.structure_name || "-"}</td>
                <td>{r.animal}</td>
                <td>{r.weight} kg</td>
                <td>{formatDateTime(r.date_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-block d-md-none">
        {records.map((r, i) => (
          <div key={`record-card-${r.id}`} className="card mb-3">
            <div className="card-header">
              <strong>{r.hunter_name}</strong>
            </div>
            <div className="card-body">
              <p className="mb-1"><strong>Oblasť:</strong> {r.area_name}</p>
              <p className="mb-1"><strong>Štruktúra:</strong> {r.structure_name || "-"}</p>
              <p className="mb-1"><strong>Zver:</strong> {r.animal}</p>
              <p className="mb-1"><strong>Váha:</strong> {r.weight} kg</p>
              <p className="mb-1"><strong>Čas strelenia:</strong> {formatDateTime(r.date_time)}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Hunting_records_table;
