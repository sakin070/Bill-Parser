import React from "react";
import SelectionCanvas from "./util/SelectionCanvas";
import ConfigTable from "./util/ConfigTable";

class PictureConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-lg-9">
            <SelectionCanvas />
          </div>
          <div className="col col-lg-3">
            <ConfigTable />
          </div>
        </div>
      </div>
    );
  }
}
export default PictureConfig;
