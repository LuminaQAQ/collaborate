<template>
  <template v-for="(item, index) in toolbarConfig" :key="index">
    <span
      class="md-toolbar-icon"
      v-html="item.icon"
      :title="item?.title"
      @click="handleClick(item.command)"
    ></span>
  </template>
  <!-- <div v-for="command in commands" :key="command" @click="handleClick(command)">
    {{ command }}
  </div> -->

  <!-- <span
    v-for="icon in icons"
    :key="icon"
    @click="handleClick(icon)"
    v-html="icon"
    style="width: 2rem; height: 2rem; display: inline-block"
  ></span> -->
</template>

<script setup>
import { Crepe } from '@milkdown/crepe'
import {
  alignCenterIcon,
  alignLeftIcon,
  alignRightIcon,
  boldIcon,
  bulletIcon,
  bulletListIcon,
  captionIcon,
  checkBoxCheckedIcon,
  checkBoxUncheckedIcon,
  chevronDownIcon,
  clearIcon,
  codeIcon,
  confirmIcon,
  copyIcon,
  dividerIcon,
  dragHandleIcon,
  editIcon,
  h1Icon,
  h2Icon,
  h3Icon,
  h4Icon,
  h5Icon,
  h6Icon,
  imageIcon,
  italicIcon,
  linkIcon,
  menuIcon,
  orderedListIcon,
  plusIcon,
  quoteIcon,
  removeIcon,
  searchIcon,
  strikethroughIcon,
  tableIcon,
  textIcon,
  todoListIcon,
  functionsIcon,
} from '../icons'
import { commandsCtx } from '@milkdown/kit/core'

const { editor } = defineProps({
  editor: {
    type: Crepe,
  },
})

const commands = [
  'selectNodeForward',
  'TurnIntoText',
  'WrapInBlockquote',
  'WrapInHeading',
  'DowngradeHeading',
  'CreateCodeBlock',
  'InsertHardbreak',
  'InsertHr',
  'InsertImage',
  'UpdateImage',
  'WrapInOrderedList',
  'WrapInBulletList',
  'SinkListItem',
  'SplitListItem',
  'LiftListItem',
  'LiftFirstListItem',
  'ToggleEmphasis',
  'ToggleInlineCode',
  'ToggleStrong',
  'ToggleLink',
  'UpdateLink',
]

const icons = [
  alignCenterIcon,
  alignLeftIcon,
  alignRightIcon,
  boldIcon,
  bulletIcon,
  bulletListIcon,
  captionIcon,
  checkBoxCheckedIcon,
  checkBoxUncheckedIcon,
  chevronDownIcon,
  clearIcon,
  codeIcon,
  confirmIcon,
  copyIcon,
  dividerIcon,
  dragHandleIcon,
  editIcon,
  h1Icon,
  h2Icon,
  h3Icon,
  h4Icon,
  h5Icon,
  h6Icon,
  imageIcon,
  italicIcon,
  linkIcon,
  menuIcon,
  orderedListIcon,
  plusIcon,
  quoteIcon,
  removeIcon,
  searchIcon,
  strikethroughIcon,
  tableIcon,
  textIcon,
  todoListIcon,
  functionsIcon,
]

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
    title: '行内代码\nCtrl E',
    icon: codeIcon,
    command: 'CreateCodeBlock',
  },
  {
    title: '引用\nCtrl Q',
    icon: quoteIcon,
    command: 'WrapInBlockquote',
  },
  {
    title: '链接\nCtrl L',
    icon: linkIcon,
    command: 'ToggleLink',
  },
  {
    title: '有序列表\nCtrl O',
    icon: orderedListIcon,
    command: 'WrapInOrderedList',
  },
  {
    title: '无序列表\nCtrl U',
    icon: bulletListIcon,
    command: 'WrapInBulletList',
  },
]

const handleClick = (command) => {
  try {
    editor.editor.action((ctx) => {
      ctx.get(commandsCtx).call(command)
    })
  } catch (error) {}
}
</script>

<style>
.md-toolbar-icon {
  cursor: pointer;
}
</style>
