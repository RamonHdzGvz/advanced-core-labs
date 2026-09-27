import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SolutionCardFull } from "@shared/molecules/solution-card-full/solution-card-full";
import { HeroVisual } from "@shared/molecules/hero-visual/hero-visual";

interface Solution {
  title: string;
  description: string;
  icon: "web" | "mobile" | "cloud";
  features: string[];
}

@Component({
  selector: "app-solutions-page",
  standalone: true,
  imports: [RouterLink, SolutionCardFull, HeroVisual],
  templateUrl: "./solutions-page.html",
})
export class SolutionsPage {
  readonly solutions: Solution[] = [
    {
      title: "Desarrollo Web",
      description: "Aplicaciones web modernas, rápidas y escalables, diseñadas alrededor de tus procesos y usuarios.",
      icon: "web",
      features: ["Aplicaciones a medida", "Arquitectura modular", "Interfaces modernas", "Integraciones y APIs"],
    },
    {
      title: "Desarrollo Móvil",
      description: "Experiencias móviles multiplataforma con Flutter, desde el primer prototipo hasta producción.",
      icon: "mobile",
      features: ["Experiencias multiplataforma", "Rendimiento y experiencia de usuario", "Integración con servicios", "Preparación para App Store y Play Store"],
    },
    {
      title: "Infraestructura & Backend",
      description: "APIs, autenticación, almacenamiento e infraestructura cloud con Supabase y enfoque en costos.",
      icon: "cloud",
      features: ["Base de datos y autenticación", "Almacenamiento de archivos", "APIs y Edge Functions", "Optimización de costos"],
    },
  ];

  readonly additionalServices = [
    "Integraciones y APIs",
    "Consultoría técnica",
    "Mantenimiento y soporte",
    "Optimización de sistemas",
  ];
}
