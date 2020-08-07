<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card isForm>
          <uni-form-item label="工序位置" isCell align="left">
            <view class="align-right">{{ formData.name }}-{{ formData.floorNum }}-{{ formData.locationName }}</view>
          </uni-form-item>
          <uni-form-item label="工序序号" isCell align="left">
            <view class="align-right">{{ formData.floorRule }}</view>
          </uni-form-item>
          <uni-form-item label="工序名称" isCell align="left">
            <view class="align-right">{{ formData.mainProcedure }}</view>
          </uni-form-item>
          <uni-form-item label="工序阶段" isCell align="left">
            <view class="align-right">{{ formData.constructStage }}</view>
          </uni-form-item>
          <uni-form-item label="实际工期" isCell align="left">
            <view class="align-right">{{ formData.actualDuration }}天</view>
          </uni-form-item>
          <uni-form-item label="计划开始时间" isCell align="left">
            <view class="align-right">{{ formData.planStartTime }}</view>
          </uni-form-item>
          <uni-form-item label="计划结束时间" isCell align="left">
            <view class="align-right">{{ formData.planEndTime }}</view>
          </uni-form-item>
          <uni-form-item label="计划工期" isCell align="left">
            <view class="align-right">{{ formData.planDuration }}天</view>
          </uni-form-item>
        </uni-card>
        <uni-title v-if="status !== '0'" title="实际工序耗材">
          <span v-if="status === '1'" slot="extra" class="consume-add" @click="consumeAdd()">+ 添加耗材</span>
        </uni-title>
        <uni-card v-if="status !== '0' && formData.consumeDTOList && formData.consumeDTOList.length > 0" isForm>
          <template v-for="(item, i) in formData.consumeDTOList">
            <uni-form-item :key="i" noLobel>
              <div class="consume-list">
                <span class="name">
                  <i>{{ item.materialName }}（{{ item.unit }}）</i><br />
                  {{ item.materialCode }}
                </span>
                <span class="desc">
                  <i>计划用量</i><br />
                  {{ item.planConsumeNum }}
                </span>
                <input
                  :value="item.actualConsumeNum"
                  placeholder="填写数量"
                  class="form-input"
                  type="number"
                  @input="changeInput(item, $event)"
                />
              </div>
            </uni-form-item>
          </template>
        </uni-card>
        <uni-card v-if="status !== '0'" isForm>
          <uni-form-item label="实际开始时间" isCell align="left">
            <view class="align-right">{{ formData.actualStartTime }}</view>
          </uni-form-item>
          <uni-form-item v-if="status === '2'" label="实际结束时间" isCell align="left">
            <view class="align-right">{{ formData.actualEndTime }}</view>
          </uni-form-item>
          <uni-form-item label="确认人" isCell align="left">
            <view class="align-right">{{ confirmorName }}</view>
          </uni-form-item>
        </uni-card>
        <uni-card v-if="status !== '0'" isForm>
          <uni-form-item label="备注" :isCell="status !== '1'" align="left">
            <textarea
              v-if="status === '1'"
              v-model="formData.remark"
              :maxlength="-1"
              placeholder="请输入备注信息"
              auto-height
            />
            <span v-else>{{ formData.remark }}</span>
          </uni-form-item>
          <uni-form-item class="file-item" :isCell="status !== '1'" :label="status === '1' ? '上传附件' : '附件'">
            <uni-attachment v-model="formData.fileId" uploadType="image" :edit="status === '1'"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <view v-if="status === '1'" class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="save()">保存</button>
        </view>
      </view>
    </scroll-view>
    <uni-drawer ref="productList" :width="750" mode="right">
      <inventory-select
        :checked="selectInventoryIds"
        :disabledIds="disabledInventoryIds"
        hasClose
        hasChoice
        @selected="changeInventory"
        @close="closeModal"
      ></inventory-select>
    </uni-drawer>
  </view>
</template>

<script>
import InventorySelect from '@/pages/material/purchaseOrder/inventory'
import { workingAPI } from '@/api/working'
export default {
  components: {
    InventorySelect
  },
  data() {
    return {
      isLoading: false,
      id: '',
      status: '0', // 状态1 进行中，才能进行确认工序操作
      formData: {
        id: 0,
        configId: '',
        detailId: '',
        detailSort: 0,
        floorNum: 0,
        floorId: '',
        duration: 0,
        templateId: '',
        startTime: '',
        endTime: '',
        actualStartTime: '',
        actualEndTime: '',
        status: 0,
        fileId: '',
        remark: '',
        confirmorId: '',
        confirmorName: ''
      },
      selectInventory: [], //选择的材料
      selectInventoryIds: [], //选择的材料 id集合
      disabledInventoryIds: [] // 禁止操作的材料 id集合
    }
  },
  onLoad(options) {
    this.id = options.id || ''
    this.status = options.status || '0'
  },
  onShow() {
    this.init()
  },
  computed: {
    confirmorName() {
      return this.$store.state.user.userName
    }
  },
  methods: {
    // 初始化
    init() {
      this.setTitle()
      this.getDetailsSchedule()
    },
    // 动态设置标题
    setTitle() {
      if (this.status !== '1') {
        this.$utils.setTitle('工序详情')
      }
    },
    // 工序任务详情
    async getDetailsSchedule() {
      if (!this.id) {
        return
      }
      const result = await workingAPI.getDetailsSchedule(this.id)
      let datas = result.data
      let consumeDTOList = datas.consumeDTOList || []
      let disabledInventoryIds = _.map(consumeDTOList, 'materialId')
      this.disabledInventoryIds = disabledInventoryIds
      this.formData = datas
    },
    // 输入框改变
    changeInput(item, e) {
      item.actualConsumeNum = e.detail.value
    },
    // 选择材料模态框显示
    consumeAdd() {
      this.$refs.productList.open()
    },
    // 关闭模态框
    closeModal() {
      this.$refs.productList.close()
    },
    // 选择材料成功
    changeInventory(e) {
      let consumeDTOList = [...this.formData.consumeDTOList]
      this.formData.consumeDTOList = consumeDTOList.filter(item => this.disabledInventoryIds.includes(item.materialId))
      let list = e.checked || []
      list.map(item => {
        let ids = _.map(this.formData.consumeDTOList, 'materialId')
        let index = ids.indexOf(item.id)
        let newItem = {
          actualConsumeNum: null,
          materialAmount: item.inventoryNumber,
          materialCode: item.code,
          materialId: item.id,
          materialName: item.name,
          planConsumeNum: 0,
          specification: item.models,
          unit: item.unit
        }
        if (index < 0) {
          this.formData.consumeDTOList.push(newItem)
        } else {
          this.formData.consumeDTOList[index] = Object.assign({}, newItem)
        }
      })
      this.selectInventoryIds = [...e.checkedValue]
      this.closeModal()
    },
    // 保存
    async save() {
      let consumeAddDTOList = []
      this.formData.consumeDTOList.map(item => {
        let newItem = {
          actualConsumeNum: item.actualConsumeNum || 0,
          materialId: item.materialId,
          planConsumeNum: item.planConsumeNum || 0
        }
        if (this.disabledInventoryIds.includes(item.materialId)) {
          // 计划材料，需要提交
          consumeAddDTOList.push(newItem)
        } else if (item.actualConsumeNum) {
          // 自己添加的材料，如果为空，则不提交
          consumeAddDTOList.push(newItem)
        }
      })
      // if (consumeAddDTOList.length === 0) {
      //   this.$utils.showToast('请添加实际工序耗材')
      //   return
      // }
      let params = {
        consumeAddDTOList,
        fileId: this.formData.fileId || '',
        remark: this.formData.remark || '',
        scheduleId: this.id
      }
      try {
        this.isLoading = true
        const result = await workingAPI.updateSchedule(params)
        this.isLoading = false
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1500)
      } catch (e) {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./check.less');
</style>
