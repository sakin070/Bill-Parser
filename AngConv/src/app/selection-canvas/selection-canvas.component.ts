import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-selection-canvas",
  templateUrl: "./selection-canvas.component.html",
  styleUrls: ["./selection-canvas.component.css"]
})
export class SelectionCanvasComponent implements OnInit {
  selected = false;
  x: -1;
  y: -1;
  w: -1;
  h: -1;

  constructor() {
    this.onSelected = this.onSelected.bind(this);
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

    this.onSelect(rect);
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
