import React from "react";
import logo from "./logo.svg";
import "./App.css";

import config from "./Pages/config";
import pictureConfig from "./Pages/PictureConfig";
import Home from "./Pages/home";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <nav>
        <div class="navContainer">
          <Link to="/" style={{ color: "white" }}>
            <h3>Energy Audit</h3>
          </Link>
        </div>
      </nav>

      <Route path="/" exact component={Home} />
      <Route path="/picture" exact component={pictureConfig} />
      <Route path="/configuration" exact component={config} />
    </Router>
  );
}

export default App;
