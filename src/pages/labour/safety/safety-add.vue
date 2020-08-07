<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body-details">
        <uni-card>
          <uni-form-custom ref="form" :rules="rules" :model="form">
            <uni-form-item label="培训主题" prop="trainingTheme">
              <input v-model="form.trainingTheme" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="培训机构">
              <input v-model="form.trainingOrgan" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="培训讲师">
              <input v-model="form.lecturer" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="培训地址">
              <input v-model="form.address" />
            </uni-form-item>
            <uni-form-item label="培训开始时间">
              <uni-date-picker v-model="form.trainingTime" fields="minute"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="培训课时">
              <input v-model="form.trainingHour" placeholder="请输入" type="number" />
            </uni-form-item>
            <uni-form-item label="培训内容" type="textarea" align="left">
              <textarea v-model="form.trainingContent" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
            <uni-form-item label="参与培训的人员" isLink>
              <uni-select-user v-model="form.totalEmployee" multiple />
            </uni-form-item>
            <uni-form-item label="合格人员" isLink>
              <uni-select-user v-model="form.qualifiedEmployee" multiple :canChooseUserIds="form.totalEmployee" />
            </uni-form-item>
            <uni-form-item label="不合格人员" isLink>
              <uni-select-user v-model="form.unqualifiedEmployee" multiple :canChooseUserIds="form.totalEmployee" />
            </uni-form-item>
          </uni-form-custom>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="submit()">保存</button>
        </view>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'SafetyAdd',
  data() {
    return {
      id: '',
      form: {
        projectId: uni.getStorageSync('projectId')
      },
      isLoading: false,
      rules: {
        trainingTheme: { required: true }
      }
    }
  },
  onLoad(option) {
    this.id = option.id
    if (this.id) {
      this.$utils.setTitle('编辑培训')
      this.refresh()
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.labourSafety.get('training/get/' + this.id).then(res => {
        this.form = res.data
      })
    },
    async submit() {
      await this.$refs.form.validate()
      await this.fly.labourSafety.post('training/' + (this.id ? 'update' : 'add'), this.form).then()
      this.$utils.showToast('保存成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./safety.less');
</style>
