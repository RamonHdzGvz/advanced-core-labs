import { Component, Input } from "@angular/core";

export type ServiceIconName = "web" | "mobile" | "cloud";

@Component({
  selector: "app-service-icon",
  standalone: true,
  template: `
    @switch (name) {
      @case ("web") {
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <rect x="3" y="4" width="18" height="14" rx="2" stroke-width="2" />
          <path stroke-linecap="round" stroke-width="2" d="M8 21h8M12 18v3" />
        </svg>
      }
      @case ("mobile") {
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <rect x="7" y="2" width="10" height="20" rx="2" stroke-width="2" />
          <path stroke-linecap="round" stroke-width="2" d="M11 18h2" />
        </svg>
      }
      @case ("cloud") {
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 18a5 5 0 010-10 6 6 0 0111.6 1.5A4.5 4.5 0 0118.5 18H7z" />
        </svg>
      }
    }
  `,
})
export class ServiceIcon {
  @Input({ required: true }) name!: ServiceIconName;
}
