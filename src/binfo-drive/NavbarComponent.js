import { Avatar } from "@material-ui/core";
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NavbarComponent() {
  const {currentUser} =useAuth()
  return (
    <Navbar bg="light" style={{ minWidth: "100vw" }}>
      <Navbar.Brand as={Link} to="/" className="p-2">
        <img src='binfo_logo.png' width='60vw' height='40vh' style={{ borderRadius:'10px' }}/>
        BNF Drive
      </Navbar.Brand>
      <Nav className="ms-auto">
        <Nav.Link as={Link} to="/user" className="pe-5">
          <div className='d-flex btn btn-outline-dark' style={{alignItems:'center'}} >
            {/* <Avatar className="pe-2" style={{ float: "left" }} /> */}
            <b>Profile</b>
          </div>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
