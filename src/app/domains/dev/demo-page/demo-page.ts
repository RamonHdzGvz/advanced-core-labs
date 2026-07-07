import { Component } from "@angular/core";
import { FacebookWidget } from "@shared/organisms/facebook-widget/facebook-widget";

@Component({
  selector: "app-demo-page",
  imports: [FacebookWidget],
  standalone: true,
  templateUrl: "./demo-page.html",
})
export class DemoPage {}
