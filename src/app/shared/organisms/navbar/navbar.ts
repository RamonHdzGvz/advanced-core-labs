import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter, Subscription } from "rxjs";
import { ACLBrandLogoComponent } from "@shared/atoms/acl-brand-logo/acl-brand-logo.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ACLBrandLogoComponent, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: "./navbar.css",
})
export class Navbar implements OnInit, AfterViewInit, OnDestroy {
  isOpen = false;
  activeSection = "inicio";

  private sectionObserver?: IntersectionObserver;
  private navigationSubscription?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.navigationSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.handleNavigation(event.urlAfterRedirects));

    this.handleNavigation(this.router.url);
  }

  ngAfterViewInit(): void {
    this.observeHomeSections();
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
    this.sectionObserver?.disconnect();
  }

  selectSection(section: string): void {
    this.activeSection = section;
    this.isOpen = false;
  }

  private handleNavigation(url: string): void {
    const tree = this.router.parseUrl(url);
    const path = tree.root.children["primary"]?.segments.map((segment) => segment.path).join("/") ?? "";

    this.activeSection = path === "soluciones" ? "soluciones" : tree.fragment || "inicio";
    this.isOpen = false;

    if (path !== "soluciones") {
      requestAnimationFrame(() => this.observeHomeSections());
    } else {
      this.sectionObserver?.disconnect();
    }
  }

  private observeHomeSections(): void {
    if (typeof IntersectionObserver === "undefined" || this.router.url.startsWith("/soluciones")) {
      return;
    }

    this.sectionObserver?.disconnect();
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const visibleSection = visibleSections[0];
        if (visibleSection) {
          this.zone.run(() => {
            this.activeSection = visibleSection.target.id;
          });
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const section of document.querySelectorAll<HTMLElement>("#inicio, #soluciones, #tecnologia, #nosotros, #contacto")) {
      this.sectionObserver.observe(section);
    }
  }
}
