import './assets/main.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import permission from './directive/permission'

VMdPreview.use(vuepressTheme, {
  Prism,
})

VMdPreview.use(createTodoListPlugin())
VMdPreview.use(createCopyCodePlugin())
VMdPreview.use(createKatexPlugin())

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.use(VMdPreview)
app.use(permission)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
