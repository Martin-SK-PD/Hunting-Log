import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CenteredModal from "./centered_modal";
import ConfirmDeleteForm from "./forms/confirm_delete_form";
import AreaForm from "./forms/area_form";
import StructureForm from "./forms/structure_form";

function GroundManagement() {
  const [areas, setAreas] = useState([]);
  const [structures, setStructures] = useState({});
  const [modalData, setModalData] = useState({ show: false, title: "", content: null });

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/v1/areas", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      setAreas(data);
      for (const area of data) fetchStructures(area.id);
    } catch (err) {
      toast.error(`Nepodarilo sa načítať oblasti: ${err.message}`);
    }
  };

  const fetchStructures = async (areaId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/v1/structures?area_id=${areaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error();
      setStructures((prev) => ({ ...prev, [areaId]: data }));
    } catch {
      toast.error("Nepodarilo sa načítať štruktúry.");
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const openModal = (title, content) => {
    setModalData({ show: true, title, content });
  };

  const handleAddArea = () => {
    openModal("Nová oblasť", (
      <AreaForm
        onSuccess={() => {
          setModalData({ show: false });
          fetchAreas();
        }}
        onCancel={() => setModalData({ show: false })}
      />
    ));
  };

  const handleEditArea = (area) => {
    openModal("Upraviť oblasť", (
      <AreaForm
        initialName={area.name}
        areaId={area.id}
        onSuccess={() => {
          setModalData({ show: false });
          fetchAreas();
        }}
        onCancel={() => setModalData({ show: false })}
      />
    ));
  };

  const handleDeleteArea = (areaId) => {
    openModal("Vymazať oblasť", (
      <ConfirmDeleteForm
        resourceType="areas"
        resourceId={areaId}
        onSuccess={() => {
          setModalData({ show: false });
          fetchAreas();
        }}
        onCancel={() => setModalData({ show: false })}
      />
    ));
  };

  const handleAddStructure = (areaId) => {
    openModal("Nová štruktúra", (
      <StructureForm
        areaId={areaId}
        onSuccess={() => {
          setModalData({ show: false });
          fetchStructures(areaId);
        }}
        onCancel={() => setModalData({ show: false })}
      />
    ));
  };

  const handleEditStructure = (structure, areaId) => {
    openModal("Upraviť štruktúru", (
      <StructureForm
        initialData={structure}
        areaId={areaId}
        onSuccess={() => {
          setModalData({ show: false });
          fetchStructures(areaId);
        }}
        onCancel={() => setModalData({ show: false })}
      />
    ));
  };

  const handleDeleteStructure = (structureId, areaId) => {
    openModal("Vymazať štruktúru", (
      <ConfirmDeleteForm
        resourceType="structures"
        resourceId={structureId}
        onSuccess={() => {
          setModalData({ show: false });
          fetchStructures(areaId);
        }}
        onClose={() => setModalData({ show: false })}
      />
    ));
  };

  return (
    <div className="container-fluid">
      <div className="card scrollable-card my-md-3 m-3 p-2">
        <div className="card-title px-3 pt-2">
          <div className="row">
            <div className="col-12 col-md-9">
              <h4 className="text-start font-weight-bold m-2">Správa revíru</h4>
            </div>
            <div className="col-12 col-md-3 text-md-end">
              <button className="btn btn-secondary" onClick={handleAddArea}>+ Pridať oblasť</button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {areas.length === 0 ? (
            <p className="text-muted">Žiadne oblasti neboli nájdené.</p>
          ) : (
            <div className="row">
              {areas.map((area) => (
                <div className="col-md-6 col-lg-4 mb-3" key={area.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">{area.name}</h5>
                        <div>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditArea(area)}>Upraviť</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteArea(area.id)}>Vymazať</button>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-secondary mb-2" onClick={() => handleAddStructure(area.id)}>+ Pridať štruktúru</button>
                      {structures[area.id] ? (
                        <div style={{ overflowY: "auto", maxHeight: "200px" }}>
                          <ul className="list-group">
                            {structures[area.id].map((s) => (
                              <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center py-1">
                                {s.name}
                                <div>
                                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditStructure(s, area.id)}>Upraviť</button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteStructure(s.id, area.id)}>Vymazať</button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-muted">Načítavam štruktúry...</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default GroundManagement;
