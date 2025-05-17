<script setup>
import { requestFetchDocJoinURL } from '@/api/share'
import ClListItem from '@/components/common/ClListItem.vue'
import { User } from '@element-plus/icons-vue/dist/index.js'
import { inject, onMounted, reactive } from 'vue'

const state = reactive({
  shareUrl: '',
  isLoading: true,
  selectValue: 1,
})

const targetType = inject('targetType')
const targetId = inject('targetId')

const methods = {
  handleSelect() {
    state.isLoading = true

    requestFetchDocJoinURL({
      target_type: targetType,
      target_id: targetId,
      role: state.selectValue || 1,
    }).then((res) => {
      state.isLoading = false
      state.shareUrl = `${window.location.origin}/g/share?token=${res.data.token}`
    })
  },
  handleCopy() {
    window.navigator.clipboard.writeText(state.shareUrl)
  },
}

onMounted(() => {
  methods.handleSelect()
})
</script>

<template>
  <p>拿到链接的人可获得 {{ state.selectValue === 1 ? '阅读' : '编辑' }} 权限</p>
  <section class="share-url-wrap">
    <ElInput v-model="state.shareUrl" disabled />
    <ElButton type="primary" @click="methods.handleCopy" :disabled="state.isLoading" style="margin-left: 10px">
      复制链接
    </ElButton>
  </section>
  <section>
    <ClListItem>
      <template #prepend>
        <ElIcon :size="18">
          <User />
        </ElIcon>
      </template>
      <template #content>
        <span>协作权限</span>
      </template>
      <template #append>
        <ElSelect v-model="state.selectValue" placeholder="请选择" size="small" style="width: 100px"
          :disabled="state.isLoading" @change="methods.handleSelect">
          <ElOption label="可阅读" :value="1" />
          <ElOption label="可编辑" :value="2" />
        </ElSelect>
      </template>
    </ClListItem>
  </section>
</template>

<style lang="scss" scoped>
.share-url-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
