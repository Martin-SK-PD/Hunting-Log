import { useEffect, useState } from "react";
import CenteredModal from "./centered_modal";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; 

function People_in_ground() {
  const { user, logout } = useAuth(); // získame aktuálneho používateľa a logout
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmStep, setConfirmStep] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/v1/hunters/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const confirmTransfer = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/v1/hunters/transfer-admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ newAdminId: selectedUser.id })
      });

      if (!res.ok) throw new Error((await res.json()).msg);

      toast.success("Rola admina bola presunutá. Budeš odhlásený.");
      setSelectedUser(null);
      setConfirmStep(false);

      // Krátka pauza na zobrazenie toastu a odhlásenie
      setTimeout(() => logout(), 1500);
      
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container-fluid py-1">
      <div className="card scrollable-card my-md-3 m-3 p-2">
        <div className="card-title font-weight-bold px-3 pt-2 m-2 ">
          <h4>Ľudia v revíri</h4>
        </div>
        <div className="card-body">
          <div className="row">
            {users.map((u) => (
              <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={u.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{u.first_name} {u.last_name}</h5>
                    <p className="mb-1"><strong>Použivateľské meno:</strong> {u.username}</p>
                    <p className="mb-1"><strong>Email:</strong> {u.email}</p>
                    <p className="mb-1"><strong>Adresa:</strong> {u.street} {u.house_number}, {u.postal_code} {u.city}</p>

                    {u.is_admin && <span className="badge bg-primary">Admin</span>}

                    {!u.is_admin && user?.id !== u.id && (
                      <button className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => {
                          setSelectedUser(u);
                          setConfirmStep(true);
                        }}
                      >
                        Odovzdať rolu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal na potvrdenie */}
      <CenteredModal
        show={confirmStep}
        onClose={() => {
          setSelectedUser(null);
          setConfirmStep(false);
        }}
        title="Potvrdenie"
      >
        <p>
          Skutočne chceš presunúť admin rolu na{" "}
          <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>?
        </p>
        <div className="text-end">
          <button className="btn btn-secondary me-2" onClick={() => setConfirmStep(false)}>Zrušiť</button>
          <button className="btn btn-danger" onClick={confirmTransfer}>Potvrdiť</button>
        </div>
      </CenteredModal>
    </div>
  );
}

export default People_in_ground;
