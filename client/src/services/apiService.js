import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const fetchEvents = async (email) => {
  const response = await axios.get(
    `${baseUrl}/events?email=${encodeURIComponent(email)}`
  );
  return response.data;
};

export const saveEvent = async (eventId, eventData) => {
  const { eventId: id, ...rest } = eventData;
  if (eventId) {
    return await axios.put(`${baseUrl}/event/${eventId}`, rest);
  } else {
    return await axios.post(`${baseUrl}/event/save`, eventData);
  }
};

export const deleteEvent = async (eventId, email) => {
  return await axios.delete(`${baseUrl}/event/${eventId}`, {
    data: { email },
  });
};
