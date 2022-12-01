import type { Highlighter, HighlighterOptions } from 'shiki'
import { getHighlighter } from 'shiki'
import type { Theme } from '~/features/themes'
import { themes } from '~/features/themes'

const shikiThemes: { [key: string]: string } = {
  [themes.light.name]: 'github-light',
  [themes.dark.name]: 'dracula'
}

const defaultShikiTheme = shikiThemes.dark

const highlighters = new Map<string, Highlighter>()

const createOptionsKey = (options: HighlighterOptions) => {
  return JSON.stringify(options, Object.keys(options).sort())
}

const createCodeHighlighter = async (theme: Theme | null = null) => {
  const shikiTheme = theme ? shikiThemes[theme.name] : defaultShikiTheme

  const options = {
    theme: shikiTheme
  }

  const key = createOptionsKey(options)

  let highlighter = highlighters.get(key)

  if (highlighter) {
    return highlighter
  }

  highlighter = await getHighlighter(options)

  highlighters.set(key, highlighter)

  return highlighter
}

export { createCodeHighlighter }
