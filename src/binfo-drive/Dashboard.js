import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ROOT_FOLDER, useFolder } from "../hooks/useFolder";
import { storage, database } from "../firebase";
import { v4 as uuidV4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";
import NavbarComponent from "./NavbarComponent";
import Folder from "./Folder";
import File from "./File";
import FolderBreadCrumbs from "./FolderBreadCrumbs";
import Sidebar from "./Sidebar";
import SkeletonLoader from "./SkeletonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus,
  faFileUpload,
  faFolderPlus,
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
  const [viewMode, setViewMode] = useState("list");
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const fileInputRef = useRef();
  const { currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [folderId]);

  const handleFolderDelete = async () => {
    try {
      await database.folders.doc(folder.id).delete();
      history.push("/");
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  const toggleFabMenu = () => {
    setIsFabMenuOpen(!isFabMenuOpen);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (folder == null) return;

      const id = uuidV4();
      setUploadingFiles(prevUploadingFiles => [
        ...prevUploadingFiles,
        { id: id, name: file.name, progress: 0, error: false }
      ]);

      const filePath =
        folder === ROOT_FOLDER
          ? `${folder.path.join("/")}/${file.name}`
          : `${folder.path.join("/")}/${folder.name}/${file.name}`;

      const uploadTask = storage
        .ref(`/files/${currentUser.uid}/${filePath}`)
        .put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
          setUploadingFiles(prevUploadingFiles => {
            return prevUploadingFiles.map(uploadFile => {
              if (uploadFile.id === id) {
                return { ...uploadFile, progress: progress };
              }
              return uploadFile;
            });
          });
        },
        () => {
          setUploadingFiles(prevUploadingFiles => {
            return prevUploadingFiles.map(uploadFile => {
              if (uploadFile.id === id) {
                return { ...uploadFile, error: true };
              }
              return uploadFile;
            });
          });
        },
        () => {
          setUploadingFiles(prevUploadingFiles => {
            return prevUploadingFiles.filter(uploadFile => uploadFile.id !== id);
          });

          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            database.files
              .where("name", "==", file.name)
              .where("userId", "==", currentUser.uid)
              .where("folderId", "==", folder.id)
              .get()
              .then(existingFiles => {
                const existingFile = existingFiles.docs[0];
                if (existingFile) {
                  existingFile.ref.update({ url: url });
                } else {
                  database.files.add({
                    url: url,
                    name: file.name,
                    createdAt: database.getCurrentTimeStamp(),
                    folderId: folder.id,
                    userId: currentUser.uid,
                  });
                }
              });
          });
        }
      );
    });
  };

  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!newFolderName) return;

    const path = [...(folder?.path || [])];
    if (folder !== ROOT_FOLDER) {
      path.push({ name: folder.name, id: folder.id });
    }

    try {
      await database.folders.add({
        name: newFolderName,
        parentId: folder?.id || null,
        userId: currentUser.uid,
        path: path,
        createdAt: database.getCurrentTimeStamp(),
      });

      setNewFolderName("");
      setShowCreateFolderModal(false);
      setIsFabMenuOpen(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content-with-sidebar">
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
                    {childFolders.map(childFolder => (
                      <div key={childFolder.id} className="folder-item">
                        <Folder folder={childFolder} />
                      </div>
                    ))}
                  </div>
                )}
                {childFiles.length > 0 && (
                  <div className={`files-container ${viewMode}`}>
                    {childFiles.map(childFile => (
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

          {/* Floating Action Button */}
          <div className="fab-container">
            <button className="fab" onClick={toggleFabMenu}>
              <FontAwesomeIcon icon={faPlus} className="fab-icon" />
            </button>
            <div className={`fab-menu ${isFabMenuOpen ? 'open' : ''}`}>
              <div className="fab-menu-item" onClick={() => fileInputRef.current.click()}>
                <FontAwesomeIcon icon={faFileUpload} className="fab-menu-icon" />
                <span className="fab-menu-text">Upload files</span>
              </div>
              <div className="fab-menu-item" onClick={() => setShowCreateFolderModal(true)}>
                <FontAwesomeIcon icon={faFolderPlus} className="fab-menu-icon" />
                <span className="fab-menu-text">New folder</span>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="file-input"
            multiple
          />

          {/* Upload Progress Overlay */}
          {uploadingFiles.length > 0 && (
            <div className="upload-progress-overlay">
              {uploadingFiles.map(file => (
                <div key={file.id} className="progress-item">
                  <div className="progress-header">
                    <span className="progress-filename">{file.name}</span>
                    <span>{Math.round(file.progress * 100)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar"
                      style={{ width: `${file.progress * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Folder Modal */}
          {showCreateFolderModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Create new folder</h2>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                />
                <div className="modal-actions">
                  <button onClick={() => setShowCreateFolderModal(false)}>Cancel</button>
                  <button onClick={handleCreateFolder}>Create</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
