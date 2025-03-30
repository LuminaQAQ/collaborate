<template>
  <Teleport :to="target">
    <ElContainer class="cl-full-screen-wrapper">
      <ElHeader style="border-bottom: 1px solid #ccc">
        <slot name="header" />
      </ElHeader>
      <ElContainer>
        <ElAside style="height: 100%; overflow: hidden; border-right: 1px solid #ccc">
          <slot name="aside" />
        </ElAside>
        <ElMain>
          <slot name="content" />
        </ElMain>
      </ElContainer>
    </ElContainer>
  </Teleport>
</template>

<script setup>
import { ElHeader, ElContainer, ElAside, ElMain } from 'element-plus'
import { onMounted, onUnmounted } from 'vue'

defineProps({
  target: {
    type: String,
    default: 'body',
  },
})

const emits = defineEmits(['open', 'close'])

const methods = {
  open: () => {
    emits('open')
  },
  close: () => {
    emits('close')
  },
}

onMounted(() => {
  methods.open()
})

onUnmounted(() => {
  methods.close()
})
</script>

<style lang="scss">
.cl-full-screen-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000;
}

.el-container {
  height: 100%;
}

.el-header {
  --el-header-height: auto;
}

.el-aside {
  width: 200px;
}

.el-main {
  flex: 1;
}
</style>
