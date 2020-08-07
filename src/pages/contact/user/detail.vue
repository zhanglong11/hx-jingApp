<template>
  <div class="main">
    <div class="card summary">
      <uni-avatar :user="form" :size="160"></uni-avatar>
      <h1>{{ form.realName }}</h1>
      <p>项目部 项目经理</p>
      <ul>
        <image src="/static/images/phone.png" @click="makePhoneCall"></image>
        <image src="/static/images/message.png" @click="sendMessage"></image>
        <image src="/static/images/email.png" @click="sendEmail"></image>
      </ul>
    </div>
    <div class="card">
      <uni-form-item label="性别" align="left">{{ ['男', '女'][form.sex - 1] }}</uni-form-item>
      <uni-form-item label="生日" align="left">{{ form.birthday }}</uni-form-item>
      <uni-form-item label="邮箱" align="left">{{ form.email }}</uni-form-item>
      <uni-form-item label="手机" align="left">{{ form.mobile }}</uni-form-item>
      <uni-form-item label="微信" align="left">{{ form.wechatNumber }}</uni-form-item>
      <uni-form-item label="座机/分机" align="left">{{ form.telephone }}</uni-form-item>
    </div>
    <div class="card">
      <uni-form-item label="工号" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="籍贯" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="毕业院校" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="毕业时间" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="学历" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="所学专业" align="left">{{ form.aaa }}</uni-form-item>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/user'
import { find } from 'lodash'
export default {
  name: 'Detail',
  data() {
    return {
      id: null,
      form: {
        realName: ''
      }
    }
  },
  async created() {
    this.form = await userApi.getUser(this.id)
  },
  mounted() {},
  onLoad(options) {
    this.id = options.id
  },
  methods: {
    refresh() {},
    submit() {},
    remove() {},
    makePhoneCall() {
      if (!this.form.mobile) {
        return false
      }
      uni.makePhoneCall({
        phoneNumber: this.form.mobile
      })
    },
    sendMessage() {
      // #ifdef APP-PLUS
      let msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS)
      msg.to = ['10086']
      msg.body = '101'
      plus.messaging.sendMessage(msg)
      // #endif
    },
    sendEmail() {
      // #ifdef APP-PLUS
      let msg = plus.messaging.createMessage(plus.messaging.TYPE_EMAIL)
      msg.to = ['test@163.com']
      msg.subject = '测试邮件'
      msg.body = '你好啊'
      plus.messaging.sendMessage(
        msg,
        function() {
          console.log('Send success!')
        },
        function() {
          console.log('Send failed!')
        }
      )
      // #endif
    }
  }
}
</script>

<style scoped lang="less">
@import url('./detail.less');
</style>
