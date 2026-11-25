# AdvancedCoreLabs — Design System

**Version:** 1.0  
**Status:** Initial Brand Design System  
**Brand:** AdvancedCoreLabs  
**Design philosophy:** Modern · Clean · Technical · Scalable

---

# 1. Design Philosophy

AdvancedCoreLabs is a technology brand focused on building modern, scalable and sustainable digital solutions.

Its visual identity communicates:

- Technical excellence.
- Innovation and precision.
- Reliability and stability.
- Simplicity and clarity.
- Modern engineering.

The interface should feel professional without becoming visually heavy.

### Core principles

1. Clarity over decoration.
2. Consistency across all products.
3. Accessibility and readability.
4. Scalable and reusable design tokens.
5. Responsive by default.
6. Cost-efficient implementation.
7. One unified color scheme across all applications.

**Theme policy:** AdvancedCoreLabs uses one fixed color scheme. Dynamic theme switching and alternative light/dark themes are not supported.

---

# 2. Brand Identity

## 2.1 Official Brand Colors

These colors are immutable brand assets. Their HEX values must never be modified.

| Name | HEX | RGB | Primary usage |
|---|---|---|---|
| Midnight Harbor | `#0B3658` | 11, 54, 88 | Primary brand color |
| Turquoise Blue | `#00FFEF` | 0, 255, 239 | Brand accent |
| Brighto Paints | `#F7F6F8` | 247, 246, 248 | Neutral brand color |

### Midnight Harbor — Primary

The foundation of the AdvancedCoreLabs identity.

Usage:
- Primary navigation backgrounds.
- Primary text.
- Brand containers.
- Structural UI elements.
- Primary buttons.

### Turquoise Blue — Accent

The distinctive accent of the brand.

Usage:
- CoreLabs wordmark.
- Brand icon details.
- Active navigation indicators.
- Selected states.
- Small highlights and accents.

Avoid using large turquoise surfaces for ordinary content because of its high visual intensity.

### Brighto Paints — Neutral

The primary light neutral.

Usage:
- Main application background.
- Text on dark surfaces.
- Cards and content surfaces.
- Neutral interface areas.

---

## 2.2 Supporting UI Colors

Supporting colors are functional interface colors, not additional brand colors.

| Token | HEX | Usage |
|---|---|---|
| Slate Channel | `#486984` | Secondary text and muted elements |
| Pale Steel | `#688DAC` | Secondary icons and borders |
| Sea Fog | `#DDE7EE` | Soft borders and separators |
| Ice Tint | `#E6F1FA` | Subtle informational surfaces |
| Light Mist | `#C8D8E4` | Disabled surfaces and dividers |
| Canvas White | `#FFFFFF` | Elevated content surfaces |
| Success | `#15803D` | Success feedback |
| Warning | `#B45309` | Warning feedback |
| Error | `#DC2626` | Error feedback |
| Info | `#2563EB` | Informational feedback |

Supporting colors must never replace the three official brand colors.

---

# 3. Unified Color System

All applications use the same fixed visual scheme.

| Semantic token | Value |
|---|---|
| Background | `#F7F6F8` |
| Surface | `#FFFFFF` |
| Surface Secondary | `#E6F1FA` |
| Text Primary | `#0B3658` |
| Text Secondary | `#486984` |
| Border | `#DDE7EE` |
| Primary | `#0B3658` |
| Accent | `#00FFEF` |
| On Primary | `#F7F6F8` |
| On Accent | `#0B3658` |

### Color usage rules

- Use Brighto Paints as the default application background.
- Use Canvas White for cards and elevated surfaces.
- Use Midnight Harbor for headings, primary text and important controls.
- Use Turquoise Blue for accents and selected states.
- Use Ice Tint for subtle informational backgrounds.
- Use Sea Fog for borders and separators.

**Accessibility note:** Turquoise Blue is a high-luminance accent and should not be used as small text on Brighto Paints or white backgrounds. Use Midnight Harbor for readable text and reserve turquoise for accents, indicators and larger graphic elements.

There is no alternate theme palette.

---

# 4. Typography

## 4.1 Font Families

### Figtree — Primary UI Typeface

Used throughout the application interface.

Recommended weights:

| Weight | Usage |
|---|---|
| 400 | Body text |
| 500 | Secondary emphasis |
| 600 | Buttons, labels and navigation |
| 700 | Headings and important values |
| 800 | Large display headings |

### Source Sans 3 — Brand Wordmark

Used exclusively for the AdvancedCoreLabs logo typography.

Recommended weight: 700.

The wordmark must remain visually consistent across products.

## 4.2 Type Scale

| Token | Size | Usage |
|---|---:|---|
| Display | 48px | Landing page hero |
| H1 | 36px | Main page heading |
| H2 | 30px | Major sections |
| H3 | 24px | Subsections |
| H4 | 20px | Card headings |
| Body Large | 18px | Introductory content |
| Body | 16px | Standard content |
| Body Small | 14px | Supporting text |
| Caption | 12px | Metadata |

Recommended line heights:

- Headings: 1.15–1.25.
- Body: 1.5.
- Captions: 1.4.

---

# 5. Spacing System

Use a consistent 4px spacing scale.

| Token | Value |
|---|---:|
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 8 | 32px |
| 10 | 40px |
| 12 | 48px |
| 16 | 64px |
| 20 | 80px |

Prefer consistent spacing over arbitrary values.

---

# 6. Shape and Geometry

AdvancedCoreLabs uses soft geometry with controlled corner radii.

| Token | Value | Usage |
|---|---:|---|
| Radius XS | 4px | Small indicators |
| Radius SM | 8px | Inputs and compact elements |
| Radius MD | 12px | Buttons and standard cards |
| Radius LG | 20px | Large cards and panels |
| Radius XL | 24px | Hero sections and containers |
| Radius Full | 9999px | Pills and circular controls |

Use rounded corners consistently. Avoid excessive pill-shaped elements.

---

# 7. Shadows and Elevation

The interface should use subtle, cool-toned shadows.

| Level | Shadow | Usage |
|---|---|---|
| 0 | None | Flat surfaces |
| 1 | `0 2px 8px rgba(11,54,88,.06)` | Cards |
| 2 | `0 4px 16px rgba(11,54,88,.10)` | Dropdowns |
| 3 | `0 8px 24px rgba(11,54,88,.14)` | Modals |
| 4 | `0 12px 32px rgba(11,54,88,.18)` | Floating panels |

Avoid excessive shadows, text shadows, gradients and glow effects.

---

# 8. Logo System

## 8.1 Official Logo

The original AdvancedCoreLabs icon is the official brand symbol.

Source asset:

`src/assets/images/logo-classic.png`

The original icon must not be redrawn, stretched, recolored or distorted.

## 8.2 Wordmark

The wordmark uses two distinct colors:

- Advanced: Brighto Paints `#F7F6F8`.
- CoreLabs: Turquoise Blue `#00FFEF`.

Typography: Source Sans 3, weight 700.

## 8.3 Primary Navbar Composition

The approved navbar brand composition consists of:

1. A solid Midnight Harbor brand block.
2. The original icon positioned to the left.
3. The AdvancedCoreLabs wordmark positioned to the right.
4. A Turquoise Blue diagonal separator.
5. A second Midnight Harbor diagonal separator.
6. A Brighto Paints navigation area following the separators.

No gradients, strokes, glow effects or text shadows.

The logo composition must remain visually consistent throughout the application.

## 8.4 Logo Variants

Recommended variants:

- Full horizontal logo.
- Compact icon-only logo.
- Navbar logo.
- Mobile logo.
- Splash screen logo.

Do not create independent interpretations of the official symbol.

---

# 9. Navigation

## 9.1 Navbar

The primary navigation uses:

- Midnight Harbor brand block.
- Original logo and wordmark.
- Turquoise and Midnight Harbor diagonal separators.
- Brighto Paints or Canvas White navigation surface.
- Midnight Harbor navigation text.
- Turquoise active-state indicator.

Recommended height:

- Desktop: 72–88px.
- Tablet: 64–72px.
- Mobile: 56–64px.

Navigation links should use Figtree 600.

## 9.2 Active States

Preferred active-state indicators:

- Turquoise underline.
- Turquoise subtle background.
- Midnight Harbor text.

Avoid using turquoise as small text over light surfaces.

---

# 10. Buttons

## Primary Button

- Background: Midnight Harbor.
- Text: Brighto Paints.
- Hover: Slightly lighter navy supporting surface.
- Radius: 12px.
- Font weight: 600.

## Secondary Button

- Background: Transparent.
- Text: Midnight Harbor.
- Border: Midnight Harbor.
- Hover: Ice Tint background.

## Accent Button

- Background: Turquoise Blue.
- Text: Midnight Harbor.
- Hover: Use a restrained interaction effect.
- Radius: 12px.

## Ghost Button

- Background: Transparent.
- Text: Midnight Harbor.
- No visible border.
- Hover: Ice Tint.

Recommended minimum height: 40px.

---

# 11. Forms and Inputs

Inputs should be clean and unobtrusive.

Recommended properties:

- Height: 44px.
- Border radius: 8px.
- Border: Sea Fog.
- Text: Midnight Harbor.
- Placeholder: Slate Channel.
- Background: Canvas White.

Focus state:

- Border: Midnight Harbor.
- Visible focus ring.
- Avoid relying exclusively on color to communicate focus.

Error state:

- Border: Error.
- Supporting error message.
- Accessible error description.

Disabled state:

- Reduced contrast.
- Non-interactive cursor.
- Clear visual indication.

---

# 12. Cards and Containers

Cards should prioritize content hierarchy.

Recommended defaults:

- Background: Canvas White.
- Border: Sea Fog.
- Radius: 20px.
- Padding: 24px.
- Shadow: Level 1.

Use Surface Secondary for grouped or informational areas.

Avoid excessive borders and decorative elements.

---

# 13. Icons

Use a consistent icon family throughout the interface.

Recommended: Lucide Icons.

Guidelines:

- Default size: 20px.
- Compact size: 16px.
- Large size: 24px.
- Stroke width: 1.75–2px.
- Primary icon color: Midnight Harbor.
- Accent icon color: Turquoise Blue.

Do not mix multiple icon families within the same product unless necessary.

---

# 14. Responsive Design

Use mobile-first implementation.

| Breakpoint | Width |
|---|---:|
| Mobile | 640px |
| Tablet | 768px |
| Desktop | 1024px |
| Large Desktop | 1280px |
| Wide Desktop | 1536px |

Recommended content widths:

- Standard application content: 1200px.
- Wide dashboards: 1440px.
- Reading-oriented content: 800px.

On mobile:

- Collapse desktop navigation into a menu.
- Use compact logo variants where appropriate.
- Preserve minimum touch target sizes of 44px.
- Avoid horizontal overflow.

---

# 15. Angular + TailwindCSS Implementation

Angular is the primary web implementation framework.

TailwindCSS 4 is the preferred styling system.

## 15.1 Design Tokens

Expose the core palette through Tailwind's theme configuration.

Example `styles.css`:

```css
@import "tailwindcss";

@theme {
  --color-midnight-harbor: #0B3658;
  --color-turquoise-blue: #00FFEF;
  --color-brighto-paints: #F7F6F8;

  --color-slate-channel: #486984;
  --color-pale-steel: #688DAC;
  --color-sea-fog: #DDE7EE;
  --color-ice-tint: #E6F1FA;
  --color-light-mist: #C8D8E4;

  --font-sans: "Figtree", sans-serif;
  --font-brand: "Source Sans 3", sans-serif;
}
```

Example usage:

```html
<div class="bg-brighto-paints text-midnight-harbor">
  <h1 class="font-sans text-3xl font-bold">
    AdvancedCoreLabs
  </h1>
</div>
```

Prefer Tailwind utilities for component styling.

Avoid creating custom CSS when an existing utility can achieve the same result.

Custom CSS is acceptable for complex geometric shapes, animations or cases where utilities become unnecessarily complicated.

## 15.2 Theme Architecture

There is no theme-switching architecture.

Do not implement:

- Light/Dark theme state.
- Theme toggle controls.
- Theme preference persistence.
- Runtime color palette switching.
- Separate theme configurations.

All components consume the same centralized design tokens.

---

# 16. Flutter Implementation

The same semantic tokens must be exposed through a centralized Flutter theme.

Recommended structure:

- `AppColors`
- `AppTypography`
- `AppSpacing`
- `AppRadius`
- `AppShadows`
- `AppTheme`

Use a single fixed `ThemeData` configuration.

Do not implement dynamic theme switching or duplicate color values across individual widgets.

Use the same official HEX values and semantic meanings as the web implementation.

---

# 17. Accessibility

Accessibility is a fundamental requirement.

Guidelines:

- Follow WCAG 2.2 AA contrast requirements.
- Never communicate state using color alone.
- Provide visible keyboard focus.
- Maintain readable font sizes.
- Support keyboard navigation.
- Provide accessible labels for interactive icons.
- Use semantic HTML elements.
- Respect reduced-motion preferences.

Important color consideration:

Turquoise Blue `#00FFEF` is not suitable for ordinary small text on Brighto Paints or white surfaces. Use Midnight Harbor text instead.

---

# 18. Motion and Interaction

Motion should be subtle and purposeful.

Recommended durations:

| Interaction | Duration |
|---|---:|
| Hover | 150ms |
| Button feedback | 150ms |
| Dropdown | 180ms |
| Modal | 200ms |
| Page transitions | 200–250ms |

Preferred easing:

`cubic-bezier(0.2, 0, 0, 1)`

Avoid unnecessary animation and continuous motion.

---

# 19. Design Governance

The AdvancedCoreLabs Design System is the shared visual foundation for all products.

### Rules

1. Official brand colors must never be modified.
2. Components should consume centralized tokens.
3. New colors must be classified as brand or functional UI colors.
4. New components should follow existing spacing, typography and radius scales.
5. Angular and Flutter implementations must remain visually aligned.
6. Avoid unnecessary dependencies for styling.
7. Accessibility must be considered during component development.
8. Visual changes affecting the brand should be reviewed before implementation.
9. All products must use the same fixed color scheme.
10. Theme switching is not part of the product architecture.

---

# 20. Final Brand Reference

| Property | Official value |
|---|---|
| Brand Primary | Midnight Harbor `#0B3658` |
| Brand Accent | Turquoise Blue `#00FFEF` |
| Brand Neutral | Brighto Paints `#F7F6F8` |
| UI Typeface | Figtree |
| Brand Typeface | Source Sans 3 |
| Icon Family | Lucide |
| Web Framework | Angular |
| Styling | TailwindCSS 4 |
| Mobile Framework | Flutter |
| Color Scheme | Single fixed scheme |
| Design Philosophy | Clean, modern, technical and scalable |

**AdvancedCoreLabs Design System — Version 1.0**

A consistent visual foundation for building modern, accessible and scalable digital products.