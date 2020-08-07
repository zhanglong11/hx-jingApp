<template>
  <div>
    <p class="date-wrap">
      <uni-date-picker v-model="date" fields="month" />
    </p>
    <histogram-chart
      :dataAs="chartData"
      canvasId="ht1"
      labelKey="label"
      :showLegend="showLegend"
      valueKey="value"
      y-unit=""
    />
    <div class="table-wrap">
      <h6 class="title">完成工序实际耗材</h6>
      <t-table>
        <t-tr v-for="item in tableData" :key="item.materialId">
          <t-td>{{ item.materialName }}</t-td>
          <t-td>{{ item.materialModels }}</t-td>
          <t-td>{{ item.actualConsumeNum }}{{ item.materialUnit }}</t-td>
        </t-tr>
      </t-table>
    </div>
  </div>
</template>

<script>
import { workingAPI } from '@/api/working'
import HistogramChart from '@/components/stan-ucharts/HistogramChart'
import tTable from '@/components/t-table/t-table'
import tTr from '@/components/t-table/t-tr'
import tTd from '@/components/t-table/t-td'
import moment from 'moment'
export default {
  name: 'MonthProgress',
  components: {
    HistogramChart,
    tTable,
    tTr,
    tTd
  },
  data() {
    return {
      date: null,
      filterForm: {},
      showLegend: true,
      chartData: {
        label: [''],
        value: [
          {
            name: '',
            data: []
          }
        ]
      },
      tableData: []
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  watch: {
    date(v) {
      if (!_.isNil(v)) {
        this.filterForm = {
          ...this.filterForm,
          ...{
            year: v.split('-')[0] - 0,
            month: v.split('-')[1] - 0
          }
        }
        this.refresh()
      }
    }
  },
  created() {
    this.setDate()
  },
  methods: {
    async refresh() {
      if (!this.projectId) {
        return
      }
      const res = await workingAPI.getMaterialList({ projectId: this.projectId, ...this.filterForm })
      this.setChartData(_.cloneDeep(res.data))
      this.tableData = res.data
    },
    setChartData(data) {
      if (!data.length) {
        this.showLegend = false
        this.chartData = {
          label: [''],
          value: [
            {
              name: '',
              data: []
            }
          ]
        }
        return
      }
      let label = []
      let planData = []
      let actualData = []
      data.map(r => {
        label.push(r.materialName)
        planData.push(r.planConsumeNum)
        actualData.push(r.actualConsumeNum)
      })
      this.chartData = {
        label: label,
        value: [
          {
            name: '计划',
            data: planData
          },
          {
            name: '实际',
            data: actualData
          }
        ]
      }
    },
    setDate() {
      this.date = moment(new Date()).format('YYYY-MM')
    }
  }
}
</script>
<style scoped lang="less">
@import url('./month-control.less');
</style>
