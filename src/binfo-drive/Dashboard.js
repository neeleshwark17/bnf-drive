import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ROOT_FOLDER, useFolder } from "../hooks/useFolder";
import { firestore } from "../firebase";
import AddFolderButton from "./AddFolderButton";
import AddFileButton from "./AddFileButton";
import NavbarComponent from "./NavbarComponent";
import Folder from "./Folder";
import File from "./File";
import FolderBreadCrumbs from "./FolderBreadCrumbs";
import Sidebar from "./Sidebar";
import SkeletonLoader from "./SkeletonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faList, 
  faThLarge, 
  faSort,
  faSearch,
  faFolderOpen
} from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const history = useHistory();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [folderId]);

  const handleFolderDelete = async () => {
    try {
      await firestore.collection("folders").doc(folder.id).delete();
      history.push("/");
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  return (
    <div className="app-container">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content-with-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <NavbarComponent />
        <div className="dashboard-container">
          <div className="dashboard-header">
            <FolderBreadCrumbs currentFolder={folder} />
            <div className="dashboard-search">
              <input 
                type="text" 
                className="search-input"
                placeholder="Search in Drive"
              />
            </div>
            <div className="view-toggle" onClick={toggleViewMode}>
              <FontAwesomeIcon icon={viewMode === "list" ? faThLarge : faList} />
            </div>
          </div>
          
          <div className="dashboard-toolbar">
            <div className="toolbar-left">
              <AddFileButton currentFolder={folder} />
              <AddFolderButton currentFolder={folder} />
              {folder && folder.name !== ROOT_FOLDER.name && (
                <button className="action-button" onClick={handleFolderDelete}>
                  Delete folder
                </button>
              )}
            </div>
            <div className="toolbar-right">
              <div className="sort-options">
                <div className="sort-option">
                  <FontAwesomeIcon icon={faSort} />
                  <span>Name</span>
                </div>
                <div className="sort-option">Last modified</div>
                <div className="sort-option">File size</div>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {loading ? (
              <>
                <SkeletonLoader type="folder" count={4} />
                <SkeletonLoader type="file" count={6} />
              </>
            ) : (
              <>
                {childFolders.length > 0 && (
                  <div className={`folders-container ${viewMode}`}>
                    {childFolders.map((childFolder) => (
                      <div key={childFolder.id} className="folder-item">
                        <Folder folder={childFolder} />
                      </div>
                    ))}
                  </div>
                )}
                {childFiles.length > 0 && (
                  <div className={`files-container ${viewMode}`}>
                    {childFiles.map((childFile) => (
                      <div key={childFile.id} className="file-item">
                        <File file={childFile} passFolder={folder} />
                      </div>
                    ))}
                  </div>
                )}
                {childFolders.length === 0 && childFiles.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FontAwesomeIcon icon={faFolderOpen} />
                    </div>
                    <h2>This folder is empty</h2>
                    <p>Drop files here or use the New button to add files</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
