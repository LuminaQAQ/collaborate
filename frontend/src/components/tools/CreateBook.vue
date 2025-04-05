<script setup>
import { ElButton, ElDialog, ElDivider, ElInput } from 'element-plus'
import { reactive } from 'vue'

defineProps({
  isOpen: Boolean,
})

const emits = defineEmits(['open', 'close', 'submit'])

const state = reactive({
  bookName: '',
  bookDesc: '',
  isValidate: false,
  isLoading: false,
})

const handleOpen = () => {
  emits('open', true)
}

const handleClose = () => {
  emits('close', false)
}

const handleSubmit = () => {
  if (state.bookName.length > 0) {
    emits(
      'submit',
      {
        bookName: state.bookName,
        bookDesc: state.bookDesc,
      },
      function resetFn() {
        state.bookName = ''
        state.bookDesc = ''
        state.isLoading = false
      },
      function errorFn() {
        state.isLoading = false
      },
    ),
      (state.isLoading = true)
  }
}
</script>

<template>
  <ElDialog :model-value="isOpen" width="500" @open="handleOpen" @close="handleClose">
    <template #header>新建知识库</template>
    <div class="cl-create-book__body">
      <span>基本信息</span>
      <ElInput
        v-model="state.bookName"
        @input="state.bookName.length > 0 ? (state.isValidate = true) : (state.isValidate = false)"
        placeholder="知识库名称"
        maxlength="10"
        show-word-limit
        style="margin: 0.75rem 0"
      />
      <ElInput
        type="textarea"
        v-model="state.bookDesc"
        placeholder="知识库简介（选填）"
        maxlength="30"
        resize="none"
        :autosize="{ minRows: 4, maxRows: 8 }"
        show-word-limit
      />
    </div>
    <template #footer>
      <template v-if="state.isValidate">
        <ElButton
          style="width: 100%"
          type="primary"
          @click="handleSubmit"
          :loading="state.isLoading"
        >
          新建
        </ElButton>
      </template>
      <template v-else>
        <ElButton style="width: 100%" type="primary" @click="handleSubmit" disabled>
          新建
        </ElButton>
      </template>
    </template>
  </ElDialog>
</template>

<style lang="scss"></style>
