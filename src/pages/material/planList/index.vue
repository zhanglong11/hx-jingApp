<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirmed" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <ul class="safe-list">
        <li v-for="item in list" :key="item.id" class="card " @click="handleSafeDetailView(item)">
          <section class="cardList">
            <view class="list">
              <h2>
<!--                <span :style="{ backgroundColor: procurementStatus[item.auditStatus].color }"></span>-->
                {{ item.supplyPlanName }}
              </h2>
              <p class="title">
                <span>关联合同编号：{{ item.contractCode }}</span>
              </p>
              <p>甲供材计划单编号：{{ item.supplyPlanCode }}</p>

            </view>
            <view>
              <p>
                <span class="circle" :style="{ backgroundColor: procurementStatus[item.auditStatus].color }"></span
                >{{ procurementStatus[item.auditStatus].name }}
              </p>
            </view>
          </section>
          <view v-if="item.auditStatus === 2" class="planStatus">
            <p>材料确认单数量：{{ item.confirmBillNum }}</p>
            <p>计划状态：{{["未通知","采购中","已完成"][item.supplyStatus]}}</p>
          </view>
          <footer>
            <span>填报人:{{ item.creatorName }}</span>
            <span>填报时间：{{ item.updateTime | formatData }}</span>
          </footer>
        </li>
      </ul>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <!-- 添加操作按钮开始 -->
    <m-addition v-if="$hasPower('MaterialPlanListAdd')" @click.native="handleAddSafeItem"></m-addition>
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
import { mapGetters } from 'vuex'
import MAddition from '@/components/m-addition'
import { Api } from '@/api/material'

export default {
  name: 'Index',
  components: {
    MAddition
  },
  data() {
    return {
      list: [],
      total: 1,
      loading: false,
      // procurementStatus: ['安全临检', '一般检查', '阶段性检查', '专项检查'],
      procurementStatus: [
        {
          name: '草稿',
          value: '0',
          color: '#666'
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
      ],
      form: {
        assessEvaluate: 0,
        checkDateEnd: '',
        checkDateStart: '',
        companyId: '',
        createTimeEnd: '',
        createTimeStart: '',
        keyword: '',
        ndicatorAchievingStatus: 0,
        page: 1,
        projectId: '',
        rows: 5,
        sortField: '',
        sortValue: '',
        status: 0,
        type: -1,
        auditStatus: ''
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    'form.auditStatus'() {
      this.init()
    }
  },
  onLoad(options) {
    this.form.projectId = this.projectId
    this.getEntityId(options)
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
    // 获取地址栏传入单体id与楼层id
    getEntityId(options) {
      this.form.entityId = options.entityId || ''
      this.form.floorIdList = options.floorId ? options.floorId.split(',') : []
    },
    // 筛选
    screen() {
      this.$refs.filterRef.open()
    },
    // 筛选回调
    screenCallback(obj) {
      this.form = Object.assign({}, this.form, { auditStatus: obj.materialStatus })
      console.log(this.form)
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
      this.list = []
      this.form.keyword = e.value
      this.getPartyList()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.form.keyword = ''
      this.init()
    },
    // 新建安全检查项
    handleAddSafeItem() {
      this.$utils.toUrl(`/pages/material/planList/add`)
    },
    /*安全列表详情*/
    async handleSafeDetailView({ id, auditStatus }) {
      if (auditStatus === 0) {
        this.$utils.toUrl(`/pages/material/planList/add?id=${id}`)
      } else {
        this.$utils.toUrl(`/pages/material/planList/detail?id=${id}`)
      }
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
