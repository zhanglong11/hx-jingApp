<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirmed" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <ul class="safe-list">
        <li v-for="item in list" :key="item.id" class="card " @click="handleSafeDetailView(item.id)">
          <section class="cardList">
            <view class="list">
              <h2>
<!--                <span :style="{ backgroundColor: procurementStatus[item.supplyStatus].color }"></span>-->
                {{ item.supplyPlanName }}
              </h2>
              <p class="title">
                <span>供应商名称：</span> <span>{{ item.secondParty }}</span>
              </p>
              <p>甲供材计划单编号：{{ item.supplyPlanCode }}</p>
            </view>
            <view>
              <p>
                <span class="circle" :style="{ backgroundColor: procurementStatus[item.supplyStatus].color }"></span
                >{{ procurementStatus[item.supplyStatus].name }}
              </p>
            </view>
          </section>
          <view v-if="item.supplyStatus !== 0" class="planStatus">
            <p>材料确认单数量：{{ item.confirmBillNum }}</p>
          </view>
          <footer>
            <span>填报人:{{ item.creatorName }}</span>
            <span>填报时间：{{ item.updateTime | formatData }}</span>
          </footer>
        </li>
      </ul>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="total == 0" />
    <!-- 无数据空载页 end -->

    <!-- 筛选组件 start -->
    <uni-drawer-filter ref="filterRef" type="materialProcurementSupplier" @submit="screenCallback"></uni-drawer-filter>
    <!-- 筛选组件 end -->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { Api } from '@/api/material'

export default {
  name: 'Index',
  data() {
    return {
      // tabIndex: 0,

      list: [
        {
          id: 1,
          supplyPlanName: '计划单',
          secondParty: '某某公司',
          supplyPlanCode: '1872-C1NQTL-2017- 4',
          checkPersonName: '王默默',
          supplyStatus: 0,
          reportTime: '2020-5-22'
        },
        {
          id: 2,
          supplyPlanName: '计划单',
          secondParty: '某某公司',
          supplyPlanCode: '1872-C1NQTL-2017- 4',
          checkPersonName: '王默默',
          supplyStatus: 1,
          reportTime: '2020-5-22'
        },
        {
          id: 3,
          supplyPlanName: '计划单',
          secondParty: '某某公司',
          supplyPlanCode: '1872-C1NQTL-2017- 4',
          checkPersonName: '王默默',
          supplyStatus: 2,
          reportTime: '2020-5-22'
        }
      ],
      total: 1,
      loading: false,
      // procurementStatus: ['安全临检', '一般检查', '阶段性检查', '专项检查'],
      procurementStatus: [
        {
          name: '待通知',
          value: '0',
          color: '#ff0000'
        },
        {
          name: '供货中',
          value: '1',
          color: '#0079fe'
        },
        {
          name: '已完成',
          value: '2',
          color: '#25cc70'
        }
      ],
      form: {
        auditStatus: 2,
        createEndTime: '',
        createStartTime: '',
        keyword: '',
        page: 1,
        projectId: '',
        rows: 10,
        supplyStatus: '',
        supplyStatusList: [1, 2]
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    'form.supplyStatus'() {
      this.init()
    }
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
      this.list = []
      this.form.page = 1
      this.getPartyList()
    },
    // 筛选
    screen() {
      this.$refs.filterRef.open()
    },
    // 筛选回调
    screenCallback(obj) {
      this.form = Object.assign({}, this.form, { supplyStatus: obj.materialStatus })
      this.init()
    },
    changeTab(val) {
      // this.tabIndex = val
      this.form.type = val
      this.form.page = 1
      this.getPartyList()
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.form.keyword = e.value
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.form.keyword = ''
      this.init()
    },
    /*安全列表详情*/
    async handleSafeDetailView(id) {
      this.$utils.toUrl(`/pages/material/procurementSupplier/detail?id=${id}`)
    },

    // 请求采购通知列表信息
    async getPartyList() {
      let result = await Api.getPartyList(this.form)
      if (result.code === 200) {
        let records = (result.data && result.data.records) || []
        this.list = [...this.list, ...records]
        this.total = result.data ? result.data.total : 0
      }
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.form.page++
      this.getPartyList()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
