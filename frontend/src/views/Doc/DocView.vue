<template>
  <v-md-editor
    ref="md"
    height="100%"
    v-model="docStore.currentDocState.content"
    :disabled-menus="[]"
    @upload-image="methods.handleUploadImage"
  ></v-md-editor>
</template>

<script setup>
import { useDocStore } from '@/stores/doc'
import { request } from '@/utils/request'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const docStore = useDocStore()
const route = useRoute()
const md = ref('')

const methods = {
  handleSave() {
    docStore.updateDoc()
  },
  /**
   *
   * @param event
   * @param insertImage
   * @param {File[]} files
   */
  handleUploadImage(event, insertImage, files) {
    files.forEach((item) => {
      // const formData = new FormData()
      // formData.append('name', item.name)
      // formData.append('img', item)
      request('/api/docImageUpload', {
        method: 'post',
        data: { img: item, name: item.name },
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '.jpg',
        },
      }).then((res) => {
        const { url, desc } = res.data
        insertImage({
          url,
          desc,
        })
      })
      // const { name } = item
      // const reader = new FileReader()
      // reader.readAsDataURL(item)

      // reader.onload = (e) => {
      //   const { result } = e.target

      //   insertImage({
      //     url: result,
      //     desc: name,
      //   })
      // }
    })
  },
  initDoc() {
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
      const clipboardData = e.clipboardData.items[0]
      if (clipboardData.type.indexOf('image/') === 0) {
        // const fileReader = new FileReader()
        // const file = clipboardData.getAsFile()
        // const url = fileReader.readAsDataURL(file)
        // fileReader.onload = (e) => {
        //   console.log(e.target.result)
        // }
      }
      // console.log(e.clipboardData.items[0], type)
    },
    { signal: controller.signal },
  )
})

onBeforeUnmount(() => {
  controller.abort()
})
</script>

<style lang="scss"></style>
