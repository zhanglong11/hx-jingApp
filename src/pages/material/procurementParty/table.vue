<template>
  <view class="main"
    ><view class="main-body">
      <view class="table-wrapper">
        <scroll-view scroll-x>
          <wTable headbBackground="#EEEEEE" :columns="columns" :data="tableData" border />
        </scroll-view> </view></view
  ></view>
</template>

<script>
import wTable from '@/components/wTable/wTable.vue'
import { Api } from '@/api/material'
export default {
  components: {
    wTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '名称',
          key: 'itemName',
          align: 'center'
        },
        {
          title: '型号',
          key: 'model',
          align: 'center'
        },
        {
          title: '规格',
          key: 'specifications',
          align: 'center'
        },

        {
          title: '合同数量',
          key: 'quantity',
          align: 'center'
        },
        {
          title: '合同剩余量',
          key: 'contractSurplus',
          align: 'center'
          // render: (h, { row }) => {
          //   return h('view', row.quantity - row.totalSupplyNum || 0)
          // }
        },
        {
          title: '本计划供应量',
          key: 'supplyNum',
          align: 'center'
        },
        {
          title: '使用部位',
          key: 'usedPart',
          align: 'center'
        },
        {
          title: '累计实际已供应量',
          key: 'totalSupplyNum',
          width: 240,
          align: 'center'
        },
        {
          title: '计划到场时间',
          key: 'planArrivalTime',
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center'
        }
      ],
      id: ''
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('landscape-primary')
    // #endif
  },
  onLoad(options) {
    this.init(options)
  },
  onBackPress() {
    // #ifdef APP-PLUS
    plus.screen.unlockOrientation()
    console.log('onBackPress')

    // #endif
  },
  methods: {
    init(options) {
      this.id = options.id || ''
      this.getPartyDetail()
    },
    async getPartyDetail() {
      let res = await Api.getPartyDetail(this.id)
      this.tableData = res.data.detailList || []
      if (res.data.detailList) {
        res.data.detailList.forEach(e => (e.contractSurplus = e.quantity - e.totalSupplyNum || 0))
      }
    }
  }
}
</script>

<style>
.table-wrapper {
  width: 700px;
  margin: 20px auto;
}

/*  #ifdef APP-PLUS  */
.table-wrapper {
}
/*  #endif  */
</style>
