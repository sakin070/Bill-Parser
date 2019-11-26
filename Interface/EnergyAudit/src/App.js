/* global gapi */
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import configView from "./Pages/ConfigView";
import pictureConfig from "./Pages/PictureConfig";
import Home from "./Pages/home";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false
    };
  }

  componentDidMount() {}

  getLoginContent() {
    if (this.state.signedIn) {
      return (
        <div>
          <p> Hello User </p>
          <GoogleLogout
            clientId="213435619629-ldq6g698eqigrtn9v1hapdet6u72647u.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={response => {
              this.setState({ signedIn: false });
            }}
          ></GoogleLogout>
        </div>
      );
    } else {
      return (
        <div>
          <p>You are not signed in. Click here to sign in.</p>
          <GoogleLogin
            clientId="213435619629-ldq6g698eqigrtn9v1hapdet6u72647u.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={response => {
              this.setState({ signedIn: true });
            }}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      );
    }
  }

  render() {
    return (
      <Router>
        <div class="navContainer">
          <nav>
            <Link to="/" style={{ color: "white" }}>
              <h3>Energy Audit</h3>
            </Link>
            {this.getLoginContent()}
          </nav>
        </div>
        <Route path="/" exact component={Home} />
        <Route path="/picture" exact component={pictureConfig} />
        <Route path="/configuration" exact component={configView} />
      </Router>
    );
  }
}

export default App;
