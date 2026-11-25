import { Component, Input } from '@angular/core';
import { ThemeAvatarComponent } from '@shared/atoms/theme-avatar/theme-avatar';

@Component({
  selector: 'app-theme-hero',
  standalone: true,
  imports: [ThemeAvatarComponent],
  templateUrl: './theme-hero.html',
})
export class ThemeHeroComponent {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
  @Input() primaryActionLabel = '';
  @Input() primaryActionHref = '';
  @Input() secondaryActionLabel = '';
  @Input() secondaryActionHref = '';
}
