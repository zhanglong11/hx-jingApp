<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card class="card">
          <uni-form-item label="甲供材计划单名称" isRequired>
            <textarea v-model="form.supplyPlanName" auto-height placeholder="请输入"></textarea>
          </uni-form-item>
          <view class="line"></view>
          <uni-form-item label="合同" isRequired isLink>
            <uni-select-contract
              v-model="form.contractId"
              :name.sync="form.contractName"
              :code.sync="form.contractCode"
            ></uni-select-contract>
          </uni-form-item>
          <uni-form-item label="项目经理" isRequired isLink>
            <uni-select-user
              v-model="form.projectManagerId"
              :roles="['项目经理']"
              :name.sync="form.projectManagerName"
            ></uni-select-user>
          </uni-form-item>
          <uni-form-item label="收货人" isRequired isLink>
            <uni-select-user
              v-model="form.consigneeId"
              :roles="['收货人']"
              :name.sync="form.consigneeName"
              :mobile.sync="form.consigneeMobile"
            ></uni-select-user>
          </uni-form-item>
          <uni-form-item label="联系电话" isRequired>
            <view>{{ form.consigneeMobile }}</view>
          </uni-form-item>
        </uni-card>
        <h4>
          甲供材计划明细
          <SelectContractInventory
            class="select-contract-inventory"
            :contract-id="form.contractId"
            @change="handleContractInventoryChange"
          >
            <span class="add">+</span>
          </SelectContractInventory>
        </h4>
        <uni-card v-for="(item, index) in form.detailList" :key="item._id" class="card">
          <uni-form-item label="序号">
            <view>{{ index + 1 }}</view>
          </uni-form-item>
          <uni-form-item label="名称">
            <view>{{ item.itemName }}</view>
          </uni-form-item>
          <uni-form-item label="型号">
            <view>{{ item.model }}</view>
          </uni-form-item>
          <uni-form-item label="规格">
            <view>{{ item.specifications }}</view>
          </uni-form-item>
          <uni-form-item label="合同数量">
            <view>{{ item.quantity }}</view>
          </uni-form-item>
          <uni-form-item label="合同剩余量">
            <view>{{ item.quantity - item.totalSupplyNum }}</view>
          </uni-form-item>
          <uni-form-item label="本计划供应量" isRequired>
            <input v-model.number="item.supplyNum" type="number" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="使用部位" isRequired>
            <textarea v-model="item.usedPart" auto-height placeholder="请输入"></textarea>
          </uni-form-item>
          <uni-form-item label="累计实际已供应量">
            <view>{{ item.totalSupplyNum }}</view>
          </uni-form-item>
          <uni-form-item label="计划到场时间" isRequired isLink>
            <view style="min-width: 200rpx;height: 48rpx" @click="handleChangePlanArrivalTime(item)">
              {{ item.planArrivalTime | ymdhm }}
            </view>
          </uni-form-item>
          <uni-form-item isLink>
            <a style="color:#496FE5" @click="removeItem(index)">删除</a>
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isSaveLoading" @click="save">保存并提交</button>
    </view>
    <wPicker ref="date" fields="minute" mode="date" startYear="2020" endYear="2029" :value="date" @confirm="dateChange">
    </wPicker>
  </view>
</template>

<script>
import SelectContractInventory from './components/SelectContractInventory'
import wPicker from '@/components/w-picker/w-picker'
import { Api } from '@/api/material'
import graceChecker from '@/utils/graceChecker.js'
import { isNumber, sumBy, uniqueId } from 'lodash'
const rules = [
  {
    name: 'supplyPlanName',
    checkType: 'notnull',
    errorMsg: '请输入甲供材计划单名称'
  },
  {
    name: 'contractId',
    checkType: 'notnull',
    errorMsg: '请选择合同'
  },
  {
    name: 'projectManagerId',
    checkType: 'notnull',
    errorMsg: '请选择项目经理'
  },
  {
    name: 'consigneeId',
    checkType: 'notnull',
    errorMsg: '请选择收货人'
  }
]
export default {
  name: 'Add',
  components: { SelectContractInventory, wPicker },
  data() {
    return {
      id: '',
      date: '',
      procurementStatus: [
        {
          name: '待通知',
          value: '0',
          color: '#ff0000'
        },
        {
          name: '采购中',
          value: '1',
          color: '#0079fe'
        },
        {
          name: '已完成',
          value: '2',
          color: '#25cc70'
        }
      ],
      isSaveLoading: false,
      form: {
        projectId: uni.getStorageSync('projectId'),
        consigneeMobile: '',
        detailList: []
      },
      activeItem: {}
    }
  },
  watch: {
    'form.contractId'(val, oldVal) {
      if (oldVal) this.form.detailList = []
    }
  },
  onLoad(options) {
    this.id = options.id || ''
    this.init()
  },
  methods: {
    async init() {
      if (this.id) {
        let res = await Api.getPartyDetail(this.id)
        if (!res.data.detailList) {
          res.data.detailList = []
        }
        this.form = res.data
      }
    },
    handleContractInventoryChange(rows) {
      this.form.detailList.push(
        ...rows.map(e => ({
          itemName: e.itemName,
          contractId: this.form.contractId,
          materialId: e.id,
          model: e.model,
          specifications: e.specifications,
          quantity: e.quantity,
          totalSupplyNum: e.totalSupplyNum,
          supplyNum: 0,
          planArrivalTime: '',
          _id: uniqueId()
        }))
      )
    },
    async save() {
      const checkRes = graceChecker.check(this.form, rules)
      if (!checkRes) {
        this.$utils.showToast(graceChecker.error)
        return false
      }
      if (this.form.detailList.length) {
        for (let i = 0; i < this.form.detailList.length; i++) {
          let message
          const item = this.form.detailList[i]
          if (!isNumber(item.supplyNum)) {
            message = '本计划供应量必填'
          } else if (item.supplyNum <= 0) {
            message = '本计划供应量必须大于0'
          } else if (!item.usedPart) {
            message = '使用部位必填'
          } else if (!item.planArrivalTime) {
            message = '计划到场时间必填'
          } else {
            const itemMax =
              item.quantity -
              item.totalSupplyNum -
              sumBy(
                this.form.detailList.filter(e => e.materialId === item.materialId && e._id !== item._id),
                'supplyNum'
              )
            if (item.supplyNum > itemMax) {
              message = `本计划供应量最大值为 ${itemMax}`
            }
          }
          if (message) {
            this.$utils.showToast(message + ` ( 第${i + 1}条 )`)
            return false
          }
        }
      }
      this.isSaveLoading = true
      await this.fly.construction.post('materialSupplyPlan/saveAndSubmitAudit', this.form).finally(() => {
        this.isSaveLoading = false
      })
      this.$utils.showToast('提交成功')
      uni.navigateBack()
    },
    dateChange(e) {
      this.activeItem.planArrivalTime = e.value
    },
    handleChangePlanArrivalTime(item) {
      this.date = item.planArrivalTime || ''
      this.activeItem = item
      this.$refs.date.show()
    },
    removeItem(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: () => {
          if (res.confirm) {
            this.form.detailList.splice(index, 1)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../detail.less');
.btn-wrapper {
  position: sticky;
  bottom: 30px;
}
h4 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  font-weight: normal;
  margin-top: 20px;
  font-size: 16px;
  .select-contract-inventory {
    padding: 10px;
  }
  .add {
    display: block;
    text-align: center;
    background-color: #55ca86;
    color: white;
    width: 40px;
    height: 40px;
    line-height: 35px;
    font-size: 20px;
    border-radius: 50%;
  }
}
</style>
