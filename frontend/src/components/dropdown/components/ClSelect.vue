<script setup>
const emits = defineEmits(['update:modelValue'])

defineProps({
  modelValue: Number || String,
  options: Object,
})
</script>

<template>
  <select
    class="cl-select"
    :value="modelValue"
    @change="emits('update:modelValue', $event.target.value)"
  >
    <slot></slot>
  </select>
</template>

<style lang="scss" scoped>
.cl-select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;

  &:focus {
    outline: none;
  }
}
</style>
