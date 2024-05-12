import React, { useState } from "react";
import moment from "moment";
import "./Modal.css";

function Modal({ isOpen, onClose, onSave, onDelete, initialEvent = {} }) {
  const formatDateTimeLocal = (date) => {
    return moment(date).local().format("YYYY-MM-DDTHH:mm");
  };

  const [name, setName] = useState(initialEvent.name || "");
  const [description, setDescription] = useState(
    initialEvent.description || ""
  );
  const [start, setStart] = useState(
    initialEvent.start ? formatDateTimeLocal(initialEvent.start) : ""
  );
  const [end, setEnd] = useState(
    initialEvent.end ? formatDateTimeLocal(initialEvent.end) : ""
  );
  const isEditing = Boolean(initialEvent && initialEvent.eventId);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      description,
      start: new Date(start),
      end: new Date(end),
      eventId: initialEvent.eventId,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? "View Event" : "Add New Event"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-text"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="textarea"
          />
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className="datetime-input"
          />
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            className="datetime-input"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <button type="submit" className="button button-save">
              {isEditing ? "Update" : "Save"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => onDelete(initialEvent.eventId)}
                className="button button-delete"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="button button-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
