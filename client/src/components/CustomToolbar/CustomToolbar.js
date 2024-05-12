import React from "react";

function CustomToolbar({
  localizer,
  view,
  views,
  label,
  onView,
  onNavigate,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate("PREV")}>
          back
        </button>
        <button type="button" onClick={() => onNavigate("NEXT")}>
          next
        </button>
        <span className="rbc-toolbar-label">{label}</span>
        <button
          type="button"
          style={{ backgroundColor: "lightblue" }}
          onClick={() => onNavigate("TODAY")}
        >
          today
        </button>
      </span>
      <span className="rbc-btn-group">
        {views.map((name) => (
          <button key={name} type="button" onClick={() => onView(name)}>
            {localizer.messages[name]}
          </button>
        ))}
      </span>
      {view === "agenda" && (
        <input
          type="text"
          placeholder="Search events"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ float: "right", margin: "10px" }}
        />
      )}
    </div>
  );
}

export default CustomToolbar;
