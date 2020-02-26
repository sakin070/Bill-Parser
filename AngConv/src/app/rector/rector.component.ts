// tslint:disable-next-line: quotemark
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";

@Component({
  selector: "rector",
  templateUrl: "./rector.component.html"
})
export class RectorComponent implements OnInit {
  ctx = null;
  isDirty = false;
  isDrag = false;
  startX = -1;
  startY = -1;
  curX = -1;
  curY = -1;
  image = new Image();
  imagePath = String();

  @ViewChild("canvas", { static: true }) canvas: ElementRef;
  @Input() width = 720;
  @Input() height = 1280;
  @Input() strokeStyle = "#F00";
  @Input() lineWidth = 1;
  @Input() onSelected: {};
  @Input() rectList = [];

  @Output() rectListEvent = new EventEmitter<any>();

  constructor() {
    this.imagePath = "../../assets/test.png";
  }

  sendToParent() {
    this.rectListEvent.emit(this.onSelected);
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.image.src = this.imagePath;
    this.image.addEventListener(
      "load",
      () => this.ctx.drawImage(this.image, 0, 0, this.width, this.height),
      false
    );
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.addMouseEvents();
  }

  updateCanvas = () => {
    // this.draw()
    if (this.isDrag) {
      requestAnimationFrame(this.updateCanvas);
    }
    if (!this.isDirty) {
      return;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
    if (this.isDrag) {
      const rect = {
        x: this.startX,
        y: this.startY,
        w: this.curX - this.startX,
        h: this.curY - this.startY
      };
      this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    }
    this.isDirty = false;
    this.ctx.strokeRect(this.onSelected.x, this.onSelected.y, this.onSelected.w, this.onSelected.h);
    for (let i = 0; i < this.rectList.length; i++) {
      const rect = this.rectList[i];
      this.ctx.strokeRect(rect["x"], rect["y"], rect["w"], rect["h"]);
    }
  };

  addMouseEvents() {
    document.addEventListener("mousedown", this.onMouseDown, false);
    document.addEventListener("mousemove", this.onMouseMove, false);
    document.addEventListener("mouseup", this.onMouseUp, false);
  }

  removeMouseEvents() {
    document.removeEventListener("mousedown", this.onMouseDown, false);
    document.removeEventListener("mousemove", this.onMouseMove, false);
    document.removeEventListener("mouseup", this.onMouseUp, false);
  }

  onMouseDown = e => {
    this.isDrag = true;
    this.curX = this.startX = e.offsetX;
    this.curY = this.startY = e.offsetY;
    requestAnimationFrame(this.updateCanvas);
  };

  onMouseMove = e => {
    if (!this.isDrag) {
      return;
    }
    this.curX = e.offsetX;
    this.curY = e.offsetY;
    this.isDirty = true;
  };

  onMouseUp = e => {
    this.isDrag = false;
    this.isDirty = true;
    const rect = {
      x: Math.min(this.startX, this.curX),
      y: Math.min(this.startY, this.curY),
      w: Math.abs(e.offsetX - this.startX),
      h: Math.abs(e.offsetY - this.startY)
    };
    this.onSelected = rect;
    this.sendToParent();
  };
}
