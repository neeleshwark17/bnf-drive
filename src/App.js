import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./binfo-drive/Login";
import Dashboard from "./binfo-drive/Dashboard";
import Profile from "./binfo-drive/Profile";
import Trash from "./binfo-drive/Trash";
import Storage from "./binfo-drive/Storage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute exact path="/folder/:folderId" component={Dashboard} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/trash" component={Trash} />
            <PrivateRoute exact path="/storage" component={Storage} />
          </Switch>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App; 