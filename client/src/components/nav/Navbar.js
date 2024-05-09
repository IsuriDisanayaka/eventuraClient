import React from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/img/logo.png";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} style={{ height: " 15vh" }} alt="Eventura Logo" />
      </div>
      <div className="navbar-icon">
        <FaUserCircle size={30} />
      </div>
    </div>
  );
};

export default Navbar;
