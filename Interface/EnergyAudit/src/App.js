import React from "react";
import "./App.css";

import ConfigView from "./Pages/ConfigView";
import PictureConfig from "./Pages/PictureConfig";
import DirectParse from "./Pages/DirectParse";
import Home from "./Pages/home";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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
      <Route path="/picture" exact component={ConfigView} />
      <Route path="/configuration" exact component={PictureConfig} />
      <Route path="/direct" exact component={DirectParse} />
    </Router>
  );
}

export default App;
