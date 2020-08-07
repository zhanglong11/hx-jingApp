<template>
  <view class="container">
    <!--批注信息-->
    <block v-if="list.length">
      <view class="commentTitle">批注详情</view>
      <uni-card v-for="(item, index) of list" :key="item.id">
        <icon v-if="canDelete" class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index, item)" />
        <uni-form-item label="批注内容">
          <view>{{ item.content }}</view>
        </uni-form-item>
        <uni-form-item label="批注附件">
          <!--          <uni-attachment v-model="item.fileIds"></uni-attachment>-->
          <uni-file v-model="item.fileIds"></uni-file>
        </uni-form-item>
        <uni-form-item label="批注时间">
          <view>{{ item.createTime }}</view>
        </uni-form-item>
        <uni-form-item label="批注人">
          <view>{{ item.creatorName }}</view>
        </uni-form-item>
      </uni-card>
    </block>
    <!--添加批注-->
    <view v-if="addVisible">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card>
          <uni-form-item label="批注内容" props="content" isRequired>
            <textarea
              v-model.trim="form.content"
              class="commentContent"
              :maxlength="-1"
              placeholder="请输入批注内容"
              align="left"
              auto-height
            />
          </uni-form-item>
          <uni-form-item label="批注附件">
            <uni-file v-model="form.fileIds" edit></uni-file>
            <!--<uni-attachment v-model="form.fileIds" edit></uni-attachment>-->
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleAdd">确 定</button>
      </view>
    </view>
  </view>
</template>

<script>
import Api from '@/api/comment'
export default {
  name: 'UniComment',
  components: {},
  props: {
    id: {
      type: String,
      default: '',
      required: true
    },
    type: {
      type: String,
      default: '',
      required: true
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      addVisible: false,
      baseData: {
        dataId: this.id,
        module: this.type,
        projectId: wx.getStorageSync('projectId')
      },
      form: {
        content: '',
        fileIds: ''
      },
      rules: {
        content: { required: true }
      }
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      let res = await Api.queryCommonCommentList(this.baseData)
      this.list = res.data.records || []
    },
    showAdd() {
      this.addVisible = true
      this.form = {}
    },
    async handleAdd() {
      let res = await this.$refs.form.validate()
      if (!this.form.content) {
        this.$utils.showToast('请输入批注内容')
        return
      }
      await Api.addCommonComment({ ...this.baseData, ...this.form })
      this.fly[Api[this.type].key].post(Api[this.type].url, { id: this.id, commentStatus: 1 })
      this.$utils.showToast('添加成功')
      this.addVisible = false
      this.$emit('success')
      await this.getList()
    },
    //删除
    async handleDeleteItem(index, item) {
      await Api.deleteCommonComment(item.id)
      this.list.splice(index, 1)
      if (this.list.length === 0) {
        this.fly[Api[this.type].key].post(Api[this.type].url, { id: this.id, commentStatus: 0 })
      }
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-comment.less';
</style>
