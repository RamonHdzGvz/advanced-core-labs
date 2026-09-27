import { Component, Input } from "@angular/core";

@Component({
  selector: "app-hero-visual",
  standalone: true,
  templateUrl: "./hero-visual.html",
  styleUrl: "./hero-visual.css",
})
export class HeroVisual {
  @Input({ required: true }) imageSrc!: string;
  @Input() size: "large" | "medium" = "large";
  @Input() showGrid = false;
}
