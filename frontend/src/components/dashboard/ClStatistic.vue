<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { ArrowRight, CaretBottom, CaretTop, Warning } from '@element-plus/icons-vue'

const userStore = useUserStore()

const valueFormatter = (val) => {
  if (val / 10000 > 1) return (val / 10000).toFixed(1) + 'w'
  else if (val / 1000 > 1) return (val / 1000).toFixed(1) + 'k'
  else return val
}
</script>

<template>
  <h1 class="">
    👏 {{ userStore.user.username || '' }}，这是你和云迹相伴的第
    {{ ((new Date() - new Date(userStore.user.created_at)) / 1000 / 60 / 60 / 24).toFixed(0) || 0 }}
    天
  </h1>
  <el-row :gutter="24" style="margin: 0">
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="98500" :formatter="valueFormatter">
          <template #title>
            <div style="display: inline-flex; align-items: center">创作天数</div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="693700" :formatter="valueFormatter">
          <template #title>
            <div style="display: inline-flex; align-items: center">创作字数</div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="72000" :formatter="valueFormatter">
          <template #title>
            <div style="display: inline-flex; align-items: center">内容更新</div>
          </template>
        </el-statistic>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}
</style>
