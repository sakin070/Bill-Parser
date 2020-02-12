import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-config-table",
  templateUrl: "./config-table.component.html"
})
export class ConfigTableComponent implements OnInit {
  lst = [{ name: "", location: "" }];
  constructor() {}

  ngOnInit() {}
}
