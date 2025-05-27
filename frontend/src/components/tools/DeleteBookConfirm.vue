<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { watch } from 'vue'

const { modelValue, bookInfo } = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  bookInfo: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['confirm', 'close'])

watch(
  () => modelValue,
  (val) => {
    if (val) {
      showDeleteConfirm()
    }
  },
)

const showDeleteConfirm = () => {
  ElMessageBox.confirm(`确定要删除知识库「${bookInfo.name}」吗？此操作不可撤销！`, '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emits('confirm', bookInfo)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
    .finally(() => {
      emits('close')
    })
}
</script>
