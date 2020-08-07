<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view class="card">
          <view class="card-body">
            <!-- <view class="item">
            <text class="item-label"> 工序序号:</text>
            <text class="item-detail">{{ details.floorRule }}</text>
          </view> -->
            <view class="item">
              <text class="item-label">工序名称:</text>
              <text class="item-detail">{{ details.mainProcedure }}</text>
            </view>
            <view class="item">
              <text class="item-label"> 工序阶段:</text>
              <text class="item-detail">{{ details.constructStageName }}</text>
            </view>
            <view class="item">
              <text class="item-label">工序耗时：</text>
              <text class="item-detail">{{ details.duration }}天</text>
            </view>
            <view class="item">
              <text class="item-label">工序备注:</text>
              <text class="item-detail">{{ details.procedureRemark }}</text>
            </view>
            <view class="line"></view>
            <!-- 第二部分 -->
            <view class="item">
              <text class="item-label">计划开始时间：</text>
              <text class="item-detail">{{ details.planStartTime | formatData }}</text>
            </view>
            <view class="item">
              <text class="item-label">计划结束时间:</text>
              <text class="item-detail">{{ details.planEndTime | formatData }}</text>
            </view>
            <template v-if="details.status === 3">
              <view class="line"></view>
              <view class="item">
                <text class="item-label">实际开始时间：</text>
                <text class="item-detail">{{ details.actualStartTime | formatData }}</text>
              </view>
              <view class="item">
                <text class="item-label">实际结束时间:</text>
                <text class="item-detail">{{ details.actualEndTime | formatData }}</text>
              </view>
              <view class="line"></view>
              <view class="item">
                <text class="item-label">确认人：</text>
                <text class="item-detail">{{ details.confirmorName }}</text>
              </view>
              <view class="item">
                <text class="item-label">备注:</text>
                <text class="item-detail">{{ details.remark }}</text>
              </view>
              <view class="item">
                <text class="item-label">附件:</text>
                <view class="item-detail file-list">
                  <uni-attachment v-model="details.fileId"></uni-attachment>
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
      <view v-if="details.status === 2" class="btn-row">
        <button type="primary" class="primary" @click="$utils.toUrl(`/pages/task/check?id=${id}`)">确认工序</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { workingAPI } from '@/api/working'
export default {
  data() {
    return {
      id: '',
      details: ''
    }
  },
  onLoad(options) {
    this.id = options.id || ''
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getDetailsSchedule()
    },
    // 工序任务详情
    async getDetailsSchedule() {
      if (!this.id) {
        return
      }
      const result = await workingAPI.getDetailsSchedule(this.id)
      let datas = result.data
      this.details = datas
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./step-detail.less');
</style>
