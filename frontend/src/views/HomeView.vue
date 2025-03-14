<script setup>
import ClHeader from '@/components/layout/ClHeader.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <cl-header />
      <el-container>
        <el-aside width="200px"> aside </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss">
.common-layout {
  width: 100%;
  height: 100%;

  .el-container {
    height: 100%;
  }

  > .el-container {
    flex-direction: column;
  }
}
</style>
