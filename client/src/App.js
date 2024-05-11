import React from "react";
import { ToastContainer } from "react-toastify";
import SchedulerCalendar from "./screen/calendar/Calendar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="App">
        <ToastContainer />
        <SchedulerCalendar />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
