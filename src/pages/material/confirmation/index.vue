<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleInspectItemClick(item.id,item.status,item.supplyPlanId)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.confirmCode }}</view>
                <view class="info-item">
                  <view class="item-label">供应商名称：</view>
                  <view class="item-detail"> {{ item.secondParty }}</view>
                </view>
                <view class="info-item">
                  <view class="item-label">甲供材计划名称：</view>
                  <view class="item-detail">{{ item.supplyPlanName }}</view>
                </view>
              </view>

              <block>
                <view class="status ">
                  <span class="circle" :style="{ backgroundColor: procurementStatus[item.status].color }"></span
                  >{{ procurementStatus[item.status].name }}
                </view>
              </block>
            </view>
            <view class="card-footer  border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | formatData }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <!-- 添加操作按钮开始 -->
    <m-addition v-if="$hasPower('MaterialConfirmCodeAdd')" @click.native="handleAddListItem"></m-addition>
    <!-- 添加操作按钮结束 -->
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="total == 0" />
    <!-- 无数据空载页 end -->
    <!-- 筛选组件 start -->
    <uni-drawer-filter ref="filterRef" type="materialConfirmationSheet" @submit="screenCallback"></uni-drawer-filter>
    <!-- 筛选组件 end -->
  </view>
</template>

<script>
import MAddition from '@/components/m-addition'
import { mapGetters } from 'vuex'
import { Api } from '@/api/material'
export default {
  components: {
    MAddition
  },
  data() {
    return {
      form: {
        status: '',
        keyword: ''
      },
      loading: false,
      list: [],
      total: 0,
      procurementStatus: [
        {
          name: '草稿',
          value: '0',
          color: '#089908'
        },
        {
          name: '待审核',
          value: '1',
          color: '#999999'
        },
        {
          name: '已通过',
          value: '2',
          color: '#0079fe'
        },
        {
          name: '已驳回',
          value: '3',
          color: '#ff0000'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.form.projectId = this.projectId
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.screen()
    }
  },
  methods: {
    // 初始化
    init() {
      this.form.page = 1
      this.list = []
      this.queryInspectList()
    },
    // 筛选
    screen() {
      this.$refs.filterRef.open()
    },
    // 筛选回调
    screenCallback(obj) {
      this.form = Object.assign({}, this.form, { status: obj.materialStatus })
      this.init()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.form.keyword = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.form.keyword = ''
      this.init()
    },

    // 添加新的材料确认单
    handleAddListItem() {
      this.$utils.toUrl('/pages/material/confirmation/add')
    },
    handleInspectItemClick(id,status,planId) {
      if (status === 0) {
        console.log(id)
        this.$utils.toUrl(`/pages/material/confirmation/add?ids=${planId}`)
      } else {
        this.$utils.toUrl(`/pages/material/confirmation/detail?id=${id}`)
      }

    },
    // 查询所有符合条件的检查列表
    async queryInspectList() {
      this.loading = true
      let result = await Api.getConfirmationList(this.form)
      this.loading = false
      if (result.code === 200) {
        let tempData = (result.data && result.data.records) || []
        this.list = [...this.list, ...tempData]
        this.total = result.data ? result.data.total : 0
      }
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.form.page++
      this.queryInspectList()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
