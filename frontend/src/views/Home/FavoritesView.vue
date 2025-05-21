<script setup>
import { ElAside, ElContainer, ElHeader, ElMain, ElText } from 'element-plus';

// TODOL 添加收藏功能
</script>

<template>
  <ElContainer class="cl-collections-view">
    <ElHeader class="cl-collections-view__header">
      <section class="cl-collections-view__header__title">
        <h3 style="margin: 0;">收藏</h3>
      </section>
      <section class="cl-collections-view__header__add">
        <ElText>添加</ElText>
      </section>
    </ElHeader>
    <ElContainer>
      <ElAside class="cl-collections-view__aside" width="200px">222</ElAside>
      <ElMain class="cl-collections-view__main">
        <el-table :data="tableData" :default-sort="{ prop: 'name', order: 'descending' }" style="width: 100%">
          <el-table-column prop="name" label="名称" width="180" sortable />
        </el-table>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.cl-collections-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0;
  padding-bottom: 1.5rem;

  height: auto;
}

.cl-collections-view__aside {}

.cl-collections-view__main {
  padding: 0;
}
</style>
