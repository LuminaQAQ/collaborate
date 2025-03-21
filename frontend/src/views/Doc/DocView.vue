<template>
  <v-md-editor
    ref="md"
    height="100%"
    v-model="docStore.currentDocState.content"
    :disabled-menus="[]"
    @upload-image="handleUploadImage"
  ></v-md-editor>
</template>

<script setup>
import { useDocStore } from '@/stores/doc'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const docStore = useDocStore()
const route = useRoute()
const md = ref('')

const methods = {
  handleSave: () => {
    docStore.updateDoc()
  },
  initDoc: () => {
    docStore.fetchDoc()
  },
}

const controller = new AbortController()
onMounted(() => {
  methods.initDoc()
  watch(route, methods.initDoc)

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()

        methods.handleSave()
      }
    },
    { signal: controller.signal },
  )

  document.addEventListener(
    'paste',
    (e) => {
      console.log(new FileReader(e.clipboardData.items[0].getAsFile()))
    },
    { signal: controller.signal },
  )
})

onBeforeUnmount(() => {
  controller.abort()
})
</script>

<style lang="scss"></style>
