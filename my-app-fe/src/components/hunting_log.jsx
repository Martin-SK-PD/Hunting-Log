import { useEffect, useState } from "react";
import Hunting_records_table from "./hunting_records_table"; 

function Hunting_log() {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/hunting-records", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Chyba pri načítaní úlovkov");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">

          <div className="card scrollable-card my-md-3 m-3 p-2">
            <div className="card-title px-3 pt-2">
              <h4 className="text-start font-weight-bold m-2">Záznamy o úlovkoch</h4>
            </div>

            <div className="card-body">
              <Hunting_records_table records={records} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hunting_log;
