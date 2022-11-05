import type { Highlighter, Lang } from 'shiki'
import type { ComponentChildren } from 'preact'
import styles from './index.module.scss'

export interface Props {
  languageClass: string
  highlighter?: Highlighter
  children: ComponentChildren
}

const defaultLanguage = 'markdown'

const languageMap: { [key: string]: Lang } = {
  cs: 'csharp',
  dockerfile: 'docker'
}

const mapLanguage = (languageClass: string) => {
  // We need to remove the prefix added by Storyblokto get the language name
  const language = languageClass.replace('language-', '')

  const mappedLanguage = languageMap[language]

  if (mappedLanguage) {
    return mappedLanguage
  }

  return language as Lang
}

const getLanguage = (languageClass: string, highlighter: Highlighter) => {
  if (languageClass.length === 0) {
    return defaultLanguage
  }

  const languages = highlighter.getLoadedLanguages()

  const language = mapLanguage(languageClass)

  if (languages.includes(language)) {
    return language
  }

  // TODO: Log this properly
  console.log(
    `Could not map codeblock language '${languageClass}' to highlighter language.`
  )

  return defaultLanguage
}

export default function Codeblock({
  highlighter,
  languageClass,
  children
}: Props) {
  const code =
    Array.isArray(children) && children.length ? (children[0] as string) : ''

  if (!highlighter) {
    return (
      <div className={styles.codeblock}>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    )
  }

  const language = getLanguage(languageClass, highlighter)

  const highlightedCode = highlighter.codeToHtml(code, { lang: language })

  return (
    <div
      className={styles.codeblock}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  )
}
