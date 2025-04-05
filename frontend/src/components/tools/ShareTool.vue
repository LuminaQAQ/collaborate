<script setup>
import { Link, Share, User } from '@element-plus/icons-vue/dist/index.js'
import { useDocStore } from '@/stores/doc'
import ClIconButton from '../common/ClIconButton.vue'
import ClListItem from '../common/ClListItem.vue'
import { reactive } from 'vue'
import { ElIcon, ElPageHeader, ElSelect } from 'element-plus'
import { request } from '@/utils/request'
import { useRoute } from 'vue-router'

const docStore = useDocStore()
const route = useRoute()

const state = reactive({
  shareUrl: '',
  visible: false,
  isHome: true,
  selectValue: 1,
})

const methods = {
  handleShare() {
    state.isHome = false
  },
  handleBack() {
    state.isHome = true
  },
  handleSelect(value) {
    console.log(value)
  },
}

request
  .get('/api/bookJoinURL', {
    params: {
      book_id: route.params.book,
      role: state.selectValue,
    },
  })
  .then((res) => {
    state.shareUrl = `${window.location.origin}/g/share?token=${res.data.bookToken}`
  })
</script>

<template>
  <span>
    <el-popover placement="bottom-start" :width="300" :visible="state.visible">
      <template #reference>
        <ClIconButton
          :icon="Share"
          title="分享"
          v-permission="['book:owner', 'book:editor']"
          @click="state.visible = !state.visible"
        />
      </template>
      <template #default>
        <template v-if="state.isHome">
          <ClListItem>
            <template #title> 分享 </template>
            <template #content>
              <small>通过链接，邀请对方加入协作</small>
            </template>
            <template #append>
              <ClIconButton
                :icon="Link"
                title="链接添加协作者"
                size="22"
                @click="methods.handleShare"
              />
            </template>
          </ClListItem>
        </template>
        <template v-else>
          <ElPageHeader title=" " content="链接添加协作者" @back="methods.handleBack" />
          <p>拿到链接的人可获得 {{ state.selectValue === 1 ? '阅读' : '编辑' }} 权限</p>
          <section class="share-url-wrap">
            <ElInput v-model="state.shareUrl" />
            <ElButton type="primary" @click="methods.handleCopy" style="margin-left: 10px">
              复制链接
            </ElButton>
          </section>
          <section>
            <ClListItem>
              <template #prepend>
                <ElIcon :size="18"><User /></ElIcon>
              </template>
              <template #content>
                <span>协作权限</span>
              </template>
              <template #append>
                <ElSelect
                  v-model="state.selectValue"
                  placeholder="请选择"
                  size="small"
                  style="width: 100px"
                  @change="methods.handleSelect"
                >
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
