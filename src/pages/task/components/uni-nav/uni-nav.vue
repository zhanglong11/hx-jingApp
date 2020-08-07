<template>
  <view class="uni-add add" :class="{ opened: opened }" @click="handleClick">
    <image src="../../../../static/images/task-nav.png" class="icon" />
  </view>
</template>
<script>
export default {
  props: {
    // 是否带有切换状态
    toggle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    handleClick() {
      if (this.toggle) {
        this.opened = !this.opened
      }
      this.$emit('click', this.opened)
    }
  }
}
</script>
<style lang="less" scoped>
@import 'uni-nav.less';
</style>
