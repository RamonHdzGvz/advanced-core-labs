import { Component, AfterViewInit, ElementRef, Renderer2, Input } from '@angular/core';

@Component({
  selector: 'app-facebook-widget',
  standalone: true,
  templateUrl: './facebook-widget.html',
  styleUrls: ['./facebook-widget.css']
})
export class FacebookWidget implements AfterViewInit {
  @Input() widgetId = '313846';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    const script = this.renderer.createElement('script');
    script.src = 'https://widget.tagembed.com/embed.min.js';
    script.type = 'text/javascript';
    this.renderer.appendChild(this.el.nativeElement, script);
  }
}
