import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../hooks/useFolder";

export default function FolderBreadCrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  console.log(currentFolder);
  if (currentFolder) path = [...path, ...currentFolder.path];
  return (
    <Breadcrumb
      className="flex-grow-1"
      // style={{width:'100%'}}
      listProps={{ className: "bg-white pl-0 m-0" }}
    >
      {[
        path.map((folder, index) => (
          <Breadcrumb.Item
            key={folder.id}
            linkAs={Link}
            linkProps={{
              to: {
                pathname: folder.id ? `/folder/${folder.id}` : "/",
                state: { folder: { ...folder, path: path.slice(1, index) } },
              },
            }}
            className="text-truncate d-inline-block"
            style={{ maxWidth: "200px" }}
          >
            {folder.name}
          </Breadcrumb.Item>
        )),
      ]}

      {currentFolder && (
        <Breadcrumb.Item
          className="text-truncate d-inline-block"
          style={{ maxWidth: "200px" }}
          active
        >
          {currentFolder.name}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}
