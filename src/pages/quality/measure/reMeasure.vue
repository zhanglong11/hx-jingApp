<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="card" style="margin-top: 20px;">
        <uni-form-item label="状态">
          <div>{{ ['不合格', '合格'][form.status] }}</div>
        </uni-form-item>
        <uni-form-item label="测量项">
          <div>{{ form.measureStandardName }}</div>
        </uni-form-item>
        <uni-form-item label="位置">
          <div>{{ form.measureLocation }}</div>
        </uni-form-item>
        <uni-form-item label="实测点">
          <div>{{ form.totalPointNum }}</div>
        </uni-form-item>
        <uni-form-item label="合格点">
          <div>{{ form.passNum }}</div>
        </uni-form-item>
        <uni-form-item label="不合格点">
          <div>{{ form.failNum }}</div>
        </uni-form-item>
        <uni-form-item label="合格率">
          <div>{{ form.percentOfPass }}</div>
        </uni-form-item>
      </div>
      <ImageMark :imageSrc="form.measureDrawingUrl" :pointList="pointList" @pointClick="handlePointClick"></ImageMark>
      <ul class="point-list">
        <li
          v-for="e in pointList"
          :key="e.id"
          class="item"
          :class="{
            [['error', 'success', ''][e.status]]: true,
            active: e.id === activePoint.id
          }"
          @click="activePoint = e"
        >
          {{ ('' + e.id).padStart(2, '0') }}
        </li>
      </ul>
      <uni-card v-if="activePoint.x">
        <uni-form-item label="点位名称" isRequired>
          <textarea
            v-model="activePoint.positionName"
            :placeholder="('' + activePoint.id).padStart(2, '0') + (id ? '' : ' (点击可以编辑)')"
            auto-height
            class="align-right"
          />
        </uni-form-item>
      </uni-card>
      <uni-card v-for="item in activePoint.measurePositionList || []" :key="item.id">
        <uni-form-item :label="item.metricName" align="right">
          <div style="width: 100%;text-align: right;">
            <uni-btn
              style="width: 160rpx;display: inline-block;text-align: center;"
              type="primary"
              size="small"
              @click="showLogsPopup(item.id)"
            >
              测量记录
            </uni-btn>
          </div>
        </uni-form-item>
        <uni-form-item label="单位" isRequired disabled>
          <textarea :value="item.unit" auto-height class="align-right" />
        </uni-form-item>
        <uni-form-item label="设计值" isRequired>
          <input
            v-model.number="item.designValue"
            :disabled="!!item._status"
            type="number"
            class="align-right"
            @input="calculateItem(item)"
          />
        </uni-form-item>
        <uni-form-item label="测量值" isRequired>
          <input
            v-model.number="item.measureValue"
            :disabled="!!item._status"
            type="number"
            class="align-right"
            @input="calculateItem(item)"
          />
        </uni-form-item>
        <uni-form-item label="偏差">
          <div>{{ item.deviation }}</div>
        </uni-form-item>
        <uni-form-item label="合格标准" isRequired>
          <div>
            {{ `[${item.lowerBound},${item.uppserBound}]` }}
          </div>
        </uni-form-item>
        <uni-form-item label="是否合格" isRequired>
          <div>{{ ['不合格', '合格'][item.status] }}</div>
        </uni-form-item>
      </uni-card>
      <div class="btn-wrapper">
        <button type="primary" style="margin-top: 15px;" @click="submit">提交</button>
      </div>
    </scroll-view>
    <uni-popup ref="popup">
      <div class="popup">
        <div>
          <h3>点位 {{ tableData[0] ? ('' + tableData[0].positionNum).padStart(2, '0') : '' }}</h3>
          <t-table style="width: 650rpx;">
            <t-tr>
              <t-th>测量项</t-th>
              <t-th>实测值</t-th>
              <t-th>设计值</t-th>
            </t-tr>
            <t-tr v-for="item in tableData" :key="item.id">
              <t-td>{{ item.metricName }}</t-td>
              <t-td>{{ item.measureValue }}</t-td>
              <t-td>{{ item.designValue }}</t-td>
            </t-tr>
          </t-table>
        </div>
      </div>
    </uni-popup>
    <uni-popup ref="popupLogs">
      <div class="popup">
        <div>
          <h3>测量记录</h3>
          <t-table style="width: 650rpx;">
            <t-tr>
              <t-th>测量人</t-th>
              <t-th :width="300">测量时间</t-th>
              <t-th>测量值</t-th>
            </t-tr>
            <t-tr v-for="item in logsTableData" :key="item.id">
              <t-td>{{ item.measurerName }}</t-td>
              <t-td>{{ item.measureTime }}</t-td>
              <t-td>{{ item.measureValue }}</t-td>
            </t-tr>
          </t-table>
        </div>
      </div>
    </uni-popup>
  </div>
</template>

<script>
import ImageMark from 'vue-image-mark'
import _ from 'lodash'
import tTable from '@/components/t-table/t-table'
import tTh from '@/components/t-table/t-th'
import tTr from '@/components/t-table/t-tr'
import tTd from '@/components/t-table/t-td'
export default {
  name: 'Detail',
  components: {
    ImageMark,
    tTable,
    tTh,
    tTr,
    tTd
  },
  data() {
    return {
      activePoint: {},
      pointList: [],
      isLoading: false,
      form: {},
      id: '',
      tableData: [],
      activeLogsId: null,
      logsTableData: []
    }
  },
  watch: {
    activeLogsId(id) {
      this.fly.safety.get('measureHistory/list/' + id).then(res => {
        this.logsTableData = res.data
      })
    }
  },
  created() {
    this.refresh()
  },
  onLoad(options) {
    this.id = options.id
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.safety.get('measureRecord/view/' + this.id).then(res => {
        res.data.measureMetricInfo = JSON.parse(res.data.measureMetricInfo)
        res.data.detailList.forEach(e => {
          e.deviation = e.uppserBound - e.lowerBound
          if (e.status === 0) {
            e.designValue = null
            e.measureValue = null
          }
          e._status = e.status
        })
        this.form = res.data
        res.data.percentOfPass = _.round(res.data.passNum / res.data.totalPointNum, 2) * 100 + '%'
        this.pointList = res.data.positionList.map(e => ({
          x: e.xCoordinate,
          y: e.yCoordinate,
          id: e.positionNum,
          status: e.positionStatus,
          color: ['#e63030', '#25cc70'][e.positionStatus],
          measurePositionList: res.data.detailList
            .filter(f => f.measurePositionId === e.id)
            .map(f => ({ positionNum: e.positionNum, ...f }))
        }))
        if (this.pointList.length) this.activePoint = this.pointList[0]
      })
    },
    submit() {
      let measurePositionList = _.flatMap(this.pointList, point => {
        return point.measurePositionList
      }).filter(e => e._status === 0)
      for (let point of measurePositionList) {
        if (point.measureValue === null || point.designValue === null) {
          this.$utils.showToast('设计值和测量值必填')
          return false
        }
      }
      this.fly.safety.post('measureRecord/' + this.id + '/repetitionMeasure', measurePositionList).then(res => {
        this.$utils.showToast('添加成功')
        // this.$utils.toUrl('/pages/quality/measure/list', 1)
        this.$utils.goBack(2)
      })
    },
    handlePointClick(point) {
      this.tableData = _.cloneDeep(point.measurePositionList)
      this.$refs.popup.open()
    },
    showLogsPopup(id) {
      this.activeLogsId = id
      this.$refs.popupLogs.open()
    },
    calculateItem(item) {
      if (_.isNumber(item.designValue) && _.isNumber(item.measureValue)) {
        item.deviation = item.measureValue - item.designValue
        if (item.deviation <= item.uppserBound && item.deviation >= item.lowerBound) {
          item.status = 1
        } else {
          item.status = 0
        }
      }
      if (this.activePoint.measurePositionList.some(e => e.status === 0)) {
        this.activePoint.status = 0
        this.activePoint.color = '#e63030'
      } else if (this.activePoint.measurePositionList.every(e => e.status === 1)) {
        this.activePoint.status = 1
        this.activePoint.color = '#25cc70'
      } else {
        this.activePoint.status = null
      }
      this.pointList = this.pointList.slice()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  padding-top: 0;
  padding-bottom: 30px;
}
.main-header {
  overflow: hidden;
  border-radius: 30px;
  font-size: 13px;
  display: block;
  background-color: #fff;
  line-height: 48px;
  padding: 25px 0 5px;
  margin-bottom: 25px;
  /deep/ .steps__row-title {
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.uni-card {
  width: 700px;
}
.status(@class,@color) {
  &.@{class} {
    border: 2px solid @color;
    &.active {
      background-color: @color;
      color: #fff;
    }
  }
}
.point-list {
  margin-top: 20px;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  li {
    border-radius: 10px;
    cursor: pointer;
    margin: 10px;
    padding: 10px 31px;
    color: #555;
    .status(item, #d7d7d7);
    .status(success, #25cc70);
    .status(error, #e63030);
  }
}
.popup {
  font-size: 0;
  background-color: #fff;
  padding: 25px;
  h3 {
    font-size: 16px;
    line-height: 1;
    margin-bottom: 25px;
    font-weight: normal;
    text-align: center;
  }
}
.red {
  color: #e63030;
}
</style>
