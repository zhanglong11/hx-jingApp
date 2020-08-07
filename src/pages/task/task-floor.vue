<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <template v-for="(floorItem, i) in floorList">
          <ProgressItem
            :key="i"
            :dataItem="floorItem"
            :class="{ active: curKey === floorItem.libraryId }"
            @on-click="showChildren(floorItem)"
          ></ProgressItem>
          <div :key="floorItem.libraryId" class="is-children">
            <template v-for="unitItem in unitList">
              <ProgressItem
                v-if="curKey === floorItem.libraryId"
                :key="unitItem.id"
                :dataItem="unitItem"
                @on-click="toDetail(unitItem)"
              ></ProgressItem>
            </template>
          </div>
        </template>
      </div>
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="floorList.length === 0" />
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
      floorList: [],
      unitList: [],
      getPercent
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
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'month') {
      this.$utils.toUrl(`/pages/task/material-list`)
    }
  },
  methods: {
    // 初始化
    init() {
      this.queryList()
      if (this.curKey) {
        // 返回同时刷新孩子
        this.showChildren(
          {
            libraryId: this.curKey
          },
          true
        )
      }
    },
    // 项目下单体列表
    async queryList() {
      if (!this.projectId) {
        return
      }
      const result = await workingAPI.getEntityList({
        projectId: this.projectId,
        type: 4,
        pid: this.pid,
        keyword: this.keyword
      })
      this.floorList = result.data || []
    },

    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.keyword = e.value.trim()
      this.init()
    },

    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.keyword = ''
      this.init()
    },
    async showChildren(item, isClose) {
      if (_.isNil(item.libraryId)) {
        return
      }
      this.curKey = this.curKey === item.libraryId && !isClose ? null : item.libraryId
      const result = await workingAPI.getEntityList({ projectId: this.projectId, type: 5, pid: item.libraryId })
      this.unitList = result.data
    },
    toDetail(item) {
      this.$utils.toUrl(`/pages/task/task-process?libraryId=${item.libraryId}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./progress.less');
</style>
