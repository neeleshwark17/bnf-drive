import React from "react";
import Signup from "../authentication/Signup";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "../authentication/Login";
import PrivateRoute from "../authentication/PrivateRoute";
import ForgotPassword from "../authentication/ForgotPassword";
import UpdateProfile from "../authentication/UpdateProfile";
import Profile from "../authentication/Profile";
import Dashboard from "../binfo-drive/Dashboard";

function App() {
  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Router>
        <AuthProvider>
          <Switch>
            {/* Drive  */}
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute exact path="/folder/:folderId" component={Dashboard} />

            {/* Profile */}
            <PrivateRoute path="/user" component={Profile} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />

            {/* Authentication */}
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
