import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ServiceIcon, ServiceIconName } from "@shared/atoms/service-icon/service-icon";

@Component({
  selector: "app-solution-card-full",
  standalone: true,
  imports: [ServiceIcon, RouterLink],
  template: `
    <article class="flex h-full flex-col rounded-2xl border border-[var(--acl-border)] bg-[var(--acl-surface)]/60 p-5 transition duration-200 hover:-translate-y-1 hover:border-acl-primary/60 hover:shadow-acl-hover sm:p-6">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-acl-primary ring-1 ring-cyan-400/10">
        <app-service-icon [name]="icon" />
      </div>
      <h3 class="mt-4 text-lg font-semibold text-white">{{ title }}</h3>
      <p class="mt-2 text-sm leading-5 text-[var(--acl-muted)]">{{ description }}</p>
      <ul class="mt-5 space-y-2.5">
        @for (feature of features; track feature) {
          <li class="flex items-start gap-2.5 text-sm leading-5 text-slate-200">
            <span class="mt-0.5 shrink-0 font-semibold text-acl-primary" aria-hidden="true">✓</span>
            <span>{{ feature }}</span>
          </li>
        }
      </ul>
      <a [routerLink]="route" [fragment]="fragment" class="mt-6 inline-flex w-fit items-center gap-3 rounded-lg bg-acl-primary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-acl-primary-hover">
        Conoce más <span aria-hidden="true">→</span>
      </a>
    </article>
  `,
})
export class SolutionCardFull {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) icon!: ServiceIconName;
  @Input({ required: true }) features!: string[];
  @Input() route = "/";
  @Input() fragment = "contacto";
}
