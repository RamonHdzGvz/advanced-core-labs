import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Navbar } from "@shared/organisms/navbar/navbar";
import { Footer } from "@shared/organisms/footer/footer";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-acl-main-layout",
  imports: [RouterOutlet, Navbar, Footer, ToastModule],
  templateUrl: "./acl-main-layout.html",
  styleUrl: "./acl-main-layout.css",
})
export class ACLMainLayout {}
