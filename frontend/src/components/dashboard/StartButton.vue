<script setup>
defineProps({
  button: Object,
})
</script>

<template>
  <div class="cl-start-btn" shadow="hover">
    <el-icon size="22"><component :is="button.icon" /></el-icon>
    <div class="button-info-wrap">
      <p class="button-title">
        <b>{{ button.title }}</b>
      </p>
      <p class="button-details">
        <small> {{ button.details }}</small>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cl-start-btn {
  cursor: pointer;

  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;

  flex: 1 0 15rem;
  max-width: 15rem;

  display: flex;
  align-items: center;

  transition: background-color 0.3s;

  .el-icon {
    padding: 0 0.5rem;
  }

  p {
    margin: 0;
  }

  .button-title {
    margin-bottom: 0.25rem;
    color: #606266;
  }

  .button-details {
    color: #909399;
  }

  &:hover {
    border-color: rgb(197.7, 225.9, 255);
    background-color: rgb(235.9, 245.3, 255);
  }
}
</style>
