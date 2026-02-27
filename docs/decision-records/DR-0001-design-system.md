# ADR-0001: Design System — Color Palette, Typography, and UI Components

**Status:** Accepted  
**Date:** 2026-02-27  
**Deciders:** Reece  
**Discussion:** Vaguely discussed "matching ISF colors" with Ashley and Meredith

## Context

The project requires a consistent visual language across all UI surfaces. Without documented design tokens and component conventions, contributors (human and AI) will make inconsistent choices for colors, typography, spacing, and interactive elements. This is especially important for an embeddable component context where visual consistency and brand fidelity matter.

The brand palette consists of four base colors — a primary navy blue (`#2547a0`), a bold red (`#c1211f`), a gold/yellow (`#f9c430`), and white (`#ffffff`). These alone are insufficient for a complete design system: they do not cover hover states, disabled states, backgrounds, secondary text, semantic feedback (error, warning, success), or accessible contrast variations.

## Decision

We will use the following design tokens as the canonical color palette, organized by color family. All UI work — new components, fixes, and AI-assisted code generation — should reference these tokens by name or hex value.

### Blues
| Token | Hex | RGB | Use |
|---|---|---|---|
| Deep Navy | `#1a3570` | rgb(26, 53, 112) | Hover states, headers, footer |
| Blue (Primary) | `#2547a0` | rgb(37, 71, 160) | Primary buttons, links, brand |
| Blue Light | `#3a6bbf` | rgb(58, 107, 191) | Secondary buttons, link text |

### Reds
| Token | Hex | RGB | Use |
|---|---|---|---|
| Red Dark / Crimson | `#a8180f` | rgb(168, 24, 15) | Pressed states, red borders |
| Red (Primary) | `#c1211f` | rgb(193, 33, 31) | Alerts, CTAs, highlights |
| Red Bright | `#e8463f` | rgb(232, 70, 63) | Hover on red elements |

### Yellows / Golds
| Token | Hex | RGB | Use |
|---|---|---|---|
| Gold Deep | `#f5b800` | rgb(245, 184, 0) | Gold hover states, borders |
| Gold (Primary) | `#f9c430` | rgb(249, 196, 48) | Highlights, badges, hover |
| Gold Pale | `#fde68a` | rgb(253, 230, 138) | Warning backgrounds, badges |

### Others (Neutrals)
| Token | Hex | RGB | Use |
|---|---|---|---|
| Navy Black | `#1c2440` | rgb(28, 36, 64) | Body text, dark backgrounds |
| Slate / Muted | `#6b7a99` | rgb(107, 122, 153) | Captions, secondary text |
| Tinted BG | `#e8edf5` | rgb(232, 237, 245) | Card backgrounds, table rows |
| White | `#ffffff` | rgb(255, 255, 255) | Backgrounds, text on dark |

### Typography

We will use **Playfair Display** (display/serif) for headlines and **Source Sans 3** (humanist sans) for body copy, with **Source Code Pro** for monospaced/label text. This pairing reflects the authoritative, institutional character of the brand palette.

| Role | Font | Size | Weight | Color |
|---|---|---|---|---|
| Heading 1 | Playfair Display | 48px | 900 | Deep Navy |
| Heading 2 | Playfair Display | 32px | 700 | Navy Black |
| Heading 3 | Source Sans 3 | 22px | 700 | Blue Primary |
| Heading 4 / Eyebrow | Source Sans 3 | 16px | 700 uppercase | Navy Black |
| Body | Source Sans 3 | 16px | 400 | Navy Black |
| Secondary / Small | Source Sans 3 | 13px | 300 | Muted |
| Mono Label | Source Code Pro | 12px | 400 | Muted |
| Caption | Source Sans 3 | 12px | 400 italic | Muted |

### Component Conventions

- **Buttons:** 4px border-radius; filled (Blue, Red, Gold, Dark), outline (Blue, Red), and ghost variants. Hover states darken or shift to the darker token in the same color family.
- **Links:** Default (Blue underline), destructive (Red), navigation (Navy Black + Gold underline accent), muted (Slate underline).
- **Separators:** Light (`#e8edf5`), bold Blue, Gold, Red, dashed muted, and ornamental Gold variants.
- **Badges:** Use `font-family: monospace`, uppercase, 11px. Color variants map to all major palette tokens.
- **Alerts:** Left-bordered callout pattern. Info → Blue, Warning → Gold Pale, Error → Red, Success → external green (`#2d8a55`), Announcement → Navy Black + Gold border.
- **Form inputs:** 1.5px border at `#c9d4e8`; focus ring uses Blue Primary at 12% opacity. Error state uses Red Primary border.
- **Cards:** White background, `box-shadow: 0 1px 4px rgba(28,36,64,.10)`, 6px border-radius. Header variants in Blue, Gold, and Navy Black.

The reference implementation is the file `../design-library.html` in this repository.

## Consequences

**Positive:**
- Contributors and AI tools have a single source of truth for colors, type, and component patterns, reducing inconsistency.
- Hover, error, and state variants are explicitly defined, so no ad-hoc color choices are needed for interactive states.
- The neutral tokens (Navy Black, Slate, Tinted BG) are blue-tinted and harmonize with the brand palette, avoiding clashes from generic greys.

**Negative:**
- The typography stack (Playfair Display + Source Sans 3) requires Google Fonts or self-hosted font files; this adds a network dependency and may need review for performance-sensitive embeds.
- The design system does not yet define spacing, shadow, or animation tokens — those are implicit in the reference HTML and will need to be formalized if the system grows.

**Neutral:**
- The palette deliberately excludes warm greys and greens to preserve palette cohesion. Contributors should not introduce these without a new ADR.

## Alternatives Considered

**Use a generic design system (e.g. Tailwind defaults, Bootstrap theme):** Rejected. The existing brand palette is distinctive and doesn't map cleanly to generic token scales. A bespoke token set is more honest about the actual constraints.

**Use only the four base brand colors without extensions:** Rejected. Four colors are insufficient for a usable UI system — interactive states, semantic feedback, and accessible text hierarchy all require the extended palette defined here.

**CSS custom properties only, no documented tokens:** Rejected. Variables without documentation and naming rationale are not useful to AI coding tools or new contributors who lack full context.
