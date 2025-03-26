<script setup>
import CatalogueTree from '@/components/catalogue/CatalogueTree.vue'
import router from '@/router'
import { useDocStore } from '@/stores/doc'
import { More, Notebook, Share, Star } from '@element-plus/icons-vue/dist/index.js'
import { ElAvatar, ElIcon } from 'element-plus'

const store = useDocStore()
</script>

<template>
  <section class="cl-book-wrap">
    <header class="cl-book__header">
      <section class="title-wrap">
        <div class="title-info">
          <ElIcon style="margin-right: 1rem" color="#409eff"><Notebook /> </ElIcon>
          <span class="title">{{ store.currentDocState.bookName }}</span>
        </div>
        <div class="title-setting">
          <ElIcon size="20"><Star /> </ElIcon>
          <ElIcon size="20"><Share /> </ElIcon>
          <ElIcon size="20"><More /> </ElIcon>
        </div>
      </section>
      <section class="statistic-wrap">
        <small>{{ store.currentDocState.bookDesc || '暂无简介' }}</small>
      </section>
      <section class="collaborate-wrap">
        <ElAvatar :size="30">user</ElAvatar>
      </section>
    </header>
    <main class="cl-book__main" v-if="store.currentDocState.docList.length">
      <!-- <section
        class="cl-doc-list-item"
        v-for="item in store.currentDocState.docList"
        :key="item.id"
        @click="router.push(`/${item.email}/${item.book_id}/${item.id}`)"
      >
        <span>{{ item.title }}</span>
        <span class="doc-list-chain"></span>
        <span>{{ item.created_at.slice(0, 10) }}</span>
      </section> -->
      <CatalogueTree v-for="item in store.currentDocState.docList" :item="item" />
    </main>
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

  .cl-book__header {
    margin-bottom: 2rem;
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
        > .el-icon {
          margin: 0 0.5rem;
        }
      }
    }
  }

  .cl-book__main {
    padding: 1rem 1.5rem;
  }
}
</style>
