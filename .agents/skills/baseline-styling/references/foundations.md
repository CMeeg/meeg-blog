# Core Global Styles, Type Scale & Fluid Type

## Core Global Styles

Set design tokens as CSS custom properties on `:root`, then style HTML elements directly (CUBE CSS principle: do as much as possible, as high as possible, globally).

```css
:root {
  --color-dark: #000000;
  --color-light: #ffffff;
  --color-primary: #1a8fe3;
}

body {
  background: var(--color-light);
  color: var(--color-dark);
  padding: 2em;
  font-family: Georgia, serif;
}

h1, h2, h3 {
  font-family: Inter, sans-serif;
  font-weight: 800;
}

ul, ol {
  padding-inline-start: 1em;
}

blockquote {
  padding-inline-start: 1em;
  border-inline-start: 0.3em solid;
}
```

## Type Scale (Major Third)

A ratio-based type scale creates rhythm and consistency. Each step is the previous step multiplied by the ratio (1.25 for Major Third).

| Step | Size | Calculation |
|------|------|-------------|
| Step 0 | 1rem | base |
| Step 1 | 1.25rem | 1 × 1.25 |
| Step 2 | 1.56rem | 1.25 × 1.25 |
| Step 3 | 1.95rem | 1.56 × 1.25 |
| Step 4 | 2.43rem | 1.95 × 1.25 |

```css
:root {
  --color-dark: #000000;
  --color-light: #ffffff;
  --color-primary: #1a8fe3;
  --size-step-0: 1rem;
  --size-step-1: 1.25rem;
  --size-step-2: 1.56rem;
  --size-step-3: 1.95rem;
  --size-step-4: 2.43rem;
}

body {
  font-size: var(--size-step-0);
}

h1 { font-size: var(--size-step-4); }
h2 { font-size: var(--size-step-3); }
h3 { font-size: var(--size-step-2); }

blockquote {
  font-style: italic;
  font-size: var(--size-step-1);
}
```

## Fluid Type (via Utopia)

Replace the fixed steps with Utopia-generated `clamp()` values for fluid typography — smaller scale on small viewports, larger scale on large viewports.

Configuration: Minor Third (1.25) at 320px / Perfect Fourth (1.333) at 1240px

```css
:root {
  --color-dark: #000000;
  --color-light: #ffffff;
  --color-primary: #1a8fe3;
  --size-step-0: clamp(1rem, calc(0.96rem + 0.22vw), 1.13rem);
  --size-step-1: clamp(1.25rem, calc(1.16rem + 0.43vw), 1.5rem);
  --size-step-2: clamp(1.56rem, calc(1.41rem + 0.76vw), 2rem);
  --size-step-3: clamp(1.95rem, calc(1.71rem + 1.24vw), 2.66rem);
  --size-step-4: clamp(2.44rem, calc(2.05rem + 1.93vw), 3.55rem);
}
```

Use the [Utopia fluid type calculator](https://utopia.fyi/type/calculator/) to generate custom fluid scales for different font pairings and viewport ranges.
