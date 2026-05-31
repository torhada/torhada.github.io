---
name: Refined Minimalism
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#214ae2'
  on-secondary: '#ffffff'
  secondary-container: '#4365fb'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#dee1ff'
  secondary-fixed-dim: '#b9c3ff'
  on-secondary-fixed: '#001257'
  on-secondary-fixed-variant: '#0033c2'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '600'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-desktop: 64px
  margin-mobile: 24px
  gutter: 24px
  stack-xl: 128px
  stack-lg: 80px
  stack-md: 40px
  stack-sm: 16px
---

## Brand & Style
The brand personality is architectural, precise, and authoritative. It targets high-end creative professionals and technology studios who value clarity over decoration. The UI must evoke a sense of "quiet confidence"—where the work is the focus, and the interface serves as a sophisticated, nearly invisible frame.

The design style is **Minimalism** infused with **Corporate/Modern** precision. It utilizes heavy whitespace to create a gallery-like atmosphere, high-contrast typography for hierarchy, and a restricted palette to eliminate cognitive load. Every element on the screen must serve a functional purpose; if a component does not contribute to the clarity of the message, it is removed.

## Colors
This design system utilizes a high-contrast, cool-toned palette. The background is a crisp, cool gray (`#F8F9FA`) to provide a clinical, studio-like environment that feels more modern than traditional paper-white or cream. 

- **Primary:** Pure black (`#000000`) is used for primary text, borders, and structural icons to maintain a sharp, graphic quality.
- **Accent:** A vibrant Cobalt Blue (`#2F54EB`) is used with extreme restraint. It is reserved exclusively for primary calls to action or active states to ensure it retains its visual impact.
- **Surface:** Subtle variations of cool gray are used for secondary containers to provide depth without breaking the minimalist aesthetic.

## Typography
The typography strategy relies on the tension between a high-contrast, technical sans-serif (**Geist**) and a functional, precise monospaced font (**JetBrains Mono**). 

Large display titles should use negative letter-spacing to create a "tight" architectural feel. **Inter** is utilized for body copy to ensure maximum readability in dense descriptions. **JetBrains Mono** is reserved for metadata, labels, and small UI hints, reinforcing the "high-end tech" and "studio" narrative. All headings should be set in optical sizing if available, favoring a heavier weight for impact against the light background.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy to maintain a structured, editorial feel. 
- **Desktop:** A 12-column grid with a maximum content width of 1440px. Large 64px outer margins create a "frame" for the content.
- **Mobile:** A 4-column grid with 24px margins. 

Vertical rhythm is driven by generous "stacks." Significant sections are separated by `stack-xl` (128px) to allow the work to breathe. Elements are never crowded; if two items feel close, double the white space. Alignment is strictly mathematical—use hard edges and clear vertical lines to guide the eye.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layers** and **Low-contrast outlines** rather than shadows. 

Avoid using ambient shadows entirely. To separate elements, use 1px solid borders in a light-gray (`#E9ECEF`) or subtle background shifts. For modals or overlays, use a crisp 1px black border to define the edge. If visual separation is required for a floating element, use a very tight, 2px "sticker" shadow (0px offset, 2px blur, 5% opacity) or simply rely on the contrast between the surface color and the base background.

## Shapes
The shape language is sharp and geometric. We use a "Soft" (`0.25rem`) radius for standard components like buttons and input fields to prevent the UI from feeling aggressive, while larger cards and containers should remain even sharper or use `0px` radius (Sharp) for an architectural look. 

Buttons should never be pill-shaped. Maintain a rectangular silhouette to reinforce the grid-based, professional structure of the portfolio.

## Components
- **Buttons:** Primary buttons are solid Black with White text. Secondary buttons are 1px Black outlines with no fill. Interaction states involve a slight background shift to the accent Blue only for the primary action.
- **Input Fields:** Bottom-border only or a 1px light gray outline. Labels must use the Monospaced font (`label-sm`) placed above the field.
- **Chips/Tags:** Rectangular with a 1px border. Use `label-sm` typography. No background fill unless active.
- **Cards:** No shadows. Use a 1px border or a slightly different surface color. Images within cards should have a 0px radius to emphasize the "gallery" aesthetic.
- **Lists:** Separated by thin, 1px horizontal lines that span the full width of the container. 
- **Navigation:** Minimalist text links in the header using `label-md`. The active state is indicated by a simple 1px underline or a small leading dot in the accent color.