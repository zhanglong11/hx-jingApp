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
          title: '计划供应量',
          key: 'supplyNum',

          align: 'center'
        },
        {
          title: '上期累计量',
          key: 'lastSupplyNum',

          align: 'center'
        },
        {
          title: '本期供应量',
          key: 'currentSupplyNum',

          align: 'center'
        },
        {
          title: '单价',
          key: 'currentUnitPrice',
          width: 100,
          align: 'center'
        },
        {
          title: '合价',
          key: 'total',
          align: 'center'
          // render: (h, { row }) => {
          //   return h('view', row.currentUnitPrice * row.currentSupplyNum || 0)
          // }
        },
        {
          title: '本期累计量',
          key: 'totalSupplyNum',

          align: 'center'
        },
        {
          title: '是否超供',
          key: 'overfulfilFlag',
          align: 'center'
          // render: (h, { row }) => {
          //   return h('view', Number(row.lastSupplyNum) + Number(row.currentSupplyNum) > row.supplyNum ? '否' : '是')
          // }
        },
        {
          title: '使用部位',
          key: 'usedPart',

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
      this.getConfirmationDetail()
    },
    async getConfirmationDetail() {
      let res = await Api.getConfirmationDetail(this.id)
      this.tableData = res.data.detailList || []
      if (res.data.detailList) {
        res.data.detailList.forEach(e =>{
          e.total = e.currentUnitPrice * e.currentSupplyNum || 0
          e.overfulfilFlag=Number(e.lastSupplyNum) + Number(e.currentSupplyNum) > e.supplyNum ? '否' : '是'
        })
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
