import { Component, OnInit } from "@angular/core";

// <SelectionCanvas className="col-lg-9" onSelect={this.addSelection} imgPath={this.state.imgPath} rectList={this.state.rectList}/>

@Component({
  selector: "selection-canvas",
  templateUrl: "./selection-canvas.component.html",
  styleUrls: ["./selection-canvas.component.scss"]
})
export class SelectionCanvasComponent implements OnInit {
  selected = false;
  x: -1;
  y: -1;
  w: -1;
  h: -1;
  state = "hi";
  rectList;

  constructor() {
    this.onSelected = this.onSelected.bind(this);
  }

  receiveFromChild($event) {
    this.rectList = $event.rectList;
    this.onSelected = $event.onSelected;
  }

  onSelected(rect) {
    if (!rect.w && !rect.h) {
      return;
    }
    this.selected = true;
    this.x = rect.x;
    this.y = rect.y;
    this.w = rect.w;
    this.h = rect.h;

    //this.onSelect(rect);
  }

  getSelectionStr() {
    if (this.selected) {
      const state = this.state;
      return `x: ${state.x}, y: ${state.y}, w: ${state.w}, h: ${state.h}`;
    }
    return "No Selection";
  }

  ngOnInit() {}
}
