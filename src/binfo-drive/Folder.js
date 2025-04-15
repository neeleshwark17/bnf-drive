import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Folder({ folder }) {
  return (
    <Link
      to={{ pathname: `/folder/${folder.id}`, state: { folder: folder } }}
      className="folder-link"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="folder-item">
        <FontAwesomeIcon icon={faFolder} className="folder-icon" />
        <div className="folder-name">{folder && folder.name}</div>
      </div>
    </Link>
  );
}
