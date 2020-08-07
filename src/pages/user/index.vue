<template>
  <view class="main is-white">
    <view class="main-header" @click="toLogin()">
      <view class="avatar">
        <image :src="headImage" class="user-avatar" />
      </view>
      <view class="base-info">
        <view class="name">
          <view class="nickName">{{ token ? userName : '游客' }}</view>
          <view class="roleName">{{ token ? roleTexts : '去登录' }}</view>
        </view>
        <view class="phone">{{ mobile }}</view>
      </view>
      <view v-if="!token" class="arrow-right">
        <image class="img" src="../../static/images/icon/@2x/icon-arrow-right-2.png"></image>
      </view>
      <div class="header-line"></div>
    </view>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item
            label="我的消息"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/user/message')"
          ></uni-form-item>
        </uni-card>

        <uni-card>
          <!-- 精装修版本功能 start -->
          <template v-if="$appType === 1">
            <uni-form-item
              v-if="$hasPower('ConstructionLogSmartDecoration')"
              label="施工日志"
              icon="../../static/images/icon/@2x/icon-log.png"
              isLink
              @click="$utils.toUrl('/pages/log-SmartDecoration/log')"
            ></uni-form-item>
          </template>
          <!-- 精装修版本功能 end -->

          <!-- 施工版本功能 start -->
          <template v-if="$appType === 3">
            <uni-form-item
              label="施工日志"
              icon="../../static/images/icon/@2x/icon-log.png"
              isLink
              @click="$utils.toUrl('/pages/log/log')"
            ></uni-form-item>
          </template>
          <!-- 施工版本功能 end -->

          <template v-if="$appType === 1">
            <uni-form-item
              v-if="$hasPower('DecorationProgressSmartDecoration')"
              label="工序管理"
              icon="../../static/images/icon/@2x/icon-step.png"
              isLink
              @click="$utils.toUrl('/pages/task/progress')"
            ></uni-form-item>
          </template>
          <uni-form-item
            v-if="$hasPower('Quality')"
            label="质量管理"
            icon="../../static/images/icon/@2x/icon-quality.png"
            isLink
            @click="$utils.toUrl('/pages/application/application-quality')"
          ></uni-form-item>
          <uni-form-item
            v-if="$hasPower('Safe')"
            label="安全管理"
            icon="../../static/images/icon/@2x/icon-safe.png"
            isLink
            @click="$utils.toUrl('/pages/application/application-safe')"
          ></uni-form-item>
          <template v-if="$appType === 3">
            <uni-form-item
              label="物资设备"
              icon="../../static/images/icon/@2x/icon-material.png"
              isLink
              @click="$utils.toUrl('/pages/application/application-material?type=0')"
            ></uni-form-item>
          </template>
          <template v-if="$appType === 1 && $hasPower('SuppliesSmartDecoration')">
            <uni-form-item
              label="材料管理"
              icon="../../static/images/icon/@2x/icon-material.png"
              isLink
              @click="$utils.toUrl('/pages/application/application-material?type=1')"
            ></uni-form-item>
          </template>
          <uni-form-item
            v-if="$hasPower('DataManage')"
            label="我的文档"
            icon="../../static/images/icon/@2x/icon-file.png"
            isLink
            @click="$utils.toUrl('/pages/document/index')"
          ></uni-form-item>
        </uni-card>

        <uni-card>
          <uni-form-item
            label="企业信息"
            icon="../../static/images/icon/@2x/icon-company.png"
            isLink
            @click="$utils.toUrl('/pages/enterpriseInfo/index')"
          ></uni-form-item>
          <uni-form-item
            label="意见反馈"
            icon="../../static/images/icon/@2x/icon-opinion.png"
            isLink
            @click="$utils.toUrl('/pages/adviceFeedback/index')"
          ></uni-form-item>
          <uni-form-item
            label="关于应用"
            icon="../../static/images/icon/@2x/icon-application.png"
            isLink
            @click="$utils.toUrl('/pages/about/index')"
          ></uni-form-item>
        </uni-card>
        <view v-if="token" class="btn-wrapper">
          <button class="button" type="primary" @click="handleLogOut">退出登录</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['projectId', 'userName', 'roleTexts', 'telephone', 'mobile']),
    token() {
      return this.$store.state.user.token
    },
    projectId() {
      return this.$store.state.project.projectId
    },
    userId() {
      return this.$store.state.user.userId
    },
    headImage() {
      return this.$store.state.user.headImage || '../../static/images/default-user.png'
    }
  },
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(`/pages/user/setting`)
  },
  methods: {
    //退出操作
    handleLogOut() {
      // 调用接口成功后
      this.$store.commit('user/logOut')
    },
    // 跳转登录
    toLogin() {
      if (this.token) {
        return
      }
      this.$utils.toUrl('/pages/login/login')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
