/* global gapi */
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import configView from "./Pages/ConfigView";
import pictureConfig from "./Pages/PictureConfig";
import Home from "./Pages/home";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const responseGoogle = googleUser => {
  console.log(googleUser);
  console.log(googleUser.Zi.id_token);
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false
    };
  }

  componentDidMount() {}

  onLogin = googleUser => {
    this.setState({ signedIn: true });
    //Set the Google Login Token
    localStorage.setItem("test", googleUser.getAuthResponse().id_token);
  };

  getLoginContent() {
    if (this.state.signedIn) {
      return (
        <div class="googleButton">
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
        <div class="googleButton">
          <GoogleLogin
            clientId="213435619629-ldq6g698eqigrtn9v1hapdet6u72647u.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.onLogin}
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
