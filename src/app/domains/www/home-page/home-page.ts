import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SolutionCard } from "@shared/molecules/solution-card/solution-card";
import { TechnologyCard } from "@shared/molecules/technology-card/technology-card";
import { HeroVisual } from "@shared/molecules/hero-visual/hero-visual";

interface Technology {
  name: string;
  icon: string;
}

interface Service {
  title: string;
  description: string;
  icon: "web" | "mobile" | "cloud";
}

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [RouterLink, SolutionCard, TechnologyCard, HeroVisual],
  templateUrl: "./home-page.html",
})
export class HomePage {
  readonly technologies: Technology[] = [
    { name: "Angular", icon: "/assets/images/angular-icon.svg" },
    { name: "AWS", icon: "/assets/images/aws-icon.svg" },
    { name: "Cloudinary", icon: "/assets/images/cloudinary-icon.svg" },
    { name: "Flutter", icon: "/assets/images/flutter-icon.svg" },
    { name: "GitHub", icon: "/assets/images/github-white-icon.svg" },
    { name: "Kotlin", icon: "/assets/images/kotlin-icon.svg" },
    { name: "Netlify", icon: "/assets/images/netlify-icon.svg" },
    { name: "Supabase", icon: "/assets/images/supabase-icon.svg" },
    { name: "Tailwind CSS", icon: "/assets/images/tailwind-css-icon.svg" },
    { name: "TypeScript", icon: "/assets/images/typescript-icon.svg" },
  ];

  readonly process = [
    {
      number: "01",
      title: "Entendemos el reto",
      description: "Alineamos objetivos, usuarios y restricciones para definir qué necesita resolver el producto.",
    },
    {
      number: "02",
      title: "Diseñamos la solución",
      description: "Acordamos el alcance y la arquitectura que mejor se ajustan al contexto y al presupuesto.",
    },
    {
      number: "03",
      title: "Construimos y mejoramos",
      description: "Entregamos en pasos claros y evolucionamos el producto con atención a calidad y rendimiento.",
    },
  ];

  readonly services: Service[] = [
    {
      title: "Desarrollo Web",
      description: "Aplicaciones modernas, rápidas y escalables con Angular.",
      icon: "web",
    },
    {
      title: "Desarrollo Móvil",
      description: "Experiencias nativas y multiplataforma con Flutter.",
      icon: "mobile",
    },
    {
      title: "Infraestructura Inteligente",
      description: "Soluciones en la nube con Supabase y optimización de costos.",
      icon: "cloud",
    },
  ];
}
