<script setup>
import CatalogueTree from '@/components/catalogue/CatalogueTree.vue'
import ClIconButton from '@/components/common/ClIconButton.vue'
import ClIconButtonGroup from '@/components/common/ClIconButtonGroup.vue'
import FavoriteTool from '@/components/tools/FavoriteTool.vue'
import ShareTool from '@/components/tools/ShareTool/ShareTool.vue'
import { useDocStore } from '@/stores/doc'
import { useUserStore } from '@/stores/user'
import { More, Notebook, Share, Star } from '@element-plus/icons-vue/dist/index.js'
import { ElAvatar, ElEmpty, ElIcon, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { useRoute } from 'vue-router'

const store = useDocStore()
const route = useRoute()

const methods = {
  handleDocFavorite(isFavorite) {
    store.currentDocState.bookInfo.isFavorite = isFavorite
  },
}
</script>

<template>
  <section class="cl-book-wrap">
    <header class="cl-book__header">
      <ElSkeleton animated :loading="store.currentDocState.isLoading">
        <template #template>
          <ElSkeletonItem style="width: 2rem; height: 2rem; margin-right: 0.75rem" />
          <ElSkeletonItem style="width: 40%; height: 2rem" />
          <ElSkeletonItem style="width: 20%; height: 2rem; float: right" />
        </template>
        <template #default>
          <section class="title-wrap">
            <div class="title-info">
              <ElIcon style="margin-right: 1rem" color="#409eff">
                <Notebook />
              </ElIcon>
              <span class="title">{{ store.currentDocState.bookInfo.bookName }}</span>
            </div>
            <div class="title-setting">
              <ClIconButtonGroup size="20px">
                <FavoriteTool :targetId="Number(route.params.book)" targetType="Book"
                  :isFavorite="store.currentDocState.bookInfo.isFavorite" @update="methods.handleDocFavorite" />
                <ShareTool :targetId="Number(route.params.book)" targetType="Book" />
                <ClIconButton :icon="More" title="设置" v-permission="['book:owner', 'book:editor']" />
              </ClIconButtonGroup>
            </div>
          </section>
        </template>
      </ElSkeleton>
      <section class="statistic-wrap">
        <ElSkeleton :loading="store.currentDocState.isLoading">
          <template #template>
            <ElSkeletonItem variant="p" style="width: 30%" />
          </template>
          <template #default>
            <small>{{ store.currentDocState.bookInfo.bookDesc || '暂无简介' }}</small>
          </template>
        </ElSkeleton>
      </section>
      <section class="collaborate-wrap">
        <ElAvatar :size="34">user</ElAvatar>
      </section>
    </header>
    <ElSkeleton animated :loading="store.currentDocState.isLoading">
      <template #template>
        <ElSkeleton />
      </template>
      <template #default>
        <main class="cl-book__main">
          <template v-if="store.currentDocState.docList.length > 0">
            <h1>目录</h1>
            <CatalogueTree v-for="item in store.currentDocState.docList" :item="item" :key="item.id" />
          </template>
          <template v-else>
            <ElEmpty description="知识库为空"></ElEmpty>
          </template>
        </main>
      </template>
    </ElSkeleton>
  </section>
</template>

<style lang="scss" scoped>
.cl-book-wrap {
  margin: 0 auto;
  margin-top: 3rem;
  max-width: 42.5rem;
  padding: 1.5rem 2rem;

  box-sizing: border-box;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;

  .cl-book__header {

    .statistic-wrap,
    .collaborate-wrap {
      margin: 0.75rem 0;
      margin-left: 2.75rem;
    }

    .title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 1.75rem;

      .title-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-weight: 800;
        }
      }

      .title-setting {
        >.el-icon {
          margin: 0 0.5rem;
        }
      }
    }
  }

  .cl-book__main {
    padding: 1rem 1.5rem;
    min-height: 20rem;
  }
}
</style>
