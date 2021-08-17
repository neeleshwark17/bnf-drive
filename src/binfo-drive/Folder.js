import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Folder({ folder }) {
  
  return (
    <div className="d-flex">
      <Button
        to={{ pathname: `/folder/${folder.id}`, state: { folder: folder } }}
        variant="outline-dark"
        className="mt-2 text-truncate d-flex"
        style={{ maxWidth: "130px" }}
        as={Link}
      >
        <FontAwesomeIcon icon={faFolder} className="me-2 mt-1" />
        {folder && folder.name}
      </Button>
    </div>
  );
}
