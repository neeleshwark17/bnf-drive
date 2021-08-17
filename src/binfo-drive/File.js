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

    const storageRef = storage.ref();
    let photo = storageRef.child(`/files/${currentUser.uid}/${filePath}`);

    console.log("---------->PHOTO", photo.location.path);

    photo
      .delete()
      .then(() => {
        console.log("deleted");
      })
      .catch((e) => {
        console.log("error->" + e);
      });

    const record = await firestore.collection("files").doc(file.id);
    console.log(file);
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
  if (isImage(file)) {
    return (
      <div>
        <a
          href={file.url}
          target="_blank"
          className="btn btn-outline-dark
                  text-truncate w-100"
        >
          <img width="140px" height="100px" src={file.url} />
          <br />
          {file.name}
        </a>
        <br />
        <center>
          <IconButton onClick={handleDelete}>
            <DeleteOutlineIcon />
          </IconButton>
        </center>
      </div>
    );
  } else {
    return (
      <div>
        <a
          href={file.url}
          target="_blank"
          className="btn btn-outline-dark
                  text-truncate w-100"
        >
          {file.name}
        </a>
        <br />
        <center>
          <IconButton onClick={handleDelete}>
            <DeleteOutlineIcon />
          </IconButton>
        </center>
      </div>
    );
  }
}
