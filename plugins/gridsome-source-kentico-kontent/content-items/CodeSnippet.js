
const { GridsomeContentItem } = require('@meeg/gridsome-source-kentico-kontent');
const shiki = require('shiki');

class CodeSnippet extends GridsomeContentItem {
  async addFields(node) {
    await super.addFields(node);

    await this.setHighlightedCodeField(node);

    return node;
  }

  async setHighlightedCodeField(node) {
    const code = node.item.code;
    const language = node.item.language[0].codename || 'javascript';

    const highlighter = await shiki.getHighlighter({
      theme: 'monokai',
      langs: [
        'csharp',
        'cmd',
        'css',
        'fsharp',
        'graphql',
        'html',
        'javascript',
        'json',
        'markdown',
        'postcss',
        'powershell',
        'razor',
        'scss',
        'sql',
        'typescript',
        'vue',
        'xml',
        'yaml'
      ]
    });

    const value = highlighter.codeToHtml(code, language);

    this.addField(node, 'highlightedCode', value);
  }
}

module.exports = CodeSnippet;
