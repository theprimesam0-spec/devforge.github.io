# Styling & Design System

<cite>
**Referenced Files in This Document**
- [global.css](file://src/styles/global.css)
- [package.json](file://package.json)
- [vite.config.ts](file://vite.config.ts)
- [MenuBar.tsx](file://src/components/layout/MenuBar.tsx)
- [Hero.tsx](file://src/components/home/Hero.tsx)
- [AdminDashboard.tsx](file://src/components/admin/AdminDashboard.tsx)
- [LockedOverlay.tsx](file://src/components/auth/LockedOverlay.tsx)
- [ServiceCard.tsx](file://src/components/home/ServiceCard.tsx)
- [ServicesGrid.tsx](file://src/components/home/ServicesGrid.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes DevForge’s visual presentation layer and design system. It covers the Tailwind CSS integration, custom CSS architecture, glass morphism patterns, neon glow effects, typography, animations, responsive design, and component styling conventions. It also provides guidance for extending the design system, maintaining visual consistency, optimizing CSS delivery, and ensuring accessibility.

## Project Structure
DevForge integrates Tailwind via Vite and centralizes global styles and design tokens in a single stylesheet. Components apply design tokens and utility classes consistently across the app.

```mermaid
graph TB
Vite["Vite Config<br/>vite.config.ts"] --> Plugins["Plugins<br/>react(), @tailwindcss/vite"]
Plugins --> Tailwind["Tailwind CSS Runtime"]
Tailwind --> GlobalCSS["Global Styles<br/>src/styles/global.css"]
GlobalCSS --> Tokens["CSS Custom Properties<br/>:root"]
GlobalCSS --> Utilities["Utility Classes<br/>.glass-panel, .btn-*"]
GlobalCSS --> Animations["@keyframes + Classes"]
Components["React Components"] --> Tokens
Components --> Utilities
Components --> Animations
```

**Diagram sources**
- [vite.config.ts:1-22](file://vite.config.ts#L1-L22)
- [global.css:1-22](file://src/styles/global.css#L1-L22)

**Section sources**
- [vite.config.ts:1-22](file://vite.config.ts#L1-L22)
- [package.json:19-35](file://package.json#L19-L35)

## Core Components
- Tailwind integration: Installed and configured via Vite plugin.
- Global CSS: Centralizes design tokens, base resets, typography, glass morphism utilities, buttons, overlays, animations, and responsive rules.
- Component styling: Components consume design tokens and utility classes for consistent visuals.

Key highlights:
- Design tokens live in CSS custom properties for easy reuse and theming.
- Glass morphism utilities encapsulate backdrop blur, transparency, and borders.
- Button variants and hover states unify interactive affordances.
- Animations provide micro-interactions and loading states.
- Responsive rules adapt layouts for smaller screens.

**Section sources**
- [global.css:3-22](file://src/styles/global.css#L3-L22)
- [global.css:92-136](file://src/styles/global.css#L92-L136)
- [global.css:205-265](file://src/styles/global.css#L205-L265)
- [global.css:323-376](file://src/styles/global.css#L323-L376)
- [global.css:377-383](file://src/styles/global.css#L377-L383)

## Architecture Overview
The styling pipeline combines Tailwind utilities with global CSS for brand-specific tokens and patterns.

```mermaid
graph TB
subgraph "Build Layer"
ViteCfg["vite.config.ts"]
Pkg["package.json"]
end
subgraph "Runtime Layer"
TW["Tailwind Runtime"]
GCSS["global.css"]
end
subgraph "Components"
MB["MenuBar.tsx"]
HR["Hero.tsx"]
AD["AdminDashboard.tsx"]
SO["LockedOverlay.tsx"]
SC["ServiceCard.tsx"]
SG["ServicesGrid.tsx"]
end
ViteCfg --> TW
Pkg --> TW
TW --> GCSS
GCSS --> MB
GCSS --> HR
GCSS --> AD
GCSS --> SO
GCSS --> SC
GCSS --> SG
```

**Diagram sources**
- [vite.config.ts:1-22](file://vite.config.ts#L1-L22)
- [package.json:19-35](file://package.json#L19-L35)
- [global.css:1-22](file://src/styles/global.css#L1-L22)
- [MenuBar.tsx:28-44](file://src/components/layout/MenuBar.tsx#L28-L44)
- [Hero.tsx:16-24](file://src/components/home/Hero.tsx#L16-L24)
- [AdminDashboard.tsx:85-91](file://src/components/admin/AdminDashboard.tsx#L85-L91)
- [LockedOverlay.tsx:7-8](file://src/components/auth/LockedOverlay.tsx#L7-L8)
- [ServiceCard.tsx:31-35](file://src/components/home/ServiceCard.tsx#L31-L35)
- [ServicesGrid.tsx:119-127](file://src/components/home/ServicesGrid.tsx#L119-L127)

## Detailed Component Analysis

### Glass Morphism Pattern
Glass panels provide frosted, translucent surfaces with subtle borders and shadows. Two variants are defined:
- Standard glass panel with moderate blur and shadow.
- Strong glass panel with heavier blur and inset highlights.

Implementation pattern:
- Apply a background with low alpha, backdrop blur, border, rounded corners, and layered shadows.
- Hover states adjust background and border for interactivity.

```mermaid
classDiagram
class GlassPanel {
+background : "var(--glass-bg)"
+backdrop-filter : "blur(20px)"
+border : "1px solid var(--glass-border)"
+border-radius : "12px"
+box-shadow : "var(--card-shadow)"
+transition : "all 0.3s ease"
}
class GlassPanelHover {
+background : "var(--glass-bg-hover)"
+border-color : "var(--glass-border-hover)"
}
class GlassPanelStrong {
+background : "rgba(255,255,255,0.06)"
+backdrop-filter : "blur(30px)"
+border : "1px solid rgba(255,255,255,0.1)"
+box-shadow : "var(--card-shadow), inset 0 1px 0 rgba(255,255,255,0.05)"
}
```

**Diagram sources**
- [global.css:92-115](file://src/styles/global.css#L92-L115)

**Section sources**
- [global.css:92-115](file://src/styles/global.css#L92-L115)
- [MenuBar.tsx:28-44](file://src/components/layout/MenuBar.tsx#L28-L44)
- [ServiceCard.tsx:37-43](file://src/components/home/ServiceCard.tsx#L37-L43)
- [ServiceCard.tsx:107-113](file://src/components/home/ServiceCard.tsx#L107-L113)
- [AdminDashboard.tsx:85-91](file://src/components/admin/AdminDashboard.tsx#L85-L91)

### Neon Glow Effects
Neon accents use custom color tokens with soft glows to highlight interactive elements and headings.

Patterns:
- Text glow classes for brand colors.
- Border glow utilities for focus and hover states.

```mermaid
classDiagram
class NeonGreenText {
+color : "var(--neon-green)"
+text-shadow : "0 0 10px rgba(...), 0 0 30px rgba(...)"
}
class BrandBlueText {
+color : "var(--brand-blue)"
+text-shadow : "0 0 10px rgba(...), 0 0 30px rgba(...)"
}
class NeonBorderGreen {
+border-color : "rgba(57,255,20,0.3)"
+box-shadow : "var(--neon-glow)"
}
class NeonBorderBlue {
+border-color : "rgba(0,122,255,0.3)"
+box-shadow : "var(--blue-glow)"
}
```

**Diagram sources**
- [global.css:117-136](file://src/styles/global.css#L117-L136)

**Section sources**
- [global.css:117-136](file://src/styles/global.css#L117-L136)
- [Hero.tsx:60-67](file://src/components/home/Hero.tsx#L60-L67)
- [MenuBar.tsx:48-68](file://src/components/layout/MenuBar.tsx#L48-L68)

### Buttons and Interactions
Primary and secondary button styles unify CTAs with consistent spacing, typography, transitions, and hover effects.

Patterns:
- Gradient primary buttons with elevated hover and glow.
- Transparent secondary buttons with border and hover background.
- Disabled states maintain visual hierarchy without clutter.

```mermaid
classDiagram
class BtnPrimary {
+display : "inline-flex"
+align-items : "center"
+gap : "8px"
+padding : "12px 28px"
+background : "linear-gradient(...)"
+color : "#000"
+font-family : "var(--font-mono)"
+font-weight : "600"
+font-size : "14px"
+border : "none"
+border-radius : "8px"
+cursor : "pointer"
+transition : "all 0.3s ease"
+text-transform : "uppercase"
+letter-spacing : "0.5px"
}
class BtnSecondary {
+display : "inline-flex"
+align-items : "center"
+gap : "8px"
+padding : "12px 28px"
+background : "transparent"
+color : "var(--brand-blue)"
+font-family : "var(--font-mono)"
+font-weight : "600"
+font-size : "14px"
+border : "1px solid rgba(0,122,255,0.4)"
+border-radius : "8px"
+cursor : "pointer"
+transition : "all 0.3s ease"
+text-transform : "uppercase"
+letter-spacing : "0.5px"
}
```

**Diagram sources**
- [global.css:205-265](file://src/styles/global.css#L205-L265)

**Section sources**
- [global.css:205-265](file://src/styles/global.css#L205-L265)
- [Hero.tsx:88-104](file://src/components/home/Hero.tsx#L88-L104)
- [LockedOverlay.tsx:50-56](file://src/components/auth/LockedOverlay.tsx#L50-L56)

### Locked/Blurred Overlay
Members-only content uses a blurred overlay to communicate access restrictions while preserving layout.

Pattern:
- Parent container marks content locked.
- Overlay applies backdrop blur and centered content with CTA.

```mermaid
flowchart TD
Start(["Render Protected Area"]) --> Lock["Apply .locked-content"]
Lock --> Blur["Blur underlying content"]
Lock --> Overlay["Render .locked-overlay"]
Overlay --> CTA["Call-to-action button"]
CTA --> End(["User action or cancel"])
```

**Diagram sources**
- [global.css:267-289](file://src/styles/global.css#L267-L289)
- [LockedOverlay.tsx:3-59](file://src/components/auth/LockedOverlay.tsx#L3-L59)

**Section sources**
- [global.css:267-289](file://src/styles/global.css#L267-L289)
- [LockedOverlay.tsx:3-59](file://src/components/auth/LockedOverlay.tsx#L3-L59)

### macOS-Style Flippable Cards
Interactive cards flip to reveal details, styled with glass panels and macOS-style title bars.

```mermaid
sequenceDiagram
participant U as "User"
participant C as "ServiceCard.tsx"
participant DOM as "DOM"
U->>C : "Click card"
C->>DOM : "Toggle flipped class"
DOM->>DOM : "Apply rotateY(180deg)"
Note over DOM : "Front/back faces switch visibility"
```

**Diagram sources**
- [global.css:138-171](file://src/styles/global.css#L138-L171)
- [ServiceCard.tsx:31-35](file://src/components/home/ServiceCard.tsx#L31-L35)
- [ServiceCard.tsx:107-113](file://src/components/home/ServiceCard.tsx#L107-L113)

**Section sources**
- [global.css:138-171](file://src/styles/global.css#L138-L171)
- [ServiceCard.tsx:31-35](file://src/components/home/ServiceCard.tsx#L31-L35)
- [ServiceCard.tsx:107-113](file://src/components/home/ServiceCard.tsx#L107-L113)

### Animations and Micro-interactions
A small set of reusable animations enhances motion design:
- Fade-in up for hero sections.
- Pulse glow for emphasis.
- Float for light elevation.
- Staggered delays for grouped items.

```mermaid
classDiagram
class FadeInUp {
+animation : "fadeInUp 0.6s ease-out forwards"
}
class PulseGlow {
+animation : "pulse-glow 3s ease-in-out infinite"
}
class Float {
+animation : "float 4s ease-in-out infinite"
}
class DelayClasses {
+delay-100..500
}
```

**Diagram sources**
- [global.css:323-376](file://src/styles/global.css#L323-L376)

**Section sources**
- [global.css:323-376](file://src/styles/global.css#L323-L376)
- [Hero.tsx:25](file://src/components/home/Hero.tsx#L25)
- [MenuBar.tsx:48-68](file://src/components/layout/MenuBar.tsx#L48-L68)

### Responsive Design and Mobile-First Strategy
- Global responsive rule adjusts card height on narrow screens.
- Components use clamp-based sizing and flexible grids.
- Typography scales with viewport width for optimal readability.

```mermaid
flowchart TD
Viewport["Viewport Width"] --> MQ["max-width: 768px"]
MQ --> Adjust["Adjust card height and layout"]
Viewport --> Clamp["Use clamp() for fluid sizes"]
Clamp --> Readable["Consistent readability"]
```

**Diagram sources**
- [global.css:377-383](file://src/styles/global.css#L377-L383)
- [Hero.tsx:60](file://src/components/home/Hero.tsx#L60)
- [ServicesGrid.tsx:150-154](file://src/components/home/ServicesGrid.tsx#L150-L154)

**Section sources**
- [global.css:377-383](file://src/styles/global.css#L377-L383)
- [Hero.tsx:60](file://src/components/home/Hero.tsx#L60)
- [ServicesGrid.tsx:150-154](file://src/components/home/ServicesGrid.tsx#L150-L154)

### Theme System Integration
- CSS custom properties define semantic tokens for colors, backgrounds, typography, and effects.
- Components reference tokens directly for consistent theming.
- Strong separation of concerns: tokens in global CSS, component styles in TSX.

```mermaid
graph LR
Tokens["CSS Custom Properties<br/>:root"] --> Global["global.css"]
Global --> Components["Components"]
Components --> Rendered["Rendered Styles"]
```

**Diagram sources**
- [global.css:3-22](file://src/styles/global.css#L3-L22)
- [MenuBar.tsx:48-68](file://src/components/layout/MenuBar.tsx#L48-L68)
- [Hero.tsx:60-67](file://src/components/home/Hero.tsx#L60-L67)

**Section sources**
- [global.css:3-22](file://src/styles/global.css#L3-L22)
- [MenuBar.tsx:48-68](file://src/components/layout/MenuBar.tsx#L48-L68)
- [Hero.tsx:60-67](file://src/components/home/Hero.tsx#L60-L67)

## Dependency Analysis
Tailwind is integrated via the Vite plugin and configured through package dependencies. The global stylesheet imports Tailwind utilities and defines brand-specific extensions.

```mermaid
graph TB
Pkg["package.json"] --> TW["tailwindcss"]
Pkg --> TWVite["@tailwindcss/vite"]
Vite["vite.config.ts"] --> TWVite
TWVite --> Global["global.css"]
```

**Diagram sources**
- [package.json:19-35](file://package.json#L19-L35)
- [vite.config.ts:1-8](file://vite.config.ts#L1-L8)
- [global.css:1](file://src/styles/global.css#L1)

**Section sources**
- [package.json:19-35](file://package.json#L19-L35)
- [vite.config.ts:1-8](file://vite.config.ts#L1-L8)
- [global.css:1](file://src/styles/global.css#L1)

## Performance Considerations
- Keep global CSS minimal and scoped to avoid unnecessary repaints.
- Prefer CSS custom properties for dynamic theming to reduce reflows.
- Use Tailwind utilities for common patterns to leverage JIT compilation.
- Avoid excessive backdrop blur on low-power devices; consider media queries to tone down effects.
- Lazy-load heavy assets and defer non-critical animations until after initial render.
- Ensure critical CSS is inlined for faster first paint; Tailwind purging reduces bundle size.

## Troubleshooting Guide
Common issues and resolutions:
- Glass effect not visible: Verify backdrop-filter support and ensure parent has sufficient contrast.
- Animations stutter: Reduce number of animated elements on screen or throttle frame rate.
- Typography misalignment: Confirm font fallbacks and ensure custom fonts are loaded.
- Hover states inconsistent: Ensure hover variants are applied after base classes in the class chain.
- Responsive breakpoints: Confirm media queries are ordered mobile-first and not overridden unintentionally.

## Conclusion
DevForge’s design system centers on a cohesive set of tokens, glass morphism patterns, neon accents, and micro-animations. By leveraging Tailwind utilities and global CSS custom properties, components remain consistent, performant, and extensible. Following the conventions outlined here ensures visual continuity and a polished user experience across devices.

## Appendices

### A. Tailwind Integration Checklist
- Confirm Tailwind plugin is enabled in Vite configuration.
- Ensure global CSS imports Tailwind utilities.
- Keep Purge/Glob patterns aligned with component usage to minimize CSS size.
- Test on multiple devices to validate responsive behavior.

**Section sources**
- [vite.config.ts:1-8](file://vite.config.ts#L1-L8)
- [global.css:1](file://src/styles/global.css#L1)

### B. Extending the Design System
- Add new tokens to CSS custom properties for consistent reuse.
- Define new utility classes in global CSS for common patterns.
- Create component-level variants that map to shared tokens.
- Document new tokens and patterns in a style guide to maintain consistency.

**Section sources**
- [global.css:3-22](file://src/styles/global.css#L3-L22)
- [global.css:92-115](file://src/styles/global.css#L92-L115)
- [global.css:205-265](file://src/styles/global.css#L205-L265)

### C. Accessibility Considerations
- Maintain sufficient color contrast against glass backgrounds.
- Provide focus indicators for interactive elements.
- Avoid relying solely on color to convey meaning; pair with text or icons.
- Ensure animations can be reduced or disabled by users with vestibular disorders.

[No sources needed since this section provides general guidance]