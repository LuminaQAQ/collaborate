<script setup>
import ClStatistic from '@/components/dashboard/ClStatistic.vue'
import StartButtonGroup from '@/components/dashboard/StartButtonGroup.vue'
import { ref } from 'vue'

const value = ref('编辑过')

const options = ['编辑过', '浏览过', '我点赞的', '我评论过']
</script>

<template>
  <div class="cl-dashboard-wrap">
    <ClStatistic />
    <StartButtonGroup />
    <h1>文档</h1>
    <div class="flex flex-col items-start gap-4">
      <el-segmented v-model="value" :options="options" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  margin: 1.5rem 0 1rem 0;
}
</style>
