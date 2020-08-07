<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card>
          <ul class="list">
            <li @click="$utils.toUrl('/pages/safe/index')">
              <image class="list-icon" src="/static/images/application/anquanjiancha.png"></image>
              <p>安全检查</p>
            </li>
            <li @click="toUrl('/pages/safe/statistics/chartview/index')">
              <image class="list-icon" src="/static/images/application/anquantongji.png"></image>
              <p>安全统计</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'ApplicationSafe',
  data() {
    return {}
  },
  methods: {
    refresh() {},
    toUrl(url) {
      this.$utils.toUrl(url)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
