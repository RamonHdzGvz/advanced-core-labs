import { Component, Input } from "@angular/core";

@Component({
  selector: "app-technology-card",
  standalone: true,
  templateUrl: "./technology-card.html",
})
export class TechnologyCard {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) icon!: string;
}
