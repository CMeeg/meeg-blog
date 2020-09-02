import Vue from 'vue'
import VueHighlightJS from 'vue-highlight.js'
import bash from 'highlight.js/lib/languages/bash'
import cs from 'highlight.js/lib/languages/cs'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import dos from 'highlight.js/lib/languages/dos'
import fsharp from 'highlight.js/lib/languages/fsharp'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import plaintext from 'highlight.js/lib/languages/plaintext'
import powershell from 'highlight.js/lib/languages/powershell'
import scss from 'highlight.js/lib/languages/scss'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

const config = {
  languages: {
    bash,
    cs,
    css,
    dockerfile,
    dos,
    fsharp,
    javascript,
    json,
    markdown,
    plaintext,
    powershell,
    scss,
    sql,
    typescript,
    xml,
    yaml
  }
}

const supportedLanguageKeys = Object.keys(config.languages)
  .map((key) => key.toLowerCase())
  // These are for where the language code from Storyblok doesn't match up with the language name from highlight.js
  .concat(['html'])

const supportedLanguages = new Set(supportedLanguageKeys)

Vue.use(VueHighlightJS, config)

const highlighter = function () {
  return {
    isSupportedLanguage: (lang) => supportedLanguages.has(lang.toLowerCase())
  }
}

export default (_, inject) => {
  inject('codeHighlighter', () => highlighter())
}
