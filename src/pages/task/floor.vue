<template>
  <view class="main is-white">
    <div class="search-wrap-primary">
      <uni-search-bar placeholder="搜索" type="primary" @input="changeKeyWords"></uni-search-bar>
    </div>
    <div class="header-line"></div>
    <scroll-view class="scroll-roll" scroll-y>
      <view v-if="computedList.length > 0" class="main-body">
        <view
          v-for="(item, i) in computedList"
          :key="i"
          class="card"
          :class="{ finished: item.status === 3, 'not-started': item.status === 0 }"
          @click="toDetails(item)"
        >
          <view class="card-header">
            <view>{{ item.floorNum }}层</view>
            <view v-if="item.tbcCount > 0" class="status delay"></view>
          </view>

          <view class="card-body">
            <view class="flex-item">
              <view>
                <text>计划开始:</text>
                <text class="target-start-time">
                  {{ item.planStartTime | formatData }}
                </text>
              </view>
              <view>
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
              <view>
                <text>实际结束:</text>
                <text class="actual-end-time">{{ item.actualEndTime | formatData }}</text>
              </view>
            </view>
          </view>
          <view class="card-footer">
            <view class="progress-wrapper">
              <progress
                :percent="(item.planFinish / item.totalProcedure) * 100"
                stroke-width="6"
                backgroundColor="#F4F4F9"
                activeColor="#829DF3"
                border-radius="12"
              />
            </view>
            <text class="percent-text">{{ item.planFinish }}/{{ item.totalProcedure }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="computedList.length === 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import { workingAPI } from '@/api/working'
export default {
  data() {
    return {
      configId: '',
      dataList: [],
      keyWords: ''
    }
  },
  onLoad(options) {
    this.configId = options.configId || ''
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  computed: {
    computedList() {
      if (this.keyWords) {
        return this.dataList.filter(e => (e.floorNum + '').includes(this.keyWords))
      } else {
        return this.dataList
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.queryList()
    },
    // 单体下楼层列表
    async queryList() {
      if (!this.configId) {
        return
      }
      const result = await workingAPI.getFloorList(this.configId)
      let datas = result.data || []
      this.dataList = datas
    },
    // 跳转详情
    toDetails(item) {
      this.$utils.toUrl(`/pages/task/step?configId=${this.configId}&floorNum=${item.floorNum}`)
    },
    // 搜索关键词改变
    changeKeyWords({ value }) {
      this.keyWords = value
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./floor.less');
</style>
