function HuntingFilters({ filters, onChange }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="row g-2">
      <div className="col-md-4">
        <label className="form-label" htmlFor="hunter">Meno lovca</label>
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
        <label className="form-label" htmlFor="location">Oblasť / Štruktúra</label>
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
        <label className="form-label" htmlFor="animal">Zver</label>
        <input
          type="text"
          name="animal"
          id="animal"
          value={filters.animal}
          onChange={handleChange}
          className="form-control"
          placeholder="Zadaj názov zveri"
        />
      </div>
    </div>
  );
}

export default HuntingFilters;
