import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Navbar from "../components/nav/Navbar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Modal from "../components/modal/Modal";
import { toast } from "react-toastify";
import "../screen/Calendar.css";

const localizer = momentLocalizer(moment);

function SchedulerCalendar() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const handleSelectSlot = ({ start, end }) => {
    if (!user) {
      toast.info("Please log in to add or edit events", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "loginPrompt",
      });
      return;
    }
    setSelectedEvent({
      start: formatDateTimeLocal(start),
      end: formatDateTimeLocal(end),
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    if (!user) {
      toast.info("Please log in to add or edit events", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setSelectedEvent({
      ...event,
      name: event.title,
      eventId: event.eventId,
    });
    setModalOpen(true);
  };

  const saveEvent = async (eventDetails) => {
    const { eventId, ...eventData } = eventDetails;
    eventData.start = new Date(eventData.start).toISOString();
    eventData.end = new Date(eventData.end).toISOString();
    try {
      if (eventId) {
        await axios.put(`http://localhost:5000/event/${eventId}`, eventData);
        toast.success("Event updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        await axios.post("http://localhost:5000/event/save", eventData);
        toast.success("Event created!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      fetchEvents();
      setModalOpen(false);
    } catch (error) {
      toast.error("Error! try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;
    try {
      const response = await axios.get("http://localhost:5000/events");
      const fetchedEvents = response.data.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        title: event.name,
        eventId: event.eventId,
      }));
      setEvents(fetchedEvents);
    } catch (error) {}
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const formatDateTimeLocal = (date) => {
    return moment(date).local().format("YYYY-MM-DDTHH:mm");
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/event/${eventId}`);
      toast.success("Event deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetchEvents();
      setModalOpen(false);
    } catch (error) {
      toast.error("Error! try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="App">
      <Navbar onUserLogin={setUser} />
      <div className="calendar-container">
        <Calendar
          selectable={!user}
          localizer={localizer}
          events={events}
          defaultView="week"
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          style={{ height: "100%", padding: "114px" }}
          onDoubleClickEvent={handleSelectEvent}
          timeslots={2}
          step={30}
          className={!user ? "calendar-blurred" : ""}
        />
        {!user && (
          <div className="login-prompt">
            Please log in to interact with the calendar
          </div>
        )}
      </div>
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          onSave={saveEvent}
          onDelete={deleteEvent}
          initialEvent={selectedEvent}
        />
      )}
    </div>
  );
}

export default SchedulerCalendar;
