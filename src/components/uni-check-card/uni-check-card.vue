<template>
  <div v-if="hasPower" style="padding: 30rpx">
    <view class="card-title" style="margin-top: 0;">审核</view>
    <uni-card isForm>
      <!-- 加载自定义表单 start -->
      <template v-for="(items, i) in jsonData.list">
        <uni-form-item v-if="items.type === 'input'" :key="i" :label="items.name" :isRequired="items.options.required">
          <input v-model.trim="formData[items.model]" placeholder="请输入" />
        </uni-form-item>

        <uni-form-item v-if="items.type === 'radio'" :key="i" :label="items.name" :isRequired="items.options.required">
          <radio-group v-model="formData[items.model]" @change="e => (formData[items.model] = e.detail.value)">
            <label v-for="item in items.options.options" :key="item.value" style="margin-right: 20rpx;">
              <radio :value="item.value" :checked="item.value == formData[items.model]" />{{ item.label }}
            </label>
          </radio-group>
        </uni-form-item>

        <uni-form-item
          v-if="items.type === 'textarea'"
          :key="i"
          type="textarea"
          align="left"
          :label="items.name"
          :isRequired="items.options.required"
        >
          <textarea v-model.trim="formData[items.model]" :maxlength="-1" placeholder="请输入" auto-height />
        </uni-form-item>
      </template>
      <!-- <fm-generate-form ref="generateFormRef" :data="jsonData" isApp style="width: 70%;" /> -->
      <!-- 加载自定义表单 end -->
    </uni-card>
    <button class="button" type="primary" style="margin-top: 30rpx;" @click="audit()">
      审批
    </button>
  </div>
</template>

<script>
import { workFlowApi } from '@/api/work-flow'
import { mapGetters } from 'vuex'
export default {
  name: 'CheckCard',
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    receiptNumber: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      jsonData: {},
      formData: {},
      hasPower: false // 是否有审批权限
    }
  },
  computed: {
    ...mapGetters(['userName']),
    // 我的待办
    taskTodo() {
      return this.$store.state.userPower.taskTodo
    }
  },
  mounted() {
    this.getPower()
  },
  methods: {
    // 检测是否有审批权限
    getPower() {
      this.$store.commit('getTaskTodo', () => {
        this.hasPower = this.taskTodo.includes(this.id)
        // 获取我的待办
        if (this.hasPower) {
          this.getTaskForm()
        }
      })
    },
    // 获取任务表单
    async getTaskForm() {
      if (!this.id) {
        return
      }
      let result = await workFlowApi.getTaskForm(this.id)
      let datas = result.data
      if (!datas) {
        return
      }
      let jsonData = JSON.parse(datas.template)
      this.jsonData = jsonData
      let list = jsonData.list || []
      list.map(items => {
        this.formData[items.model] = items.options.defaultValue
      })
      this.getFormData()
    },
    // 判断表单数据
    getFormData() {
      // 自动填充审批人
      if (this.formData.auditPerson === '') {
        this.formData.auditPerson = this.userName
      }
      // 自动填充收货数量
      if (this.formData.receiptNumber === '') {
        this.formData.receiptNumber = this.receiptNumber
      }
    },
    // 审批 验证表单-异步获取表单数据
    audit() {
      //let formData = await this.$refs.generateFormRef.getData()
      //this.auditSuccess(formData)
      let checked = true
      this.jsonData.list.map(items => {
        if (items.options.required && !this.formData[items.model]) {
          this.$utils.showToast(items.rules[0].message)
          checked = false
          return
        }
      })
      if (!checked) {
        return
      }
      this.auditSuccess(this.formData)
    },
    // 动态表单审批流程
    async auditSuccess(formData) {
      if (!this.id) {
        return
      }
      await workFlowApi.completeTask(this.id, formData)
      this.$utils.showToast('审核成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>
<style lang="less" scoped>
.checkWrapper {
  display: flex;
  .checkForm {
    flex: 1;
    .inputStyle {
      width: 500px;
    }
  }
  .checkUpload {
    flex: 1;
  }
}
/deep/ .el-upload {
  text-align: left !important;
}
</style>
