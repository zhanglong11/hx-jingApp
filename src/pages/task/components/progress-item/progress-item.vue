<template>
  <view
    class="card"
    :class="{ finished: dataItem.actualEndTime, 'not-started': !dataItem.actualStartTime }"
    @click="onClick(dataItem)"
  >
    <view class="card-header">
      <!-- 工序页面逻辑 start -->
      <template v-if="isWorkingProcedure">
        <view>{{ dataItem.floorRule }} {{ dataItem.mainProcedure }}</view>
        <view v-if="dataItem.postponeDays > 0" class="work-status delay">已延期{{ dataItem.postponeDays }}天</view>
        <view
          v-else
          class="work-status"
          :class="{ 'have-in': dataItem.status === 1, finished: dataItem.status === 2 }"
          >{{ dataItem.status | getWorkingStatus }}</view
        >
      </template>
      <!-- 工序页面逻辑 end -->

      <!-- 单体页面逻辑 start -->
      <template v-else-if="isUnit">
        <view>{{ dataItem.libraryName }}111</view>
        <view v-if="!dataItem.actualStartTime" class="no-start">
          未开始
        </view>
        <view v-if="dataItem.postponeDays > 0" class="work-status delay">已延期{{ dataItem.postponeDays }}天</view>
        <view v-else-if="!dataItem.postponeDays && dataItem.actualEndTime" class="work-status finished">已完成</view>
      </template>
      <!-- 单体页面逻辑 end -->

      <!-- 非工序页面逻辑 start -->
      <template v-else>
        <view>{{ dataItem.libraryName }}</view>
        <view v-if="!dataItem.actualStartTime" class="no-start">
          未开始
        </view>
        <view v-if="dataItem.postponeDays > 0" class="work-status delay">已延期{{ dataItem.postponeDays }}天</view>
        <view
          v-else-if="dataItem.finishedProcedureNum && dataItem.finishedProcedureNum === dataItem.totalProcedureNum"
          class="work-status finished"
          >已完成</view
        >
      </template>

      <!-- 非工序页面逻辑 end -->
    </view>
    <view v-if="dataItem.actualStartTime || dataItem.planStartTime" class="card-body">
      <view class="flex-item">
        <view>
          <text>计划开始:</text>
          <text class="target-start-time">
            {{ dataItem.planStartTime | formatData }}
          </text>
        </view>
        <view>
          <text>实际开始:</text>
          <text class="actual-start-time">
            {{ dataItem.actualStartTime | formatData }}
          </text>
        </view>
      </view>
      <view class="flex-item">
        <view>
          <text>计划结束:</text>
          <text class="target-end-time">
            {{ dataItem.planEndTime | formatData }}
          </text>
        </view>
        <view>
          <text>实际结束:</text>
          <text class="actual-end-time">{{ dataItem.actualEndTime | formatData }}</text>
        </view>
      </view>
    </view>
    <view v-if="dataItem.actualStartTime" class="card-footer">
      <!-- 工序页面逻辑 start -->
      <template v-if="isWorkingProcedure">
        <view class="progress-wrapper">
          <progress
            :percent="
              dataItem.status === 2 ? 100 : ((dataItem.finishedDuration || 0) / (dataItem.totalDuration || 0)) * 100
            "
            stroke-width="6"
            backgroundColor="#F4F4F9"
            :activeColor="dataItem.postponeDays || dataItem.status === 2 ? '#ccc' : '#829DF3'"
            border-radius="12"
          />
        </view>
        <text class="percent-text">{{ dataItem.finishedDuration || 0 }}/{{ dataItem.totalDuration || 0 }} 天</text>
      </template>
      <!-- 工序页面逻辑 end -->
      <!-- 非工序页面逻辑 start -->
      <template v-else>
        <view class="progress-wrapper">
          <progress
            :percent="
              dataItem.finishedProcedureNum && dataItem.finishedProcedureNum === dataItem.totalProcedureNum
                ? 100
                : ((dataItem.finishedDuration || 0) / (dataItem.totalDuration || 0)) * 100
            "
            stroke-width="6"
            backgroundColor="#F4F4F9"
            :activeColor="
              dataItem.postponeDays ||
              (dataItem.finishedProcedureNum && dataItem.finishedProcedureNum === dataItem.totalProcedureNum)
                ? '#ccc'
                : '#829DF3'
            "
            border-radius="12"
          />
        </view>
        <text class="percent-text">{{ dataItem.finishedProcedureNum || 0 }}/{{ dataItem.totalProcedureNum || 0 }}</text>
      </template>
      <!-- 非工序页面逻辑 end -->
    </view>
  </view>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'TaskProgress',
  components: {},
  props: {
    // 数据列表
    dataItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否是工序item
    isWorkingProcedure: {
      type: Boolean,
      default: false
    },

    // 是否是单体
    isUnit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //这里存放数据
    return {}
  },
  watch: {},
  mounted() {},
  //方法集合
  methods: {
    // 点击事件
    onClick(item) {
      this.$emit('on-click', item)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
@import url('./progress-item.less');
</style>
