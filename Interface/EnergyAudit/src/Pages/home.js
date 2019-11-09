import React from "react";
import "../App.css";

import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import Logo from "./resources/imageToJSON.png";

function home() {
  return (
    <div class="mainContainer">
      <img
        class="marginBot3"
        src={Logo}
        alt="Logo"
        style={{ width: 400 }}
      ></img>
      <h1>Bill-to-Text</h1>
      <hr />
      <div class="container">
        <p class="marginBot3">
          Convert your bills to JSON using pre-built or create your own
          configurations.
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
