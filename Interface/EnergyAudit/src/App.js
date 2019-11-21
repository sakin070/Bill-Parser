import React from "react";
import logo from "./logo.svg";
import "./App.css";

import configView from "./Pages/ConfigView";
import pictureConfig from "./Pages/PictureConfig";
import Home from "./Pages/home";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div class="navContainer">
        <nav>
          <Link to="/" style={{ color: "white" }}>
            <h3>Energy Audit</h3>
          </Link>
        </nav>
      </div>
      <Route path="/" exact component={Home} />
      <Route path="/picture" exact component={pictureConfig} />
      <Route path="/configuration" exact component={configView} />
    </Router>
  );
}

export default App;
