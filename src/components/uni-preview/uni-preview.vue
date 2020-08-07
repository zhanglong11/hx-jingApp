<template>
  <div class="wrapper">
    <div class="image-wrapper">
      <image v-if="imgReg.test(fileInfo.fileNameSuffix)" :src="fileInfo.fileUrl" />
      <image v-else-if="fileInfo.fileNameSuffix === 'pdf'" src="./assets/pdf.png" />
      <image v-else-if="xlsReg.test(fileInfo.fileNameSuffix)" src="./assets/xlsx.png" />
      <image v-else-if="docReg.test(fileInfo.fileNameSuffix)" src="./assets/doc.png" />
      <image v-else-if="fileInfo.fileNameSuffix === 'ppt'" src="./assets/ppt.png" />
      <image v-else-if="fileInfo.fileNameSuffix === 'psd'" src="./assets/psd.png" />
      <image v-else-if="zipReg.test(fileInfo.fileNameSuffix)" src="./assets/zip.png" />
      <image v-else src="./assets/other.png" />
    </div>
    <slot>
      <div class="preview-btn" @click="openDocument">预览</div>
    </slot>
  </div>
</template>
<script>
import { fileUrl } from '@/utils/http'
import { without } from 'lodash'
export default {
  components: {},
  props: {
    fileId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileInfo: {},
      imgReg: /^(jpg|png|jpeg|gif|webp|bmp)$/i,
      videoReg: /^(mp4|mkv|ogg|webm)$/i,
      docReg: /^(doc|docx)$/i,
      xlsReg: /^(xls|xlsx)$/i,
      zipReg: /^(rar|zip|7z)$/i
    }
  },
  computed: {},
  watch: {
    fileId: {
      immediate: true,
      handler() {
        this.refresh()
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      if (!this.fileId) {
        this.fileInfo = {}
      } else {
        this.fileInfo = await this.fly.file.post('file/manage/list', [this.fileId]).then(res => res.data[0])
      }
    },
    openDocument() {
      if (this.imgReg.test(this.fileInfo.fileNameSuffix)) {
        uni.previewImage({
          current: this.fileInfo.fileUrl,
          urls: [this.fileInfo.fileUrl]
        })
        return
      }
      uni.showLoading({
        title: '正在加载文件'
      })
      uni.downloadFile({
        url: this.fileInfo.fileUrl,
        success: function(res) {
          uni.hideLoading()
          var filePath = res.tempFilePath
          uni.openDocument({
            filePath: filePath,
            success: function(res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import './uni-preview.less';
</style>
