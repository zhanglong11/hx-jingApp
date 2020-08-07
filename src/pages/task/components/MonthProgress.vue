<template>
  <div>
    <p class="date-wrap">
      <uni-date-picker v-model="date" fields="month" />
    </p>
    <histogram-chart
      :dataAs="chartData"
      canvasId="test"
      labelKey="label"
      :showLegend="showLegend"
      valueKey="value"
      y-unit=""
    />
    <div class="table-wrap">
      <h6 class="title">当月完成工序</h6>
      <TkiTree :range="treeData" rangeKey="name" :isSimple="false" :renderContent="renderTree" />
    </div>
  </div>
</template>

<script>
import HistogramChart from '@/components/stan-ucharts/HistogramChart'
import TkiTree from './tki-tree/tki-tree'
import moment from 'moment'
import { workingAPI } from '@/api/working'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'MonthProgress',
  components: { HistogramChart, TkiTree },
  data() {
    return {
      date: null,
      chartData: {
        label: [''],
        value: [
          {
            name: '',
            data: []
          }
        ]
      },
      treeData: [],
      showLegend: false
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
      const res = await workingAPI.getProgressData({ projectId: this.projectId, ...this.filterForm })
      const cloneData = _.cloneDeep(res.data)
      this.initData(cloneData)
    },
    initData(data) {
      const result = []
      treeForEach(data, (item, parent) => {
        if (item.type === 3 || item.type === 4) {
          item.name = parent.name + '-' + item.name
        }
        if (item.type === 5) {
          item.children = item.floorScheduleList.map(r => {
            r.name = r.mainProcedure
            return r
          })
        }
        if (item.type === 4) {
          result.push(item)
        }
      })
      const resultData = _.cloneDeep(result)
      this.treeData = resultData
      this.initChartData(resultData)
    },
    initChartData(data) {
      if (!data.length) {
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
      data.map(r => {
        label.push(r.name)
        planData.push(r.children[0].floorScheduleList.length)
      })
      this.chartData = {
        label: label,
        value: [
          {
            name: '',
            data: planData
          }
        ]
      }
    },
    setDate() {
      this.date = moment(new Date()).format('YYYY-MM')
    },
    renderTree(item) {
      return `<div class="tree-item-wrap"><span class="label">${item.source.name}</span></div>`
    }
  }
}
</script>

<style scoped lang="less">
@import url('./month-control.less');
</style>
