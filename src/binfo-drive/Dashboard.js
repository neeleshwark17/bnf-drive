import React from "react";
import { Button, Container } from "react-bootstrap";
import { ROOT_FOLDER, useFolder } from "../hooks/useFolder";
import AddFolderButton from "./AddFolderButton";
import NavbarComponent from "./NavbarComponent";
import Folder from "./Folder";
import { useHistory, useLocation, useParams } from "react-router-dom";
import FolderBreadCrumbs from "./FolderBreadCrumbs";
import AddFileButton from "./AddFileButton";
import File from "./File";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { firestore } from "../firebase";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(
    folderId,
    state.folder
  );

  const history = useHistory();

  console.log("++++++++++++>>", folder && folder.name);

  async function handleFolderDelete() {
    const delQuery = await firestore.collection("folders").doc(folder.id);

    delQuery
      .delete()
      .then(() => {
        history.push("/");
      })
      .catch((e) => {
        console.log(`%c folder-----------> `, "background-color:red", e);
      });
  }

  return (
    <>
      <NavbarComponent />
      <br />
      <Container fluid>
        <div className="d-flex align-items-center" style={{ minWidth: "95vw" }}>
          <FolderBreadCrumbs currentFolder={folder} className="pe-4" />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>
        <br />
        <div
          style={{ width: "95vw", display: "flex", justifyContent: "flex-end" }}
        >
          {(ROOT_FOLDER && folder) && folder.name != ROOT_FOLDER.name ? (
            <Button
              variant="btn btn-outline-danger"
              onClick={handleFolderDelete}
            >
              <DeleteOutlineIcon />
              Delete current folder
            </Button>
          ) : null}

          
        </div>
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map((childFolder) => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "200px" }}
                className="p-2"
              >
                <Folder folder={childFolder} className="d-flex" />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap" style={{ minWidth: "100vw" }}>
            {childFiles.map((childFile) => (
              <div
                key={childFile.id}
                style={{ width: "200px" }}
                className="p-1 m-2"
              >
                <File file={childFile} passFolder={folder} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
