import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Navbar from "../../components/nav/Navbar";
import CustomToolbar from "../../components/CustomToolbar/CustomToolbar";
import Modal from "../../components/modals/Modal";
import { toast } from "react-toastify";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { fetchEvents, saveEvent, deleteEvent } from "../../services/apiService";

const localizer = momentLocalizer(moment);

function SchedulerCalendar() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (user) {
      handleFetchEvents();
    }
  }, [user]);

  const handleFetchEvents = async () => {
    if (!user) return;
    try {
      const fetchedEvents = await fetchEvents(user.email);
      const mappedEvents = fetchedEvents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        title: event.name,
        eventId: event.eventId,
        reminderSent: event.reminderSent,
      }));
      setEvents(mappedEvents);
    } catch (error) {}
  };

  const handleSelectEvent = (event) => {
    if (!user) {
      toast.info("Please log in to add or edit events");
      return;
    }
    setSelectedEvent({ ...event, name: event.title, eventId: event.eventId });
    setModalOpen(true);
  };

  const handleSelectSlot = ({ start, end }) => {
    if (!user) {
      toast.info("Please log in to manage events.");
      return;
    }
    setSelectedEvent({
      start: moment(start).format("YYYY-MM-DDTHH:mm"),
      end: moment(end).format("YYYY-MM-DDTHH:mm"),
    });
    setModalOpen(true);
  };

  const handleEventSave = async (eventDetails) => {
    try {
      await saveEvent(eventDetails.eventId, {
        ...eventDetails,
        start: new Date(eventDetails.start).toISOString(),
        end: new Date(eventDetails.end).toISOString(),
        email: user.email,
      });
      toast.success(eventDetails.eventId ? "Event updated!" : "Event created!");
      handleFetchEvents();
      setModalOpen(false);
    } catch (error) {
      toast.error("Error saving the event, please try again.");
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      await deleteEvent(eventId, user.email);
      toast.success("Event deleted!");
      handleFetchEvents();
      setModalOpen(false);
    } catch (error) {
      toast.error("Error deleting the event, please try again.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const customMessages = {
    noEventsInRange: "No results found.",
  };

  return (
    <div className="App">
      <Navbar onUserLogin={setUser} />
      <div>
        {searchResults.map((event) => (
          <div key={event.eventId}>
            {event.name} - {event.date}
          </div>
        ))}
      </div>
      <div className="calendar-container">
        <Calendar
          selectable={!!user}
          localizer={localizer}
          events={filteredEvents}
          defaultView="month"
          views={["month", "week", "day", "agenda"]}
          components={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            ),
          }}
          messages={customMessages}
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
          <div className="login-pop">Access the calendar by logging in.</div>
        )}
      </div>
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
          initialEvent={selectedEvent}
        />
      )}
    </div>
  );
}

export default SchedulerCalendar;
