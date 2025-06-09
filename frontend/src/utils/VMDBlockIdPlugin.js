import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

function addBlockId(renderer, tagName) {
  const ruleName = `${tagName}_open`

  const defaultRender =
    renderer.rules[ruleName] ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  renderer.rules[ruleName] = function (tokens, idx, options, env, self) {
    tokens[idx].attrPush(['data-block-id', `${tagName}-${idx}`])
    return defaultRender(tokens, idx, options, env, self)
  }
}

const targetTags = [
  'paragraph',
  'heading',
  'blockquote',
  'bullet_list',
  'ordered_list',
  'list_item',
  'table_open',
  'thead_open',
  'tbody_open',
  'tr_open',
  'th_open',
  'td_open',
]

targetTags.forEach((tag) => addBlockId(md.renderer, tag))

const defaultFence =
  md.renderer.rules.fence ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

md.renderer.rules.fence = function (tokens, idx, options, env, self) {
  const token = tokens[idx]

  const content = token.content
  const info = token.info ? token.info.trim() : ''
  const langClass = info ? ` class="language-${info}"` : ''

  return `<pre data-block-id="code-${idx}"><code${langClass}>${md.utils.escapeHtml(content)}</code></pre>\n`
}

export default md
