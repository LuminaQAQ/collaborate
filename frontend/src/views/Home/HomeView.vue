<script setup>
import ClHeader from '@/components/layout/ClHeader.vue'
import ClAside from '@/components/layout/ClAside.vue'
import { onMounted } from 'vue'
import { requestHomeData } from '@/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  requestHomeData()
    .then((res) => {
      const { username, avatar, created_at } = res.data.user

      userStore.user.username = username
      userStore.user.avatar = avatar
      userStore.user.created_at = created_at
    })
    .catch((err) => {})
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <cl-header />
      <el-container>
        <ClAside />
        <el-main>
          <RouterView />
        </el-main>
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

  .collapse-icon {
    position: absolute;
    top: 50%;
    right: 0;

    padding: 0.5rem 0;
    background-color: #f2f2f2;
    border-radius: 999px;

    transform: translate(0, -100%);
    perspective: 10px;
    z-index: 2;
    cursor: pointer;
  }
}
</style>
