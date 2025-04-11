import { useEffect, useState } from "react";
import Hunting_records_table from "./hunting_records_table";
import { useAuth } from "./AuthContext";
import CenteredModal from "./centered_modal";
import AddHuntingRecordForm from "./add_hunting_record_form";
import ConfirmDeleteForm from "./forms/confirm_delete_form";
import DateNavigator from "./date_navigator";
import HuntingFilters from "./hunting_filters";

function Hunting_log() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [modalData, setModalData] = useState({ show: false, title: "", content: null });
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    hunter: "",
    location: "",
    animal: ""
  });

  const fetchRecords = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append("month", filters.month);
      if (filters.hunter) params.append("hunter", filters.hunter);
      if (filters.location) params.append("location", filters.location);
      if (filters.animal) params.append("animal", filters.animal);

      const res = await fetch(`http://localhost:3000/api/v1/hunting-records?${params}`, {
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
  }, [filters]);

  const openModal = (title, content) => {
    setModalData({ show: true, title, content });
  };

  const handleEditRecord = (record) => {
    openModal("Upraviť úlovok", (
      <AddHuntingRecordForm
        key={`edit-form-${record.id}`}
        visit={{ id: record.visit_id }}
        initialData={record}
        onSave={() => {
          setModalData({ show: false });
          fetchRecords();
        }}
      />
    ));
  };

  const handleDeleteRecord = (record) => {
    openModal("Vymazať úlovok", (
      <ConfirmDeleteForm
        resourceType="hunting-records"
        resourceId={record.id}
        message="Chceš naozaj vymazať tento úlovok?"
        onSuccess={() => {
          setModalData({ show: false });
          fetchRecords();
        }}
        onClose={() => setModalData({ show: false })}
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
                  <h4 className="text-start font-weight-bold m-2">Záznamy o úlovkoch</h4>
                </div>
                <div className="col-md-4">
                  <DateNavigator
                    mode="month"
                    date={filters.month}
                    onChange={(val) => setFilters((prev) => ({ ...prev, month: val }))}
                  />
                </div>
                <div className="col-md-2 text-md-end">
                  {user?.role === "Admin" && (
                    <div className="my-2 me-2 text-md-end">
                      <label className="me-2" htmlFor="mazat">Režim mazania: </label>
                      <input
                        type="checkbox"
                        name="mazat"
                        id="mazat"
                        checked={editMode}
                        onChange={() => setEditMode(!editMode)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="px-2 pt-3">
                <HuntingFilters filters={filters} onChange={setFilters} />
              </div>
            </div>

            <div className="card-body">
              <Hunting_records_table
                records={records}
                user={user}
                editMode={editMode}
                onEdit={handleEditRecord}
                onDelete={handleDeleteRecord}
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

export default Hunting_log;
