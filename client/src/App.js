import React from "react";
import { ToastContainer } from "react-toastify";
import SchedulerCalendar from "./screen/Calendar";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <SchedulerCalendar />
    </div>
  );
}

export default App;
