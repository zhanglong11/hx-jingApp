<template>
  <view class="main is-white">
    <view class="main-header">
      <view class="status-info">
        <view class="flex-item ">
          <view>
            <text class="info-label">计划开始：</text>
            <text class="info-detail">
              {{ processData.planStartTime | formatData }}
            </text>
          </view>
          <view>
            <text class="info-label">计划结束：</text>
            <text class="info-detail">
              {{ processData.planEndTime | formatData }}
            </text>
          </view>
        </view>
        <view class="flex-item">
          <view>
            <text class="info-label">工序进度：</text>
            <text class="info-detail">
              {{ processData.finishedProcedureNum || 0 }}/{{ processData.totalProcedureNum || 0 }}
            </text>
          </view>
          <view>
            <text class="info-label">时间进度：</text>
            <text class="info-detail">
              {{ processData.finishedDuration || 0 }}/{{ processData.totalDuration || 0 }}
            </text>
          </view>
        </view>
      </view>
    </view>
    <div class="header-line"></div>
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <template v-for="(floorItem, i) in dataList">
          <ProgressItem
            :key="i"
            isWorkingProcedure
            :dataItem="floorItem"
            @on-click="toDetail(floorItem)"
          ></ProgressItem>
        </template>
      </div>
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="processData.length === 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import { workingAPI } from '@/api/working'
import getPercent from '@/utils/getPercent'
import ProgressItem from './components/progress-item/progress-item'
export default {
  components: {
    ProgressItem
  },
  data() {
    return {
      keyWords: '', //搜索关键字
      curKey: null,
      processData: {},
      dataList: [], // 工序列表
      getPercent,
      statusList: [
        { label: '未开始', value: 0 },
        { label: '进行中', value: 1 },
        { label: '已完成', value: 2 }
      ]
    }
  },
  onLoad(options) {
    this.pid = options.libraryId || ''
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap() {
    this.$utils.toUrl(`/pages/task/material-list?libraryId=${this.pid}`)
  },
  methods: {
    // 初始化
    init() {
      this.queryList()
    },
    // 项目下单体列表
    async queryList() {
      if (!this.projectId) {
        return
      }
      const result = await workingAPI.getProcessList({ projectId: this.projectId, libraryId: this.pid })
      let datas = result.data
      let list = datas.procedureList || []
      this.processData = datas
      this.dataList = list
    },
    // 跳转详情
    async toDetail(item) {
      //未开始-点击开始
      if (item.status === 0) {
        uni.showModal({
          title: '提示',
          content: '确定要开始？',
          success: async res => {
            if (res.confirm) {
              await workingAPI.start(item.scheduleId)
              this.$utils.showToast('操作成功')
              this.init()
            }
          }
        })
        return
      }
      this.$utils.toUrl(`/pages/task/check?id=${item.scheduleId}&status=${item.status}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./progress.less');
</style>
