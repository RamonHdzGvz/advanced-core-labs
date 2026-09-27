import { Component } from "@angular/core";
import { CardModule } from "primeng/card";
import { ACLBrandLogoComponent } from "@shared/atoms/acl-brand-logo/acl-brand-logo.component";

@Component({
  selector: "app-logo-page",
  imports: [ACLBrandLogoComponent, CardModule],
  standalone: true,
  templateUrl: "./logo-page.html",
  styleUrl: "./logo-page.css",
})
export class LogoPage {}
