import { useEffect } from "react";

function CenteredModal({ show, onClose, title, children }) {
  useEffect(() => {
    const body = document.body;
    if (show) {
      body.classList.add("modal-open");
    } else {
      body.classList.remove("modal-open");
    }
    return () => body.classList.remove("modal-open");
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Zavrieť"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CenteredModal;
