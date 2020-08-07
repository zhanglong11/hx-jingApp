<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card title="看板信息" :hideTitle="false">
          <ul class="list">
            <li @click="toUrl('/pages/board/project/project')">
              <image class="list-icon" src="/static/images/application/xiangmukanban.png"></image>
              <p>项目看板</p>
            </li>
            <li v-if="$appType === 3" @click="toUrl('/pages/board/project/overview/introduction')">
              <image class="list-icon" src="/static/images/application/jindukanban.png"></image>
              <p>项目介绍</p>
            </li>
            <li v-if="$appType === 1" @click="toUrl('/pages/task/month-control')">
              <image class="list-icon" src="/static/images/application/jindukanban.png"></image>
              <p>月度预控</p>
            </li>
            <li v-if="$hasPower('EquipmentMonitoring')" @click="toUrl('/pages/board/video/video')">
              <image class="list-icon" src="/static/images/application/shipinjiankong.png"></image>
              <p>视频监控</p>
            </li>
            <li v-if="$appType != 1" @click="toUrl('/pages/board/milestone/milestone')">
              <image class="list-icon" src="/static/images/application/lichengbei.png"></image>
              <p>里程碑</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('Quality')" title="质量管理" :hideTitle="false">
          <ul class="list">
            <li @click="toUrl('/pages/inspect/index')">
              <image class="list-icon" src="/static/images/application/zhiliangjiancha2.png"></image>
              <p>质量检查</p>
            </li>
            <li @click="toUrl('/pages/quality/statistics/acceptance/list')">
              <image class="list-icon" src="/static/images/application/zhiliangyanshou.png"></image>
              <p>质量验收</p>
            </li>
            <li @click="toUrl('/pages/quality/measure/list')">
              <image class="list-icon" src="/static/images/application/shiceshiliang.png"></image>
              <p>实测实量</p>
            </li>
            <li @click="toUrl('/pages/quality/statistics/chartview/index')">
              <image class="list-icon" src="/static/images/application/zhiliangtongji.png"></image>
              <p>质量统计</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('Safe')" title="安全管理" :hideTitle="false">
          <ul class="list">
            <li @click="$utils.toUrl('/pages/safe/index')">
              <image class="list-icon" src="/static/images/application/anquanjiancha.png"></image>
              <p>安全检查</p>
            </li>
            <!-- <li @click="$utils.toUrl('/pages/safeCivilizationCheck/index')">
              <image class="list-icon" src="/static/images/application/anquanwenming.png"></image>
              <p>安全文明</p>
            </li> -->
            <li @click="toUrl('/pages/safe/statistics/chartview/index')">
              <image class="list-icon" src="/static/images/application/anquantongji.png"></image>
              <p>安全统计</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$appType === 3" title="进度管理" :hideTitle="false">
          <ul class="list">
            <li @click="$utils.toUrl('/pages/schedule/statistics')">
              <image class="list-icon" src="/static/images/application/jindu1.png"></image>
              <p>进度统计</p>
            </li>
            <li @click="$utils.toUrl('/pages/schedule/step-1')">
              <image class="list-icon" src="/static/images/application/jindu2.png"></image>
              <p>进度填报</p>
            </li>
            <li @click="progressSimulation(5)">
              <image class="list-icon" src="/static/images/application/jindu3.png"></image>
              <p>进度模拟</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$appType === 3" title="物资管理" :hideTitle="false">
          <ul class="list">
            <li @click="$utils.toUrl('/pages/application/application-material?type=1')">
              <image class="list-icon" src="/static/images/application/cailiaoguanli.png"></image>
              <p>材料管理</p>
            </li>
            <li @click="$utils.toUrl('/pages/application/application-material?type=2')">
              <image class="list-icon" src="/static/images/application/shebeiguanli.png"></image>
              <p>设备管理</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$appType === 1 && $hasPower('SuppliesSmartDecoration')" title="材料管理">
          <ul class="list">
            <li @click="$utils.toUrl('/pages/material/purchaseOrder/list')">
              <image class="list-icon" src="/static/images/application/cailiao4.png"></image>
              <p>采购单</p>
            </li>
            <li @click="$utils.toUrl('/pages/material/receipt/list')">
              <image class="list-icon" src="/static/images/application/cailiao2.png"></image>
              <p>入库单</p>
            </li>
            <li @click="$utils.toUrl('/pages/material/inventory/index')">
              <image class="list-icon" src="/static/images/application/cailiao1.png"></image>
              <p>材料库存</p>
            </li>
            <li @click="$utils.toUrl(`/pages/material/stockOut/list`)">
              <image class="list-icon" src="/static/images/application/cailiao3.png"></image>
              <p>出库单</p>
            </li>
          </ul>
        </uni-card>
        <!-- 开发商版本功能 start -->
        <uni-card v-if="$appType === 2" title="材料管理" :hideTitle="false">
          <ul class="list">
            <li @click="$utils.toUrl('/pages/material/planList/index')">
              <image class="list-icon" src="/static/images/application/jihuadan.png"></image>
              <p>甲供计划单</p>
            </li>
            <li @click="$utils.toUrl('/pages/material/procurementParty/index')">
              <image class="list-icon" src="/static/images/application/caigoudan.png"></image>
              <p>甲方权限</p>
            </li>
            <li @click="$utils.toUrl('/pages/material/procurementSupplier/index')">
              <image class="list-icon" src="/static/images/application/caigoudan1.png"></image>
              <p>供应商权限</p>
            </li>
            <li @click="$utils.toUrl('/pages/material/confirmation/index')">
              <image class="list-icon" src="/static/images/application/cailiaoqueren.png"></image>
              <p>材料确认单</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$appType === 2" title="合同管理" :hideTitle="false">
          <ul class="list">
            <li @click="$utils.toUrl('/pages/agreement/index')">
              <image class="list-icon" src="/static/images/application/hetongguanli.png"></image>
              <p>合同管理</p>
            </li>
          </ul>
        </uni-card>
        <!-- 开发商版本功能 end -->
        <uni-card title="常用办公" :hideTitle="false">
          <ul class="list">
            <!-- 施工版本功能 start -->
            <template v-if="$appType === 3">
              <li @click="$utils.toUrl('/pages/log/log')">
                <image class="list-icon" src="/static/images/application/shigongrizhi.png"></image>
                <p>施工日志</p>
              </li>
            </template>
            <!-- 施工版本功能 end -->
            <!-- 精装修版本功能 start -->
            <template v-if="$appType === 1">
              <li
                v-if="$hasPower('ConstructionLogSmartDecoration')"
                @click="$utils.toUrl('/pages/log-SmartDecoration/log')"
              >
                <image class="list-icon" src="/static/images/application/shigongrizhi.png"></image>
                <p>施工日志</p>
              </li>
              <li v-if="$hasPower('DecorationProgressSmartDecoration')" @click="$utils.toUrl('/pages/task/progress')">
                <image class="list-icon" src="/static/images/application/gongxuguanli.png"></image>
                <p>工序管理</p>
              </li>
              <li v-if="$hasPower('ContractSmartDecoration')" @click="$utils.toUrl('/pages/contract/index')">
                <image class="list-icon" src="/static/images/application/hetongguanli.png"></image>
                <p>合同管理</p>
              </li>
            </template>
            <!-- 精装修版本功能 end -->
            <!-- <li @click="$utils.toUrl('')">
              <image class="list-icon" src="/static/images/application/gongxuguanli.png"></image>
              <p>工序管理</p>
            </li>
            <li @click="$utils.toUrl('')">
              <image class="list-icon" src="/static/images/application/kaoqinshezhi.png"></image>
              <p>考勤设置</p>
            </li>
            <li @click="$utils.toUrl('')">
              <image class="list-icon" src="/static/images/application/hetongguanli.png"></image>
              <p>合同管理</p>
            </li> -->
            <li @click="$utils.toUrl(progressSimulation(1))">
              <image class="list-icon" src="/static/images/main/BIM.png"></image>
              <p>BIM模型</p>
            </li>
            <li v-if="$hasPower('Labour')" @click="$utils.toUrl('/pages/labour/labour-list')">
              <image class="list-icon" src="/static/images/application/laowu.png"></image>
              <p>劳务管理</p>
            </li>
            <li v-if="$hasPower('LabourSafety')" @click="$utils.toUrl('/pages/labour/safety/safety-list')">
              <image class="list-icon" src="/static/images/application/anquan.png"></image>
              <p>安全培训</p>
            </li>
            <li v-if="$hasPower('LabourWorker')" @click="$utils.toUrl('/pages/labour/healthy/healthy-user-list')">
              <image class="list-icon" src="/static/images/application/renyuan.png"></image>
              <p>人员健康</p>
            </li>
            <li
              v-if="$hasPower('LabourCompanyList')"
              @click="$utils.toUrl('/pages/labour/healthy/healthy-vehicle-list')"
            >
              <image class="list-icon" src="/static/images/application/cheliangxiaodu.png"></image>
              <p>车辆消毒</p>
            </li>
            <!-- <li @click="$utils.toUrl('/pages/task/material-list')">
              <image class="list-icon" src="/static/images/application/cailiaoqueren.png"></image>
              <p>材料清单</p>
            </li> -->
            <li v-if="$appType === 3" @click="$utils.toUrl('/pages/environmentalMonitoring/list')">
              <image class="list-icon" src="/static/images/application/shebeiguanli.png"></image>
              <p>环境监测</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('DataManage')" title="知识库" :hideTitle="false">
          <!--        <uni-card title="知识库" :hideTitle="false">-->
          <ul class="list">
            <li @click="$utils.toUrl('/pages/document/index?type=1')">
              <image class="list-icon" src="/static/images/application/anquanziliao.png"></image>
              <p>集团资料</p>
            </li>
            <li @click="$utils.toUrl('/pages/document/index?type=2')">
              <image class="list-icon" src="/static/images/application/jishufangan.png"></image>
              <p>行业资料</p>
            </li>
            <li @click="$utils.toUrl('/pages/document/index?type=3')">
              <image class="list-icon" src="/static/images/application/qitaziliao.png"></image>
              <p>项目资料</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'Application',
  data() {
    return {}
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  methods: {
    // 进度模拟
    progressSimulation(type) {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=${type}`)
    },
    // 跳转路由
    toUrl(url) {
      this.$utils.toUrl(url)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
