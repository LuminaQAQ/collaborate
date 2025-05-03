import { defaultConfigItems, menuConfigCtx, menuDefaultConfig } from '@milkdown-lab/plugin-menu'
import '@milkdown-lab/plugin-menu/style.css'
import '../style/menu.css'

/**
 * @type {import("@milkdown-lab/plugin-menu").MenuConfigItem[][]}
 */
const menuItems = [...defaultConfigItems]
const headingDesc = ['一', '二', '三', '四', '五', '六']
const headingOptions = [
  {
    id: 0,
    content: '正文',
  },
  {
    id: 1,
    content: '标题一',
  },
  {
    id: 2,
    content: '标题二',
  },
  {
    id: 3,
    content: '标题三',
  },
  {
    id: 4,
    content: '标题四',
  },
  {
    id: 5,
    content: '标题五',
  },
  {
    id: 6,
    content: '标题六',
  },
].map((item) => {
  const { id } = item
  if (id !== 0) {
    const content = document.createElement(`h${id}`)
    content.innerText = `标题${headingDesc[id - 1]}`
    item.content = content
  }

  return item
})

menuItems[1][0].options = headingOptions

export const menuConfigs = (ctx) => {
  ctx.set(menuConfigCtx.key, {
    attributes: { class: 'milkdown-menu', 'data-menu': 'true' },
    items: menuItems,
  })
}
