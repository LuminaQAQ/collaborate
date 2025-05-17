<script setup>
import ClIconButton from '@/components/common/ClIconButton.vue'
import { computed, reactive } from 'vue'
import { ElIcon, ElPageHeader } from 'element-plus'

const { history } = defineProps({
  icon: ElIcon,
  iconDesc: String,
  history: Array
})

const emits = defineEmits(["back"]);

const state = reactive({
  visible: false
})

const methods = {
  handleBack() {
    emits("back")
  },
}

const currentPage = computed(() => history[history.length - 1])
</script>

<template>
  <span>
    <el-popover placement="bottom-start" :width="300" :visible="state.visible">
      <template #reference>
        <ClIconButton :icon="icon" :title="iconDesc" @click="state.visible = !state.visible" />
      </template>
      <template #default>
        <template v-if="history.length === 0">
          <slot name="content"></slot>
        </template>
        <template v-else>
          <ElPageHeader title=" " :content="currentPage.header" @back="methods.handleBack" />
          <component :is="currentPage.component"></component>
        </template>
      </template>
    </el-popover>
  </span>
</template>
