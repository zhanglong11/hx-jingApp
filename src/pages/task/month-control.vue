<template>
  <div class="main is-white">
    <div class="tabs-wrap">
      <uni-tabs v-model="type">
        <uni-tab-pane name="1" label="月度进度"></uni-tab-pane>
        <uni-tab-pane name="2" label="月度耗材"></uni-tab-pane>
      </uni-tabs>
    </div>
    <!--    月度进度开始-->
    <MonthProgress v-if="type === '1'" />
    <MonthMaterial v-if="type === '2'" />
  </div>
</template>

<script>
import MonthProgress from '@/pages/task/components/MonthProgress'
import MonthMaterial from '@/pages/task/components/MonthMaterial'

export default {
  components: { MonthProgress, MonthMaterial },
  data() {
    return {
      type: '1'
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import url('./month-control.less');
</style>
