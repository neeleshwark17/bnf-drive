import React from "react";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { IconButton } from "@material-ui/core";
import { firestore } from "../firebase";
import { storage } from "../firebase";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { useAuth } from "../contexts/AuthContext";

export default function File({ file, passFolder }) {
  const { currentUser } = useAuth();
  const filePath =
    passFolder === ROOT_FOLDER
      ? `${passFolder.path.join("/")}/${file.name}`
      : `${passFolder.path.join("/")}/${passFolder.name}/${file.name}`;

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    const storageRef = storage.ref();
    let photo = storageRef.child(`/files/${currentUser.uid}/${filePath}`);

    photo
      .delete()
      .then(() => {
        console.log("deleted");
      })
      .catch((e) => {
        console.log("error->" + e);
      });

    const record = await firestore.collection("files").doc(file.id);
    record.delete();
  }

  function getExtension(filename) {
    var parts = filename.name.split(".");
    return parts[parts.length - 1];
  }

  function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case "jpg":
      case "gif":
      case "bmp":
      case "png":
      case "jpeg":
        return true;
    }
    return false;
  }

  function getFileIcon() {
    const ext = getExtension(file).toLowerCase();
    
    // Return appropriate icon based on file extension
    switch (ext) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📑";
      case "txt":
        return "📃";
      case "zip":
      case "rar":
        return "📦";
      default:
        return "📄";
    }
  }

  if (isImage(file)) {
    return (
      <div className="file-item">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="file-link"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="file-preview">
            <img src={file.url} alt={file.name} className="file-image" />
          </div>
          <div className="file-name">{file.name}</div>
        </a>
        <IconButton 
          onClick={handleDelete}
          className="file-delete-button"
          size="small"
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </div>
    );
  } else {
    return (
      <div className="file-item">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="file-link"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="file-preview">
            <div className="file-icon">{getFileIcon()}</div>
          </div>
          <div className="file-name">{file.name}</div>
        </a>
        <IconButton 
          onClick={handleDelete}
          className="file-delete-button"
          size="small"
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </div>
    );
  }
}
