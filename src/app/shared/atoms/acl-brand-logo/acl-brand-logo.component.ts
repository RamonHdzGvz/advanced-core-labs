import { Component, Input, computed } from "@angular/core";

export type LogoVariant = "light" | "dark";
export type LogoSize = "sm" | "md" | "lg" | "responsive";

@Component({
  selector: "app-acl-brand-logo",
  standalone: true,
  templateUrl: "./acl-brand-logo.component.html",
  styleUrls: ["./acl-brand-logo.component.css"],
})
export class ACLBrandLogoComponent {
  @Input() variant: LogoVariant = "dark";
  @Input() size: LogoSize = "md";

  readonly isDark = computed(() => this.variant === "dark");

  readonly sizeClass = computed(() => {
    switch (this.size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-xl";
      case "lg":
        return "text-3xl";
      case "responsive":
        return "text-[clamp(1.125rem,3vw,1.875rem)]";
    }
  });
}
