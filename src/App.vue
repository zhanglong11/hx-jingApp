<script>
export default {
  onLaunch: function() {
    // #ifdef APP-PLUS
    // 只在APP显示引导页
    if (!uni.getStorageSync('guide')) {
      this.$utils.toUrl('/pages/guide/index', 1)
      uni.setStorageSync('guide', 1)
    }
    // #endif

    //console.log('App Launch')
  },
  onHide: function() {
    //console.log('App Hide')
  }
}
</script>
<style lang="less">
@import url('components/uni-tree/ly-tree.css');
@import '~@/styles/index.less';
@import '~@/styles/base.less';
@import '~@/static/fonts/iconfont.css';
@import '~@/styles/main.less';
</style>
