<script setup>
import { Link, Share } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '@/components/common/ClIconButton.vue'
import ClListItem from '@/components/common/ClListItem.vue'
import { provide, reactive } from 'vue'
import ClIconPopover from '@/components/common/ClIconPopover.vue'
import ShareLinkComp from './children/ShareLinkComp.vue'

const state = reactive({
  history: [],
})

const { targetType, targetId } = defineProps({
  targetType: String,
  targetId: Number,
})

provide("targetType", targetType)
provide("targetId", targetId)

const methods = {
  /**
   *
   * @param {Object} component 子组件（类似路由）
   * @param {String} component.header 标题
   * @param {Object} component.component 组件
   */
  handleNext(component) {
    state.history.push(component)
  },
  handleBack() {
    state.history.pop()
  },
}

</script>

<template>
  <ClIconPopover :icon="Share" title="分享" :history="state.history" @back="methods.handleBack">
    <template #content>
      <ClListItem>
        <template #title> 分享 </template>
        <template #content>
          <small>通过链接，邀请对方加入协作</small>
        </template>
        <template #append>
          <ClIconButton :icon="Link" title="链接添加协作者" size="22"
            @click="methods.handleNext({ header: '链接添加协作者', component: ShareLinkComp })" />
        </template>
      </ClListItem>
    </template>
  </ClIconPopover>
</template>

<style lang="scss" scoped></style>
