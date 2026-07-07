import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { environment } from "@environment";
import { ACLBrandLogoComponent } from "@shared/atoms/acl-brand-logo/acl-brand-logo.component";

@Component({
  selector: "app-testing-page",
  standalone: true,
  imports: [ButtonModule, CardModule, ACLBrandLogoComponent],
  templateUrl: "./testing-page.html",
})
export class TestingPage {
  versions = {
    angular: "20.3.x",
    cli: "20.3.13",
    typescript: "5.9.x",
    vitest: "3.x",
    primeng: "20.x",
    tailwind: "4.x",
    rxjs: "7.8.x",
  };

  appMode = environment.appMode;
  appVersion = environment.appVersion;

  onPrimeClick() {
    alert("PrimeNG está funcionando correctamente 🚀");
  }
}
