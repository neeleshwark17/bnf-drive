import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDesktop,
  faUsers,
  faClock,
  faStar,
  faExclamationCircle,
  faTrash,
  faCloud,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = () => {
  const storageUsed = 11.42;
  const storageLimit = 15;
  const storagePercentage = (storageUsed / storageLimit) * 100;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="drive-logo">
          <img
            src="binfo_logo.png"
            alt="Drive"
            style={{ borderRadius: "10px" }}
            className="drive-icon"
          />
          <span className="drive-text">BNF Drive</span>
        </div>
      </div>

      {/* <div className="new-button-container">
        <button className="new-button">
          <FontAwesomeIcon icon={faPlus} className="new-icon" />
          <span>New</span>
        </button>
      </div> */}

      <nav className="sidebar-menu">
        <NavLink to="/" className="sidebar-item" end>
          <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
          <span className="sidebar-text">Home</span>
        </NavLink>

        {/* <NavLink to="/my-drive" className="sidebar-item" end>
          <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
          <span className="sidebar-text">My Drive</span>
        </NavLink> */}

        {/* <NavLink to="/computers" className="sidebar-item">
          <FontAwesomeIcon icon={faDesktop} className="sidebar-icon" />
          <span className="sidebar-text">Computers</span>
        </NavLink> */}

        {/* <NavLink to="/shared" className="sidebar-item">
          <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
          <span className="sidebar-text">Shared with me</span>
        </NavLink> */}
        {/* 
        <NavLink to="/recent" className="sidebar-item">
          <FontAwesomeIcon icon={faClock} className="sidebar-icon" />
          <span className="sidebar-text">Recent</span>
        </NavLink> */}

        <NavLink to="/starred" className="sidebar-item">
          <FontAwesomeIcon icon={faStar} className="sidebar-icon" />
          <span className="sidebar-text">Starred</span>
        </NavLink>
        {/* 
        <NavLink to="/spam" className="sidebar-item">
          <FontAwesomeIcon icon={faExclamationCircle} className="sidebar-icon" />
          <span className="sidebar-text">Spam</span>
        </NavLink> */}

        <NavLink to="/trash" className="sidebar-item">
          <FontAwesomeIcon icon={faTrash} className="sidebar-icon" />
          <span className="sidebar-text">Trash</span>
        </NavLink>

        <div className="sidebar-divider"></div>

        <div className="storage-section">
          <NavLink to="/storage" className="sidebar-item">
            <FontAwesomeIcon icon={faCloud} className="sidebar-icon" />
            <span className="sidebar-text">Storage</span>
          </NavLink>
          <div className="storage-details">
            <div className="storage-progress">
              <div
                className="storage-progress-bar"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <div className="storage-text">
              <span>
                {storageUsed} GB of {storageLimit} GB used
              </span>
            </div>
            <button className="get-storage-button">Get more storage</button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
