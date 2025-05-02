<template>
  <template v-for="(item, index) in toolbarConfig" :key="index">
    <span
      class="md-toolbar-icon"
      v-html="item.icon"
      :title="item.title"
      @click="handleClick(item.command)"
    ></span>
  </template>
</template>

<script setup>
import { Crepe } from '@milkdown/crepe'
import { boldIcon, italicIcon, strikethroughIcon, codeIcon, quoteIcon } from '../icons'
import { commandsCtx } from '@milkdown/kit/core'

const { editor } = defineProps({
  editor: {
    type: Crepe,
  },
})

const toolbarConfig = [
  {
    title: '粗体\nCtrl B',
    icon: boldIcon,
    command: 'ToggleStrong',
  },
  {
    title: '斜体\nCtrl I',
    icon: italicIcon,
    command: 'ToggleEmphasis',
  },
  {
    title: '删除线\nCtrl D',
    icon: strikethroughIcon,
    command: 'ToggleStrikeThrough',
  },
  {
    title: '代码\nCtrl E',
    icon: codeIcon,
    command: 'CreateCodeBlock',
  },
  {
    title: '引用\nCtrl Q',
    icon: quoteIcon,
    command: 'WrapInBlockquote',
  },
]

const handleClick = (command) => {
  editor.editor.action((ctx) => {
    ctx.get(commandsCtx).call(command)
  })
}
</script>

<style>
.md-toolbar-icon {
  cursor: pointer;
}
</style>
