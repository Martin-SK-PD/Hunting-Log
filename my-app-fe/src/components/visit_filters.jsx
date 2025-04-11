function VisitFilters({ filters, onChange, locationLabel = "Oblasť" }) {
    const handleChange = (e) => {
      onChange({ ...filters, [e.target.name]: e.target.value });
    };
  
    return (
      <div className="row g-2">
        <div className="col-md-4">
          <label className="form-label"htmlFor="hunter" >Meno lovca</label>
          <input
            type="text"
            name="hunter"
            id="hunter"
            value={filters.hunter}
            onChange={handleChange}
            className="form-control"
            placeholder="Zadaj meno lovca"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="location">{locationLabel}</label>
          <input
            type="text"
            name="location"
            id="location"
            value={filters.location}
            onChange={handleChange}
            className="form-control"
            placeholder="Zadaj oblasť alebo štruktúru"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="purpose">Účel</label>
          <select
            name="purpose"
            id="purpose"
            value={filters.purpose}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Všetky</option>
            <option value="Lov">Lov</option>
            <option value="Obhliadka">Obhliadka</option>
            <option value="Prikrmovanie">Prikrmovanie</option>
            <option value="Oprava">Oprava</option>
            <option value="Prenocovanie">Prenocovanie</option>
          </select>
        </div>
      </div>
    );
  }
  
  export default VisitFilters;
  