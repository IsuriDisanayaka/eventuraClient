import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/img/logo.png";
import "./Navbar.css";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Navbar = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const BASE_URL = process.env.BASE_URL;

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          localStorage.setItem("userData", JSON.stringify(data));
          fetch(`${BASE_URL}/google-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              googleId: data.sub,
              email: data.email,
              firstName: data.given_name,
              lastName: data.family_name,
              picture: data.picture,
            }),
          })
            .then((response) => response.json())
            .then((data) =>
              toast.success("Welcome!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            )

            .catch((error) =>
              toast.error("Error! try again", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            );
          window.location.reload();
        });
    },
    onError: () => {
      toast.error("Error! try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.location.reload();
      setUser(null);
      localStorage.removeItem("userData");
    },
    scope: "openid email profile",
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userData");
    setShowDropdown(false);
    window.location.reload();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} style={{ height: "15vh" }} alt="Eventura Logo" />
      </div>
      <div className="navbar-icon">
        {user ? (
          <div>
            <img
              src={user.picture}
              alt="User"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <FaUserCircle
            size={30}
            onClick={googleLogin}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
