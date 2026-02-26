import { marked } from 'marked'
import hljs from 'highlight.js'

// Configure marked with highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('Highlight error:', err)
      }
    }
    try {
      return hljs.highlightAuto(code).value
    } catch (err) {
      console.error('Auto-highlight error:', err)
      return code
    }
  },
  breaks: true,
  gfm: true
})

// Parse markdown to HTML
export function parseMarkdown(text) {
  if (!text) return ''
  return marked.parse(text)
}
