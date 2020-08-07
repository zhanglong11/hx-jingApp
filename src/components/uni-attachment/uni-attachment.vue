<template>
  <div>
    <ul v-if="edit" class="upload-button-list">
      <template v-if="isExcel">
        <li @click="uploadExcel">
          <p>+</p>
          <p>表格</p>
        </li>
      </template>
      <template v-else>
        <li v-if="uploadType.includes('image')" @click="uploadImage">
          <p>+</p>
          <p>图片</p>
        </li>
        <li v-if="uploadType.includes('video') || hasVideo" @click="uploadVideo">
          <p>+</p>
          <p>视频</p>
        </li>
        <li v-if="uploadType.includes('other')" @click="uploadOther">
          <p>+</p>
          <p>其它</p>
        </li>
      </template>
    </ul>
    <ul v-if="imageList.length" class="file-list">
      <li v-for="file in imageList" :key="file.id">
        <image :src="file.fileUrl + '?x-oss-process=style/w140_h140'" @click="previewImage(file)" />
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <ul v-if="videoList.length" class="video-list file-list">
      <li v-for="file in videoList" :key="file.id">
        <div class="video-con">
          <video :src="file.fileUrl" />
        </div>
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <ul v-if="documentList.length" class="document-list file-list">
      <li v-for="file in documentList" :key="file.id">
        <image v-if="file.fileNameSuffix === 'pdf'" src="./assets/pdf.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'xls'" src="./assets/xls.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'xlsx'" src="./assets/xlsx.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'doc'" src="./assets/doc.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'docx'" src="./assets/doc.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'ppt'" src="./assets/ppt.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'psd'" src="./assets/psd.png" />
        <image v-else-if="file.fileNameSuffix === 'zip'" src="./assets/zip.png" />
        <image v-else-if="file.fileNameSuffix === 'rar'" src="./assets/zip.png" />
        <image v-else src="./assets/other.png" />
        <p class="name">{{ file.fileName }}</p>
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <lFile ref="lFile" :isExcel="isExcel" @up-success="uploadSuccess" />
  </div>
</template>
<script>
const imgReg = /(.*)\.(jpg|png|jepg|gif|webp)$/i
const videoReg = /(.*)\.(mp4|mkv|ogg|webm)$/i
const officeReg = /(.*)\.(doc|xls|xlsx|docx|ppt|pptx)$/i
const pdfTxtReg = /(.*)\.(pdf|txt)$/i
const documentReg = /(.*)\.(doc|xls|xlsx|docx|ppt|pptx|pdf|txt|rar|zip)$/i
const imgTypeReg = /(png|jpg|gif)/i
const videoTypeReg = /(mp4|mkv|ogg|mov|avi|webm)/i
import lFile from '@/components/l-file/l-file.vue'
import { fileUrl } from '@/utils/http'
import { without } from 'lodash'
export default {
  components: {
    lFile
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    // 是否可编辑
    edit: {
      type: Boolean,
      default: false
    },
    isExcel: {
      type: Boolean,
      default: false
    },
    hasVideo: {
      type: Boolean,
      default: false
    },
    // 上传类型
    uploadType: {
      type: String,
      default: 'image,video,other'
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    imageList() {
      return this.fileList.filter(e => e.fileType === 'image' || e.contentType.includes('image'))
    },
    videoList() {
      let videoList = this.fileList.filter(e => e.fileType === 'video' || e.contentType.includes('video'))
      // console.log('videoList', videoList)
      return videoList
    },
    documentList() {
      return this.fileList.filter(e => e.fileType === 'document')
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.refresh()
      }
    }
  },
  methods: {
    async refresh() {
      if (!this.value) {
        this.fileList = []
      } else {
        let fileList = await this.fly.file.post('file/manage/list', this.value.split(',')).then(res => res.data)
        fileList.forEach(e => {
          e.fileNameSuffix = e.fileNameSuffix.toLowerCase()
          if (imgReg.test(e.fileUrl)) {
            e.fileType = 'image'
          } else if (videoReg.test(e.fileUrl)) {
            e.fileType = 'video'
          } else if (documentReg.test(e.fileUrl)) {
            e.fileType = 'document'
          }
        })
        this.fileList = fileList
      }
    },
    async remove(file) {
      let fileIds = this.value.split(',')
      this.$emit('input', without(fileIds, file.id).join(','))
    },
    openDocument(file) {
      uni.showLoading({
        title: '正在加载文件'
      })
      uni.downloadFile({
        url: file.fileUrl,
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
    },
    previewImage(file) {
      uni.previewImage({
        current: file.fileUrl,
        urls: this.fileList.filter(e => imgTypeReg.test(e.fileNameSuffix)).map(e => e.fileUrl)
      })
    },
    uploadImage() {
      uni.chooseImage({
        success: async chooseImageRes => {
          uni.showLoading({ title: '正在上传' })
          const tempFilePaths = chooseImageRes.tempFilePaths
          for (let filePath of tempFilePaths) {
            await uni
              .uploadFile({
                header: {
                  'x-access-token': this.token
                },
                name: 'file',
                url: fileUrl + '/file/commonFile/upload',
                filePath: filePath
              })
              .then(([err, uploadFileRes]) => {
                const res = JSON.parse(uploadFileRes.data)
                this.$emit('input', this.value ? this.value + ',' + res.data : res.data)
              })
              .finally(() => {
                uni.hideLoading()
              })
          }
          uni.hideLoading()
        }
      })
    },
    uploadVideo() {
      uni.chooseVideo({
        success: chooseVideoRes => {
          uni.showLoading({ title: '正在上传' })
          const tempFilePath = chooseVideoRes.tempFilePath
          uni
            .uploadFile({
              header: {
                'x-access-token': this.token
              },
              url: fileUrl + '/file/commonFile/upload',
              name: 'file',
              filePath: tempFilePath
            })
            .then(([err, uploadFileRes]) => {
              const res = JSON.parse(uploadFileRes.data)
              this.$emit('input', this.value ? this.value + ',' + res.data : res.data)
            })
            .finally(() => {
              uni.hideLoading()
            })
        }
      })
    },
    uploadOther() {
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: '/cim6d-file-storage-dev' + '/file/commonFile/upload',
        name: 'file',
        header: {
          'x-access-token': this.token
        }
      })
    },
    uploadExcel() {
      if (this.fileList.length >= 1) {
        this.$utils.showToast('只能选一个')
        return false
      }
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: fileUrl + '/file/commonFile/upload',
        name: 'file',
        header: {
          'x-access-token': this.token,
          type: '.xls,.xlsx'
        }
      })
    },
    uploadSuccess(res) {
      this.$emit('input', this.value ? this.value + ',' + res.data.id : res.data.id)
      this.$emit('uploadListSuccess', res.data.id)
    }
  }
}
</script>
<style lang="less" scoped>
@import './uni-attachment.less';
</style>
