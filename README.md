# cim6d-APP-decoration
新建精装修源码管理

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).





### 组件

#### 附件

```vue
<uni-attachment v-model="form.files" edit></uni-attachment>
```

edit: 是否可以上传

##### 选择人员

``` vue
<uni-select-user v-model="form.construcationNames" multiple></uni-select-user>
```

| 属性        | 说明                   | 类型   | 默认值 |
| ----------- | ---------------------- | ------ | ------ |
| multiple    | 是否多选               | 布尔   | false  |
| placeholder | input提示信息          | 字符串 | 请选择 |
| mode        | 1:文字形式  2:图像列表 | 数字   | 1      |

###### mode = 1

![demo](http://static.doveaz.xyz/img/20200507164559.png)

###### mode = 2

![demo](http://static.doveaz.xyz/img/20200509174403.png)

![示例](http://static.doveaz.xyz/img/20200507164739.png)



##### 选择器

```vue
<uni-select
     v-model="form.hhh"
     :options="[
         { label: '合格', value: 1 },
         { label: '不合格', value: 2 }
      ]"
></uni-select>
```

![演示](http://static.doveaz.xyz/img/20200509094957.png)

##### 头像

![demo](http://static.doveaz.xyz/img/20200512105314.png)

```vue
 <uni-avatar :user="user" :size="80"></uni-avatar>
```

```js
// user对象
user:{
    headImage:'http://aa.com/a.png',
    name:'小明'
}
```

##### 表单验证

跟element-ui的表单验证很像

都使用了async-validate

api也差不多

```vue
<template>
	<uni-form-custom
        ref="form"
        :model="form"
        :rules="rules"
      >
        <uni-card>
          <uni-form-item label="检查名称" prop="planName">
            <textarea v-model.trim="form.planName" auto-height placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="检查性质" isLink prop="planNature">
            <uni-select v-model="form.planNature" :options="planNatureList"></uni-select>
          </uni-form-item>
          <uni-form-item label="检查项目" prop="inspectItem">
            <textarea v-model.trim="form.inspectItem" auto-height placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="检查部位" prop="inspectArea">
            <textarea v-model.trim="form.inspectArea" auto-height placeholder="请输入内容" />
          </uni-form-item>
          <view class="btn-wrapper">
          	<button class="button" type="primary" @click="submit">保存</button>
           </view>
          <uni-card/>
 	</uni-form-custom>
</template>
    
    
 <script>
    export default {
        data(){
          return {
             form:{
                 
             },
             rules: {
                    planName: { required: true },
                    planNature: { required: true },
                    inspectItem: { required: true },
                    inspectArea: { required: true }
                }
          }  
        },
        methods:{
            async submit(){
              await this.$refs.form.validate()
              // 提交
            }
        }
    }
 </script>
```

