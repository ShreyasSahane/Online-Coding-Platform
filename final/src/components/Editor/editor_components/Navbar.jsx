import React from "react";
import "../styles/Navbar.css";

const Navbar = ({ activeTab, onTabChange }) => {
  return (
    <div className="navbar">
      <button
        className={`nav-button ${activeTab === "description" ? "active" : ""}`}
        onClick={() => onTabChange("description")}
      >
        Problem Description
      </button>
      <button
        className={`nav-button ${activeTab === "submissions" ? "active" : ""}`}
        onClick={() => onTabChange("submissions")}
      >
        Submissions
      </button>
      <button
        className={`nav-button ${activeTab === "solution" ? "active" : ""}`}
        onClick={() => onTabChange("solution")}
      >
        Solution
      </button>
      {/* <button
        className={`nav-button ${activeTab === "terminal" ? "active" : ""}`}
        onClick={() => onTabChange("terminal")}
      >
        Terminal
      </button> */}
    </div>
  );
};

export default Navbar;
