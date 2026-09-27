import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ServiceIcon, ServiceIconName } from "@shared/atoms/service-icon/service-icon";

@Component({
  selector: "app-solution-card",
  standalone: true,
  imports: [ServiceIcon, RouterLink],
  styleUrl: "./solution-card.css",
  template: `
    <article
      class="group flex h-full min-h-[180px] flex-col gap-4 rounded-2xl border border-[var(--acl-border)] bg-[var(--acl-surface)]/60 p-6 transition duration-200 hover:-translate-y-1 hover:border-acl-primary/60 hover:shadow-acl-hover sm:flex-row sm:gap-5 sm:p-6">
      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-acl-primary ring-1 ring-cyan-400/10 sm:h-20 sm:w-20">
        <app-service-icon [name]="icon" />
      </div>
      <div class="flex min-w-0 flex-1 flex-col">
        <h3 class="text-base font-semibold text-white">{{ title }}</h3>
        <p class="solution-description mt-2 flex-1 text-sm leading-5 text-[var(--acl-muted)]">{{ description }}</p>
        <a
          [routerLink]="route"
          [fragment]="fragment"
          class="mt-auto inline-flex text-2xl leading-none text-acl-primary transition-transform group-hover:translate-x-1"
          [attr.aria-label]="'Conoce más sobre ' + title"
          >→</a
        >
      </div>
    </article>
  `,
})
export class SolutionCard {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) icon!: ServiceIconName;
  @Input() route = "/soluciones";
  @Input() fragment?: string;
}
