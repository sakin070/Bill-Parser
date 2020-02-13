import { Component, OnInit } from "@angular/core";

@Component({
  selector: "direct-parse",
  templateUrl: "./direct-parse.component.html"
})
export class DirectParseComponent implements OnInit {
  constructor() {}

  /** find which are inputs */
  files = [];
  selections;
  selection = [];
  imgPath = "";
  rectList = [];

  ngOnInit() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:9999/selectionList", false);
    xhr.onload = function() {};
    xhr.send();
    selections = JSON.parse(xhr.responseText);
    /** Need to change file handler */
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  parseTuple(t) {
    const items = t.replace(/^\[|]$/g, "").split("),(");
    items.forEach(function(val, index, array) {
      array[index] = val.split(",").map(Number);
    });
    return items;
  }

  updateCanvas = rectList => {
    let i;
    let array = [];
    for (i = 0; i < rectList.length; i++) {
      let rect = this.parseTuple(rectList[i])[0];
      array = array.concat({ x: rect[0], y: rect[1], w: rect[2], h: rect[3] });
    }
    this.rectList = array;
  };

  handleFileUpload(e) {
    let file = e.target.files[0]; // this is the file you want
    //Needs to be ported
    //this.setState(oldState => ({ files: oldState.files.concat(file) }));
    this.imgPath = window.URL.createObjectURL(file);
  }

  viewDecider() {
    if (this.files.length === 0) {
      /** input tag needs fixing to be angular */
      return `
        <div className= "ui text container" >
          <h2 className="ui header" > Configuration Viewer </h2>
            <p> To  see if any of the available templates fit your needs </p>
            <br/>
            <p>
              Upload the image you wish to validate against
              <ul>
                <label htmlFor="files" className = "ui primary button" > Select File < /label>
                <input id = "files" style = {{ visibility: "hidden" }} type = "file" accept = "image/*" onChange = { this.handleFileUpload } />
              </ul>
          </p>
        </div>
      `;
    } else {
      /** most selectors need to be changed to Angular (params, functions) */
      return `
          <div>
            <div className="row">
              <div >
                <SelectionCanvas className="col-lg-9" onSelect={this.addSelection} imgPath={this.state.imgPath} rectList={this.state.rectList}/>
              </div>
              <div className="col-lg-3" style={{marginLeft:'10px'}}>
                <p>Available configurations</p>
                <div className="list-group" id="list-tab" role="tablist">
                  {Object.entries(this.state.selections).map((d,key) => {
                    return <div>
                      <button className="list-group-item list-group-item-action" id="list-home-list"  style={{marginBottom:'10px'}} data-toggle="list" role="tab" aria-controls="home" onClick={() => this.updateCanvas(Object.values(d[1]))}> {eval(JSON.stringify(d[0]))} </button>
                    </div>;
                  })}
                </div>
              </div>
            </div>
          </div>
      `;
    }
  }
}
