<template>
  <uni-card isForm>
    <uni-form-item label="选择单元" isLink>
      <uni-select v-model="selectFloorValue" :options="SelectFloorList"></uni-select>
    </uni-form-item>
    <uni-form-item label="选择工序" isLink @click="showModal('entityRef')">
      <textarea :value="floorScheduleNames" :ids.sync="floorScheduleIds" auto-height disabled placeholder="请选择" />
    </uni-form-item>

    <!-- 选择位置 start -->
    <uni-drawer ref="entityRef" class="drawer" mode="right" :width="750">
      <div class="header">
        <span class="close" @click="hideModal('entityRef')">取消</span>
        <span class="title">选择位置</span>
        <span class="save" @click="changeEntity('treeEntityRef')">完成</span>
      </div>
      <uni-search-bar placeholder="搜索" @input="changeKeyWordsEntity" />
      <scroll-view class="scroll-roll" scroll-y>
        <div class="content">
          <uni-tree
            ref="treeEntityRef"
            :treeData="treeEntity"
            defaultExpandAll
            :props="treeProps"
            node-key="id"
            checkOnlyLeaf
            showCheckbox
            checkOnClickNode
            :defaultCheckedKeys="defaultCheckedKeys"
          />
        </div>
      </scroll-view>
    </uni-drawer>
    <!-- 选择位置 end -->
  </uni-card>
</template>

<script>
import { find, isNull } from 'lodash'
import { workingAPI } from '@/api/working'
import { bimAPI } from '@/api/bim'
import treeForEach from '@/utils/treeForEach'
import toTree from '@/utils/toTree'
export default {
  name: 'SelectEntity',
  props: {
    // 接收选择的构件或其他服务使用
    uUid: {
      type: [String, Number],
      default: ''
    },
    // 默认选中的单元ID
    floorId: {
      type: String,
      default: ''
    },
    // 默认选中的工序名称
    floorScheduleNames: {
      type: String,
      default: ''
    },
    // 默认选中的工序Id
    floorScheduleIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      entityList: [], // 单体列表
      keyWordsEntity: '', // 单体搜索关键词
      entityId: '', // 选择的单体id
      entityName: '',
      configId: '',
      // 楼层相关参数
      floorList: [], // 楼层列表
      keyWordsFloor: '', // 楼层搜索关键词
      floorIds: [], // 选择的楼层ID集合
      floorNames: [], // 选择的楼层名字集合
      selectFloorIds: [], // 保存的楼层ID集合
      selectFloorNames: [], // 保存的楼层名字集合
      // 工序相关参数
      procedureList: [], // 工序列表
      keyWordsProcedure: '', // 工序搜索关键词
      procedureIds: [], // 选择的工序ID集合
      procedureNames: [], // 选择的工序名字集合
      selectProcedureIds: [], // 保存的工序ID集合
      selectProcedureNames: [], // 保存的工序名字集合
      formData: [], // 最终保存的表单数据
      treeDataAll: [], // 全部树
      treeEntity: [], // 选择楼层树
      treeEntityBack: [],
      treeComponent: [], // 选择构建树
      treeComponentBack: [],
      treeProps: {
        // label: 'name',
        label: (data, node) => {
          return data.name || data.mainProcedure
        },
        disabled: (data, node) => {
          return data.status !== 1
        },
        children: 'children'
      },
      /*选择单元*/
      SelectFloorList: [],
      selectFloorValue: '',
      activeProcedureId: '',
      defaultCheckedKeys: []
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  watch: {
    selectFloorValue: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getBimNewTree()
          this.$emit('update:floorId', val)
        }
      }
    }
  },
  created() {
    this.selectFloorValue = this.floorId
    this.defaultCheckedKeys = this.floorScheduleIds.split(',')
  },
  mounted() {
    this.getProcedureList()
  },
  methods: {
    // 获取BIM树
    async getBimNewTree() {
      if (!this.projectId) {
        return
      }
      const res = await this.fly.construction.get(`/working/procedure/floor/schedule/list/${this.selectFloorValue}`)
      res.data.forEach(e => {
        if (e.volist) {
          e.children = e.volist.map(item => {
            item.id = item.scheduleId
            item.parentName = e.name
            item.parentId = e.id
            return item
          })
        }
      })
      let list = toTree(res.data, 'pid')
      treeForEach(list, (item, parent, index) => {
        if (index !== 0) {
          item.prevStatus = parent.children[index - 1].status
          item.prevActualStartTime = parent.children[index - 1].actualStartTime
        } else {
          item.isFirst = true
        }
      })
      console.log(list)
      this.treeEntity = list
    },
    getProcedureList() {
      this.fly.construction
        .post(`working/procedure/config/list`, {
          page: 1,
          rows: 1000,
          status: 1,
          projectId: localStorage.getItem('projectId')
        })
        .then(res => {
          // if (!this.activeProcedureId && res.data.records.length) {
          //   this.activeProcedureId = _.first(res.data.records).id
          // }
          this.SelectFloorList = res.data.records.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        })
    },

    // 确定选择位置
    changeEntity(key) {
      let nodes = this.$refs[key].getCheckedNodes()
      if (nodes.length === 0) {
        this.$utils.showToast('请先选择工序')
      }
      let result = _.map(nodes, e => {
        return {
          parentName: e.parentName,
          parentId: e.parentId,
          id: e.id,
          scheduleId: e.id,
          name: e.mainProcedure,
          fullName: e.parentName + e.mainProcedure,
          mainProcedure: e.mainProcedure
        }
      })
      this.$emit('update:floorScheduleIds', _.map(result, 'scheduleId').join(','))
      this.$emit('update:floorScheduleNames', _.map(result, 'fullName').join(','))
      this.$emit('selected', result)
      this.$refs.entityRef.close()
    },
    // getFloorValue(e) {
    //   this.activeProcedureId = e
    //   this.$emit('update:floorId', e)
    // },

    // 显示选择模态框
    showModal(key) {
      this.$refs[key].open()
    },

    // 关闭选择模态框
    hideModal(key) {
      this.$refs[key].close()
    },
    // 搜索单体
    changeKeyWordsEntity({ value }) {
      this.keyWordsEntity = value
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/components/uni-select-entity/uni-select-entity.less';
</style>
