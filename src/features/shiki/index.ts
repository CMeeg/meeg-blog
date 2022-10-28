import { getHighlighter } from 'shiki'
import type { Theme } from '~/features/themes'
import { themes } from '~/features/themes'

const shikiThemes: { [key: string]: string } = {
  [themes.light.name]: 'github-light',
  [themes.dark.name]: 'dracula'
}

const defaultShikiTheme = shikiThemes.dark

const createCodeHighlighter = async (theme: Theme | null = null) => {
  const shikiTheme = theme ? shikiThemes[theme.name] : defaultShikiTheme

  return await getHighlighter({
    theme: shikiTheme
  })
}

export { createCodeHighlighter }
