<script setup>
import { Link, Share, User } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '@/components/common/ClIconButton.vue'
import ClListItem from '@/components/common/ClListItem.vue'
import { reactive, ref, watch } from 'vue'
import { ElIcon, ElPageHeader, ElSelect } from 'element-plus'
import { request } from '@/utils/request'
import { useRoute } from 'vue-router'

const route = useRoute()

const isHome = ref(true)

const state = reactive({
  shareUrl: '',
  isLoading: true,
  visible: false,
  selectValue: 1,
})

// TODO: 重构组件
const methods = {
  handleShare() {
    isHome.value = false
  },
  handleBack() {
    isHome.value = true
  },
  handleSelect() {
    state.isLoading = true
    request
      .get('/api/bookJoinURL', {
        params: {
          book_id: route.params.book,
          role: state.selectValue || 1,
        },
      })
      .then((res) => {
        state.isLoading = false
        state.shareUrl = `${window.location.origin}/g/share?token=${res.data.token}`
      })
  },
  handleCopy() {
    window.navigator.clipboard.writeText(state.shareUrl)
  },
}

watch(isHome, (val) => {
  if (!val) methods.handleSelect()
})
</script>

<template>
  <span>
    <el-popover placement="bottom-start" :width="300" :visible="state.visible">
      <template #reference>
        <ClIconButton :icon="Share" title="分享" v-permission="['book:owner', 'book:editor', 'doc:owner', 'doc:editor']"
          @click="state.visible = !state.visible" />
      </template>
      <template #default>
        <template v-if="isHome">
          <ClListItem>
            <template #title> 分享 </template>
            <template #content>
              <small>通过链接，邀请对方加入协作</small>
            </template>
            <template #append>
              <ClIconButton :icon="Link" title="链接添加协作者" size="22" @click="methods.handleShare" />
            </template>
          </ClListItem>
        </template>
        <template v-else>
          <ElPageHeader title=" " content="链接添加协作者" @back="methods.handleBack" />
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
      </template>
    </el-popover>
  </span>
</template>

<style lang="scss" scoped>
.share-url-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
