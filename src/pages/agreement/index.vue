<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleListItemClick(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ `${item.name}（${item.code}）` }}</view>
                <view class="info-item">
                  <view class="item-label">甲方：</view>
                  <view class="item-detail"> {{ item.firstParty }}</view>
                </view>
                <view class="info-item">
                  <view class="item-label">乙方：</view>
                  <view class="item-detail">{{ item.secondParty }}</view>
                </view>
                <view class="info-item count">
                  <view>计划单数量：{{ item.materialSupplyPlanNum }}</view>
                  <view>确认单数量：{{ item.materialSupplyConfirmBillNum }}</view>
                </view>
              </view>
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
    <m-addition v-if="$hasPower('ContractAdd')" @click.native="handleAddInspectItem"></m-addition>
    <!-- 添加操作按钮结束 -->
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="total == 0" />
    <!-- 无数据空载页 end -->
    <!-- 筛选组件 start -->
    <uni-drawer-filter ref="filterRef" type="agreement" @submit="screenCallback"></uni-drawer-filter>
    <!-- :filterInfo="{ agreementType: form.agreementType }" -->
    <!-- 筛选组件 end -->
  </view>
</template>

<script>
import MAddition from '../../components/m-addition'
import { mapGetters } from 'vuex'
import Api from '@/api/agreement'
export default {
  components: {
    MAddition
  },

  data() {
    return {
      form: {
        projectId: '',
        keyword: '',
        type: 2,
        status: null,
        purchaseMode: null,
        page: 1,
        rows: 5
      },
      loading: false,
      list: [],
      total: 0
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.form.projectId = this.projectId
  },
  onShow() {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary')
    // #endif
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
      this.queryContractList()
    },
    // 筛选
    screen() {
      this.$refs.filterRef.open()
    },
    // 筛选回调
    screenCallback(obj) {
      this.form = Object.assign({}, this.form, { purchaseMode: obj.agreementType })
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

    // 添加对应检查项
    handleAddInspectItem() {
      this.$utils.toUrl(`/pages/agreement/add`)
    },
    handleListItemClick(data) {
      this.$utils.toUrl(`/pages/agreement/detail?contractId=${data.id}`)
    },
    // 查询所有符合条件的合同
    async queryContractList() {
      this.loading = true
      let result = await Api.getContractList(this.form)
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
      this.queryContractList()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
