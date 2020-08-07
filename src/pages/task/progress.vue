<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <template v-for="(floorItem, i) in floorList">
          <ProgressItem
            :key="i"
            isUnit
            :dataItem="floorItem"
            :class="{ active: curKey === floorItem.libraryId }"
            @on-click="showChildren(floorItem)"
          ></ProgressItem>
          <div :key="floorItem.libraryId" class="is-children">
            <template v-for="unitItem in unitList">
              <ProgressItem
                v-if="curKey === floorItem.libraryId"
                :key="unitItem.id"
                isUnit
                :dataItem="unitItem"
                @on-click="toDetail(unitItem)"
              ></ProgressItem>
            </template>
          </div>
        </template>
      </div>

      <uni-nav @click.native="showSearch" />
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="floorList.length === 0" />
    <!-- 无数据空载页 end -->

    <w-picker
      ref="linkage"
      :visible.sync="linkageVisible"
      mode="linkage"
      :value="defaultRegion1"
      :options="floorSearchList"
      :level="4"
      default-type="id"
      :default-props="defaultProps1"
      @confirm="chooseFloor($event, 'linkage')"
    ></w-picker>
  </view>
</template>

<script>
import { workingAPI } from '@/api/working'
import wPicker from '@/components/w-picker/w-picker'
import getPercent from '@/utils/getPercent'
import UniNav from './components/uni-nav/uni-nav'
import ProgressItem from './components/progress-item/progress-item'
export default {
  components: {
    wPicker,
    UniNav,
    ProgressItem
  },
  data() {
    return {
      keyword: '', //搜索关键字
      curKey: null,
      floorList: [],
      unitList: [],
      linkageVisible: false,
      defaultProps1: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      isSupport: true,
      defaultRegion1: ['120000'],
      floorSearchList: [],
      getPercent
    }
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
      this.$utils.toUrl(`/pages/task/month-control`)
    }
  },
  methods: {
    // 初始化
    init() {
      this.queryList()
      this.getTree()
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
        type: 2,
        pid: 0,
        keyword: this.keyword
      })
      this.floorList = result.data || []
    },
    async getTree() {
      if (!this.projectId) {
        return
      }
      const res = await workingAPI.getTotalTree({ projectId: this.projectId })
      this.floorSearchList = res.data
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
    showSearch() {
      // #ifdef APP-PLUS
      this.switchPullRefresh(false)
      // #endif
      this.$refs.linkage.show()
    },
    // #ifdef APP-PLUS
    switchPullRefresh(flag) {
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      const currentWebview = page.$getAppWebview()

      currentWebview.setStyle({
        pullToRefresh: {
          support: flag,
          style: plus.os.name === 'Android' ? 'circle' : 'default'
        }
      })
    },
    // #endif
    chooseFloor({ value }) {
      // #ifdef APP-PLUS
      this.switchPullRefresh(true)
      // #endif
      this.$utils.toUrl(`/pages/task/task-process?libraryId=${value[3]}`)
    },
    async showChildren(item, isClose) {
      if (_.isNil(item.libraryId)) {
        return
      }
      this.curKey = this.curKey === item.libraryId && !isClose ? null : item.libraryId
      const result = await workingAPI.getEntityList({ projectId: this.projectId, type: 3, pid: item.libraryId })
      this.unitList = result.data
    },
    toDetail(item) {
      this.$utils.toUrl(`/pages/task/task-floor?libraryId=${item.libraryId}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./progress.less');
</style>
