import axios from "axios";

const BASE_URL = process.env.BASE_URL;

export const fetchEvents = async (email) => {
  const response = await axios.get(
    `${BASE_URL}/events?email=${encodeURIComponent(email)}`
  );
  return response.data;
};

export const saveEvent = async (eventId, eventData) => {
  const { eventId: id, ...rest } = eventData;
  if (eventId) {
    return await axios.put(`${BASE_URL}/event/${eventId}`, rest);
  } else {
    return await axios.post(`${BASE_URL}/event/save`, eventData);
  }
};

export const deleteEvent = async (eventId, email) => {
  return await axios.delete(`${BASE_URL}/event/${eventId}`, {
    data: { email },
  });
};
