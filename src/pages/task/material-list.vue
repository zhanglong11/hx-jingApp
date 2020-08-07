<template>
  <view class="wrapper">
    <div class="aside">
      <h3 :class="[curId ? '' : 'active']" @click="tipRoom">{{ roomName }}</h3>
      <p
        v-for="item in processList"
        :key="item.id"
        :class="['menu', curId === item.scheduleId ? 'active' : '']"
        @click="tipRoom(item)"
      >
        {{ item.mainProcedure }}
      </p>
    </div>
    <div class="content">
      <uni-search-bar
        class="search"
        placeholder="搜索"
        @confirm="handleSearchBarConfirm"
        @input="handleSearchBarInput"
      ></uni-search-bar>
      <div>
        <uni-card v-for="item in contentList" :key="item.id">
          <view class="card-body">
            <view class="card-info">
              <p class="title">{{ item.materialName }}</p>
              <view class="flex-item">
                <p>
                  <span class="label">备注:</span><span class="info-item">{{ item.materialRemark }}</span>
                </p>
                <p>
                  <span class="label">库存:</span
                  ><span class="info-item">{{ item.materialInventoryNumber }}{{ item.materialUnit }}</span>
                </p>
              </view>
              <view class="flex-item">
                <p>
                  <span class="label">计划使用:</span
                  ><span class="info-item">{{ item.planConsumeNum }}{{ item.materialUnit }}</span>
                </p>
                <p>
                  <span class="label">实际使用:</span
                  ><span
                    :class="[
                      'info-item',
                      item.planConsumeNum !== item.actualConsumeNum
                        ? item.planConsumeNum > item.actualConsumeNum
                          ? 'less'
                          : 'more'
                        : ''
                    ]"
                    >{{ item.actualConsumeNum }}{{ item.materialUnit }}</span
                  >
                </p>
              </view>
            </view>
          </view>
        </uni-card>
      </div>
    </div>
  </view>
</template>

<script>
import { workingAPI } from '@/api/working'
export default {
  components: {},
  data() {
    return {
      processList: [],
      roomName: '',
      contentList: [],
      curId: null
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  onLoad(options) {
    this.libraryId = options.libraryId || ''
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    async refresh() {
      console.log(this.libraryId)
      if (!this.projectId || !this.libraryId) {
        return
      }
      const res = await workingAPI.getProcessList({ projectId: this.projectId, libraryId: this.libraryId })
      this.roomName = res.data.libraryName
      this.processList = res.data.procedureList
      this.getDetail({})
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.keyword = e.value.trim()
      this.getDetail()
    },

    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.keyword = ''
      this.getDetail()
    },
    tipRoom(item) {
      this.curId = item?.scheduleId || null
      this.getDetail()
    },
    async getDetail() {
      const res = await workingAPI.getRoomMaterialList({
        keyword: this.keyword,
        projectId: this.projectId,
        libraryId: this.libraryId,
        scheduleId: this.curId
      })
      this.contentList = res.data
    }
  }
}
</script>

<style scoped lang="less">
@import './material-list.less';
</style>
