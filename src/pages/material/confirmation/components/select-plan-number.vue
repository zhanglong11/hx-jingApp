<template>
  <textarea
    :value="planValue"
    auto-height
    class="align-right"
    :placeholder="placeholder"
    disabled
    @click="toDetails"
  />
</template>

<script>
export default {
  name: 'SelectPlanNumber',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      key: '',
      planValue:'',
    }
  },
  created() {
    uni.$on('update:list', data => {
      this.planValue=data.planId
      this.$emit('change', {
        ids: data.planId
      })
    })
  },
  methods: {
    // 跳转甲供材计划单列表
    toDetails() {
      this.$utils.toUrl(
        `/pages/material/confirmation/list`
      )
    }
  }
}
</script>

<style scoped lang="less">

</style>
