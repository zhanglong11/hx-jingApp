<template>
  <view class="main is-white">
    <view class="main-header">
      <view class="status-info">
        <view class="flex-item ">
          <view>
            <text class="info-label">计划开始：</text>
            <text class="info-detail">
              {{ totalSingle.planStartTime | formatData }}
            </text>
          </view>
          <view>
            <text class="info-label">计划结束：</text>
            <text class="info-detail">
              {{ totalSingle.planEndTime | formatData }}
            </text>
          </view>
        </view>
        <view class="flex-item">
          <view>
            <text class="info-label">工序进度：</text>
            <text class="info-detail"> {{ totalSingle.planFinish }}/{{ totalSingle.totalProcedure }} </text>
          </view>
          <view>
            <text class="info-label">时间进度：</text>
            <text class="info-detail"> {{ totalSingle.passDays }}/{{ totalSingle.duration }} </text>
          </view>
        </view>
      </view>
    </view>
    <div class="header-line"></div>
    <scroll-view class="scroll-roll" scroll-y>
      <view v-if="dataList.length > 0" class="main-body">
        <!-- 已经完成的工序 -->
        <view
          v-for="(item, i) in dataList"
          :key="i"
          class="card"
          :class="{
            'not-started': item.status === 0,
            'have-in': item.status === 1,
            confirmed: item.status === 2,
            finished: item.status === 3
          }"
          @click="toDetails(item)"
        >
          <view class="card-header">
            <view class="step-title">
              <!-- {{ item.floorRule }} -->
              {{ item.mainProcedure }}
            </view>
            <view v-if="item.status !== 3" class="status">{{ item.status | getWorkingStatus }}</view>
            <template v-else>
              <view v-if="!item.diff" class="status on-time">
                按期完成
              </view>
              <view v-if="item.diff < 0" class="status advance">
                提前完成
              </view>
              <view v-if="item.diff > 0" class="status delay">
                延期完成
              </view>
            </template>
          </view>

          <view class="card-body">
            <view class="flex-item ">
              <view>
                <text>计划开始:</text>
                <text class="target-start-time">
                  {{ item.planStartTime | formatData }}
                </text>
              </view>
              <view v-if="item.actualStartTime">
                <text>实际开始:</text>
                <text class="actual-start-time">
                  {{ item.actualStartTime | formatData }}
                </text>
              </view>
            </view>
            <view class="flex-item">
              <view>
                <text>计划结束:</text>
                <text class="target-end-time">
                  {{ item.planEndTime | formatData }}
                </text>
              </view>
              <view v-if="item.actualEndTime">
                <text>实际结束:</text>
                <text class="actual-end-time" :class="{ delay: item.diff > 0, advance: item.diff < 0 }">
                  {{ item.actualEndTime | formatData }}
                </text>
              </view>
            </view>
          </view>
          <view class="card-footer">
            <view class="progress-wrapper">
              <!-- 注意这里进度条的颜色不同 -->
              <progress
                :percent="(item.passDays / item.duration) * 100"
                stroke-width="6"
                backgroundColor="#F4F4F9"
                activeColor="#CBCBCB"
                border-radius="10"
                class="progress-con"
              />
            </view>
            <text class="percent-text">{{ item.passDays }}/{{ item.duration }}天</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="dataList.length === 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import { workingAPI } from '@/api/working'
export default {
  data() {
    return {
      configId: '',
      floorNum: '',
      dataList: [],
      totalSingle: {}
    }
  },
  onLoad(options) {
    this.configId = options.configId || ''
    this.floorNum = options.floorNum || ''
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onShow() {
    this.init()
  },
  // 原生头部按钮跳转
  onNavigationBarButtonTap(obj) {
    if (obj.text === '耗材') {
      let title = `材料清单（${this.totalSingle.entityName}）-${this.totalSingle.floorNum}层`
      this.$utils.toUrl(`/pages/task/materials?title=${title}&floor=${this.totalSingle.floorNum}`)
    }
  },
  methods: {
    // 初始化
    init() {
      // #ifdef APP-PLUS
      this.configId = this.$mp.page.options.configId || ''
      this.floorNum = this.$mp.page.options.floorNum || ''
      // #endif
      // #ifdef H5
      this.configId = this.$route.query.configId || ''
      this.floorNum = this.$route.query.floorNum || ''
      // #endif
      this.getFloorSingle()
      this.queryList()
    },
    // 单体下特定楼层统计信息
    async getFloorSingle() {
      if (!this.configId || !this.floorNum) {
        return
      }
      const result = await workingAPI.getFloorSingle(this.configId, this.floorNum)
      let datas = result.data || {}
      this.totalSingle = datas
    },
    // 楼层下工序列表
    async queryList() {
      if (!this.configId || !this.floorNum) {
        return
      }
      const result = await workingAPI.getScheduleList(this.configId, this.floorNum)
      let datas = result.data || []
      this.dataList = datas
    },
    // 跳转详情
    toDetails(item) {
      this.$utils.toUrl(`/pages/task/step-detail?id=${item.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./step.less');
</style>
