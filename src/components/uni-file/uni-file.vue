<template>
  <div>
    <div v-if="fileList.length" class="fileList">
      <div v-for="(item, index) of fileList" :key="item.id || Math.random()" class="item">
        <span class="ellipsis" :title="item.fileName">{{ item.fileName }}</span>
        <span @click="handleDownload(item)">下载</span><span v-if="edit" @click="remove(item)">删除</span>
      </div>
    </div>
    <view v-if="edit" class="btn-wrap">
      <!--      <button class="button" type="primary" @click="uploadOther">上传</button>-->
      <button class="button" type="primary" @click="uploadImage">上传</button>
    </view>
    <lFile ref="lFile" @up-success="uploadSuccess" />
  </div>
</template>
<script>
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
        fileList.forEach(e => {})
        this.fileList = fileList
      }
    },
    async remove(item) {
      let fileIds = this.value.split(',')
      this.$emit('input', without(fileIds, item.id).join(','))
    },
    handleDownload(item) {
      uni.downloadFile({
        url: item.fileUrl,
        success: res => {
          console.log(res)
          if (res.statusCode === 200) {
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: resData => {
                this.$utils.showToast('下载成功')
              }
            })
          }
        }
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
    uploadOther() {
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: fileUrl + '/file/commonFile/upload',
        name: 'file',
        header: {
          'x-access-token': this.token
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
@import './uni-file.less';
</style>
