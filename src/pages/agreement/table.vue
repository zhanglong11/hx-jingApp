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
import Api from '@/api/agreement'
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
          title: '规格',
          key: 'specifications',
          align: 'center'
        },
        {
          title: '型号',
          key: 'model',
          align: 'center',
          width: 360
        },
        {
          title: '单位',
          key: 'unit',
          width: 140,
          align: 'center'
        },
        {
          title: '数量',
          key: 'quantity',
          width: 120,
          align: 'center'
        },
        {
          title: '单价',
          key: 'unitPrice',
          width: 120,
          align: 'center'
        },
        {
          title: '合价',
          key: 'combinedPrice',
          align: 'center'
        }
      ]
    }
  },
  onLoad(options) {
    this.contractId = options.contractId
  },
  onShow() {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('landscape-primary')
    // #endif
    this.getTableData()
  },

  onBackPress() {
    // #ifdef APP-PLUS
    plus.screen.unlockOrientation()
    console.log('onBackPress')

    // #endif
  },
  methods: {
    async getTableData() {
      let res = await Api.getContractInventoryPurchase({ contractId: this.contractId })
      this.tableData = res.data.records
    }
  }
}
</script>

<style scoped>
.table-wrapper {
  width: 700rpx;
  margin: 20rpx auto;
}

/*  #ifdef APP-PLUS  */
.table-wrapper {
  height: calc(100vh - 100rpx);
  width: calc(100vw - 100rpx);
  margin: 20rpx auto;
}
/*  #endif  */
</style>
