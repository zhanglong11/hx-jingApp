<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <image :src="materialImg" class="material" mode="widthFix" />
      <view class="main-body" style="display: none;">
        <view class="table">
          <!-- 头部区域 -->
          <view class="flex-box thead border-right border-top">
            <view class="border-bottom border-left  item-70">
              <view class="content-text">工程类别</view>
            </view>
            <view class="border-bottom border-left   item-70">
              <view class="content-text">功能区域</view>
            </view>
            <view class="border-bottom border-left   item-70">
              <view class="content-text">区域分项</view>
            </view>
            <view class="border-bottom border-left   item-65">
              <view class="content-text">序号</view>
            </view>
            <view class="border-bottom border-left   item-auto">
              <view class="content-text">项目名称</view>
            </view>
            <view class="border-bottom border-left   item-70">
              <view class="content-text">单位</view>
            </view>
            <view class="border-bottom border-left  item item-100">
              <view class="content-text">工程量（A）</view>
            </view>
          </view>
          <view class="flex-box tbody border-bottom border-right">
            <!-- 第一列开始 -->
            <view class="  border-left  item-70">
              <view class="content-text top-200">装饰工程</view>
            </view>
            <!-- 第一列结束 -->
            <!--  -->
            <view class=" item-auto">
              <!-- 第一个区域开始 -->
              <view class="flex-box border-bottom">
                <!-- 第二列开始 -->
                <view class=" item-70   border-left">
                  <view class="content-text">客厅、餐厅、玄关及走廊</view>
                </view>
                <!-- 第二列结束 -->
                <view class=" item-auto  border-left ">
                  <view class="flex-box">
                    <view class=" item-70   border-left">
                      <view class="content-text">地面</view>
                    </view>
                    <view class=" item-auto">
                      <!-- 序号1的项目名称,单位，工程量等内容开始 -->
                      <view class="flex-box">
                        <view class=" item-65   border-left">
                          <view class="content-text">1</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">地面 瓷砖 CT-01(800*800mm)</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">25.67</view>
                        </view>
                      </view>
                      <!-- 序号1的项目名称,单位，工程量等内容结束 -->
                    </view>
                  </view>
                  <view class="flex-box border-top">
                    <view class=" item-70   border-left">
                      <view class="content-text">墙面</view>
                    </view>
                    <view class=" item-auto">
                      <view class="flex-box">
                        <view class=" item-65   border-left">
                          <view class="content-text">1</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">米灰色乳胶漆 PT-03 </view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">54.04</view>
                        </view>
                      </view>
                    </view>
                  </view>
                  <view class="flex-box border-top">
                    <view class=" item-70   border-left">
                      <view class="content-text">天花</view>
                    </view>
                    <view class=" item-auto">
                      <!-- 序号1的项目名称,单位，工程量等内容开始 -->
                      <view class="flex-box">
                        <view class=" item-65   border-left">
                          <view class="content-text">1</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">轻钢龙骨石膏板吊顶（含100mm宽灯槽）</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">14.39</view>
                        </view>
                      </view>
                      <!-- 序号1的项目名称,单位，工程量等内容结束 -->
                      <!--  -->
                      <!-- 序号2的项目名称,单位，工程量等内容开始 -->

                      <view class="flex-box border-top">
                        <view class=" item-65   border-left">
                          <view class="content-text">2</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">吊顶白色乳胶漆 PT-01</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">14.39</view>
                        </view>
                      </view>
                      <!-- 序号2的项目名称,单位，工程量等内容结束 -->
                      <!--  -->
                      <!-- 序号3的项目名称,单位，工程量等内容开始 -->

                      <view class="flex-box border-top">
                        <view class=" item-65   border-left">
                          <view class="content-text">3</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">原顶白色乳胶漆 PT-01</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">14.39</view>
                        </view>
                      </view>
                      <!-- 序号3的项目名称,单位，工程量等内容结束 -->
                      <!--  -->
                      <!-- 序号4的项目名称,单位，工程量等内容开始 -->

                      <view class="flex-box border-top">
                        <view class=" item-65   border-left">
                          <view class="content-text">4</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">200mm宽窗帘盒</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">4.39</view>
                        </view>
                      </view>
                      <!-- 序号4的项目名称,单位，工程量等内容结束 -->
                      <!--  -->
                    </view>
                  </view>
                </view>
              </view>
              <!-- 第一个区域结束 -->
              <!--  -->
              <!--  -->
              <!-- 第二个区域开始 -->
              <view class="flex-box  border-bottom">
                <view class=" item-70   border-left">
                  <view class="content-text">主卧及衣帽间</view>
                </view>
                <view class=" item-auto  border-left ">
                  <view class="flex-box">
                    <view class=" item-70   border-left">
                      <view class="content-text">地面</view>
                    </view>
                    <view class=" item-auto">
                      <!-- 序号1的项目名称,单位，工程量等内容开始 -->
                      <view class="flex-box">
                        <view class=" item-65   border-left">
                          <view class="content-text">1</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">地面 瓷砖 CT-01(800*800mm)</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">25.67</view>
                        </view>
                      </view>
                      <!-- 序号1的项目名称,单位，工程量等内容结束 -->
                    </view>
                  </view>
                  <view class="flex-box border-top">
                    <view class=" item-70   border-left">
                      <view class="content-text">墙面</view>
                    </view>
                    <view class=" item-auto">
                      <view class="flex-box">
                        <view class=" item-65   border-left">
                          <view class="content-text">1</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">米灰色乳胶漆 PT-03 </view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">54.04</view>
                        </view>
                      </view>
                    </view>
                  </view>
                  <view class="flex-box border-top">
                    <view class=" item-70   border-left">
                      <view class="content-text">天花</view>
                    </view>
                    <view class=" item-auto">
                      <!-- 序号1的项目名称,单位，工程量等内容开始 -->
                      <view class="flex-box">
                        <view class=" item-65   border-left">
                          <view class="content-text">1</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text"
                            >轻钢龙骨石膏板吊顶轻钢龙骨石膏板吊顶轻钢龙骨石膏板吊顶（含100mm宽灯槽）</view
                          >
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">14.39</view>
                        </view>
                      </view>
                      <!-- 序号1的项目名称,单位，工程量等内容结束 -->
                      <!--  -->
                      <!-- 序号2的项目名称,单位，工程量等内容开始 -->

                      <view class="flex-box border-top">
                        <view class=" item-65   border-left">
                          <view class="content-text">2</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">吊顶白色乳胶漆 PT-01</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">14.39</view>
                        </view>
                      </view>
                      <!-- 序号2的项目名称,单位，工程量等内容结束 -->
                      <!--  -->
                      <!-- 序号3的项目名称,单位，工程量等内容开始 -->

                      <view class="flex-box border-top">
                        <view class=" item-65   border-left">
                          <view class="content-text">3</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">原顶白色乳胶漆 PT-01</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">14.39</view>
                        </view>
                      </view>
                      <!-- 序号3的项目名称,单位，工程量等内容结束 -->
                      <!--  -->
                      <!-- 序号4的项目名称,单位，工程量等内容开始 -->

                      <view class="flex-box border-top">
                        <view class=" item-65   border-left">
                          <view class="content-text">4</view>
                        </view>
                        <view class=" item-auto   border-left">
                          <view class="content-text">200mm宽窗帘盒</view>
                        </view>
                        <view class=" item-70   border-left">
                          <view class="content-text">㎡</view>
                        </view>
                        <view class=" item-100   border-left">
                          <view class="content-text">4.39</view>
                        </view>
                      </view>
                      <!-- 序号4的项目名称,单位，工程量等内容结束 -->
                      <!--  -->
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      materialImg: '../../static/bim/material.jpg'
    }
  },
  onLoad(options) {
    this.init(options)
  },
  methods: {
    // 初始化
    init(options) {
      console.log(options)
      this.$utils.setTitle(options.title || '材料清单')
      let floor = parseInt(options.floor)
      let floorUrl = '2f'
      if (floor < 0) {
        floorUrl = '-1f'
      }
      if (floor === 1) {
        floorUrl = '1f'
      }
      this.materialImg = require(`../../static/bim/${floorUrl}.png`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./materials.less');
</style>
