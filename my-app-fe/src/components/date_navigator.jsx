import { useState, useEffect } from "react";

function formatDay(date) {
  return date.toISOString().slice(0, 10);
}

function formatMonthBackend(date) {
  return date.toISOString().slice(0, 7); // "2024-05" → pre backend filter
}

function formatMonthInput(date) {
  return date.toISOString().slice(0, 7); // pre input typu "month"
}

function parseMonthInput(value) {
  const [year, month] = value.split("-");
  return new Date(parseInt(year), parseInt(month) - 1);
}

function parseInitial(dateStr, mode) {
  if (mode === "month") {
    // očakáva sa formát "YYYY-MM"
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      return new Date(`${dateStr}-01`);
    }
  }
  return new Date(dateStr);
}

function DateNavigator({ date, onChange, mode = "day" }) {
  const [current, setCurrent] = useState(parseInitial(date, mode));

  useEffect(() => {
    if (mode === "month") {
      onChange(formatMonthBackend(current));
    } else {
      onChange(formatDay(current));
    }
  }, [current, mode]);

  const change = (delta) => {
    const next = new Date(current);
    if (mode === "month") {
      next.setMonth(next.getMonth() + delta);
    } else {
      next.setDate(next.getDate() + delta);
    }
    setCurrent(next);
  };

  const handleChange = (e) => {
    const newDate =
      mode === "month" ? parseMonthInput(e.target.value) : new Date(e.target.value);
    if (!isNaN(newDate)) {
      setCurrent(newDate);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
      <button className="btn btn-sm btn-outline-secondary" onClick={() => change(-1)}>←</button>

      {mode === "month" ? (
        <div className="position-relative">
          <input
            type="month"
            readOnly
            className="form-control text-center"
            style={{ maxWidth: "150px" }}
            value={formatMonthInput(current)}
            onChange={handleChange}
          />
        </div>
      ) : (
        <input
          type="date"
          className="form-control text-center"
          style={{ maxWidth: "150px" }}
          value={formatDay(current)}
          onChange={handleChange}
        />
      )}

      <button className="btn btn-sm btn-outline-secondary" onClick={() => change(1)}>→</button>
    </div>
  );
}

export default DateNavigator;
