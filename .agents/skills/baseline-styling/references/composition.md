# Flow, Rhythm, Line Heights, Line Lengths, Color & Finishing Touches

## Flow & Rhythm (the flow utility)

The `.flow` utility adds vertical rhythm between sibling elements. Every direct sibling child gets `margin-block-start`, defaulting to `1em` (relative to the element's own font size).

```css
.flow > * + * {
  margin-block-start: var(--flow-space, 1em);
}
```

Add more space above headings and blockquotes, and tighter space between a heading and its immediate sibling:

```css
:is(h1, h2, h3, blockquote) {
  --flow-space: 1.5em;
}

:is(h1, h2, h3) + * {
  --flow-space: 0.5em;
}
```

Use the [Utopia space calculator](https://utopia.fyi/space/calculator/) for fluid space scales in production.

## Line Heights

- **Headings**: tight line-height (1.1) — especially important for display fonts with shallow ascenders/descenders
- **Body**: generous line-height (1.7) for readability — set globally on `body` so it inherits to all elements

```css
body {
  line-height: 1.7;
}

h1, h2, h3 {
  line-height: 1.1;
}
```

## Line Lengths

Long lines are hard to read. Use the `ch` unit (width of the `0` character) to cap line lengths.

Good rule of thumb: 65-75 characters for long-form content.

```css
article > * {
  max-width: 65ch;
}

blockquote {
  max-width: 50ch;
}

h1 {
  max-width: 20ch;
}

h2, h3 {
  max-width: 28ch;
}
```

## Color & Contrast

Off-black on off-white is easier to read than pure black on pure white.

```css
:root {
  --color-dark: #252525;
  --color-light: #efefef;
  --color-primary: #1a8fe3;
}
```

Style links with visible underlines using the primary color:

```css
a {
  color: currentColor;
  text-decoration-color: var(--color-primary);
  text-decoration-thickness: 0.3ex;
  text-underline-offset: 0.3ex;
}
```

Style the lede (intro paragraph) to stand out:

```css
.lede {
  font-size: var(--size-step-1);
  font-style: italic;
  max-width: 50ch;
}

.lede + * {
  --flow-space: 2em;
}
```

## Text Wrap Balance (progressive enhancement)

`text-wrap: balance` balances wrapped text lines. Only apply to short text chunks (headings, lede). Use as progressive enhancement — browsers that don't support it ignore it.

```css
h1, h2, h3 {
  text-wrap: balance;
}

.lede {
  text-wrap: balance;
}
```

## Centering (finishing touches)

Constrain the article width and center it horizontally:

```css
article {
  max-width: 65ch;
  margin-inline: auto;
}
```
