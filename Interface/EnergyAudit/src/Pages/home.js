import React from "react";
import "../App.css";

import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import Logo from "./resources/imageToJSON.jpg";

function home() {
  return (
    <div class="mainContainer">
      <img
        class="marginBot3"
        src={Logo}
        alt="Logo"
        style={{ width: 180 }}
      ></img>
      <h1>Whatever the tool is being called</h1>
      <div class="container">
        <p class="marginBot3">
          Give a quick blurb on what it does, you know the ref
        </p>
        <div className="configButton">
          <Link to="/picture">
            <button class="ui icon right labeled button">
              <i aria-hidden="true" class="right arrow icon"></i>
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default home;
