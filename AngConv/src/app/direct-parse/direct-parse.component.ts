import { Component, OnInit } from "@angular/core";

@Component({
  selector: "direct-parse",
  templateUrl: "./direct-parse.component.html"
})
export class DirectParseComponent implements OnInit {
  constructor() {}

  /** find which are inputs */
  selections = [];
  currentSelection = [];
  inputValue = "";
  files = [];
  imgPath = "";
  rectList = [];
  parsedText = "";
  inputList = [];

  ngOnInit() {
    /**
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:9999/selectionList", false);
    xhr.onload = function() {};
    xhr.send();
    this.selections = JSON.parse(xhr.responseText);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    */
  }

  //Receive the rect object (previously named selected, onSelected etc), and set it to currentSelection
  receiveFromChild($event) {
    if ($event["w"] > 6 && $event["h"] > 6) {
      this.currentSelection = $event;
    }
  }

  onClickAdd() {
    this.storeSelection();
  }

  onClickRemove(x) {
    this.rectList.splice(x, 1);
  }

  storeSelection = () => {
    const currentSelection = this.currentSelection[0];
    const inputValue = this.inputValue;
    this.selections = this.selections.concat(
      this.inputValue,
      this.currentSelection
    );
    this.rectList = this.rectList.concat(this.currentSelection);
    this.inputList = this.inputList.concat(this.inputValue);
    this.currentSelection = [];
    if (!currentSelection) {
    }
  };

  //Not sure yet
  updateNameValue = e => {
    this.inputValue = e.target.value;
  };

  viewDecider() {
    return `
<div>
  <div className="row">
    <div>
      <rector
        className="col-lg-9"
        [rectList]="rectList"
        (rectListEvent)="receiveFromChild($event)"
      ></rector>
    </div>
    <div className="col-lg-3"></div>
  </div>
</div>

      `;
  }
}
