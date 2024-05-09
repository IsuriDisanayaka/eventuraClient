import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Navbar from "../components/nav/Navbar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Modal from "../components/modal/Modal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

function SchedulerCalendar() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
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

  const formatDateTimeLocal = (date) => {
    return moment(date).local().format("YYYY-MM-DDTHH:mm");
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({
      start: formatDateTimeLocal(start),
      end: formatDateTimeLocal(end),
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

  const handleSelectEvent = (event) => {
    setSelectedEvent({
      ...event,
      name: event.title,
      eventId: event.eventId,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="App">
      <Navbar />
      <Calendar
        selectable
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
      />

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
