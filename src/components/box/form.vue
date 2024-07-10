<template>

  <el-form :model="state.data" ref="formRef" :label-width="config.isSearch ? 0 : 100" :inline="config.isSearch" @submit.prevent>
    <span v-for="(item, i) in config.rules" :key="i">
      <el-form-item
        :label="item.label" :prop="item.prop"
        :style="{width: item.width ?? config?.width ?? (item.ui == 'hidden' ? '0' : '220px') }"
        v-show="item.show ? item.show(item) : true" :rules="item.rules" >
        <!-- 下拉选择：如果开启multiple则该字段自动变为数组 -->
        <el-select v-if="item.ui === 'select'" v-model="state.data[item.prop]" :placeholder="item.placeholder"
          :multiple="item.multiple || false" fit-input-width clearable :filterable="item.filterable || false">
          <el-option v-for="(name, key) in item.items" :key="key" :label="name" :value="computeOptionValue(key)"></el-option>
        </el-select>
        <!-- 日期选择器 -->
        <Daterange v-else-if="item.ui === 'daterange'" :data="state.data" :prop="item.prop" />
        <!-- 日期时间选择 -->
        <el-date-picker v-else-if="item.ui === 'datetime'" v-model="state.data[item.prop]" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
        <el-date-picker v-else-if="item.ui === 'date'" v-model="state.data[item.prop]" type="date" value-format="YYYY-MM-DD" />
        <!-- 单选 -->
        <el-radio-group v-else-if="item.ui === 'radio'" v-model="state.data[item.prop]" class="ml5">
          <el-radio v-for="(name, key) in item.items" :key="key" :label="name" :value="computeOptionValue(key)" />
        </el-radio-group>
        <!-- 多选 -->
        <el-checkbox-group v-else-if="item.ui === 'checkbox'" v-model="state.data[item.prop]">
          <el-checkbox v-for="(name, key) in item.items" :key="key" :label="name" :value="computeOptionValue(key)" />
        </el-checkbox-group>
        <!-- 自定义标签 -->
        <el-col v-else-if="item.ui === 'tags'"><Tag :tags="state.data[item.prop]" ></Tag></el-col>
        <!-- 树 -->
        <Tree v-else-if="item.ui === 'tree'" ref="tree" :list="item.items" :checked="state.data[item.prop]" />
        <!-- 开关 -->
        <el-switch v-else-if="item.ui === 'switch'" v-model.number="state.data[item.prop]" :active-value="1" :inactive-value="0" :active-text="item.activetext" :inactive-text="item.inactivetext" />
        <!-- 文本框 -->
        <el-input v-else-if="item.ui === 'textarea'" v-model="state.data[item.prop]" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :placeholder="item.placeholder">{{ item.text }}</el-input>
        <!-- 图片/视频/文件上传 -->
        <el-col v-else-if="item.ui === 'upload'"><Upload :config="item.config" :form="state.data" :prop="item.prop"></Upload></el-col>
        <!-- 隐藏值 -->
        <el-input v-else-if="item.ui === 'hidden'" type="hidden" v-model="state.data[item.prop]" />
        <!-- 数字输入框 -->
        <el-input v-else-if="item.ui === 'number'" v-model.number="state.data[item.prop]" type="number" :placeholder="item.placeholder"  />
        <!-- 默认字符输入框 -->
        <el-input v-else v-model="state.data[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled ? item.disabled(item) : false" />
      </el-form-item>
    </span>

    <el-form-item v-if="config.isSearch && config.rules.length > 0">
      <button :class="`btn btn-primary`" @click="handleSearch">搜索</button>
      <button :class="`btn`" @click="handleReset">重置</button>
    </el-form-item>
  </el-form>

</template>

<script>

import Tag from '@/components/ui/tag.vue'
import Upload from '@/components/ui/upload.vue'
import Daterange from '@/components/ui/daterange.vue'
import Tree from '@/components/ui/tree.vue'

const Vue = {
  components: { Tag, Upload, Daterange, Tree },
  props: {
    config : Object,
  },
  data() {
    if (this.config.rules === undefined) {
      this.config.rules = []
    }

    const { rules } = this.config

    const state = reactive({
      data: {},
    })

    // 自动补充配置
    if (Array.isArray(rules)) {
      fillRules(rules, this.config.required || false)
    } else if (rules != undefined) {
      log("错误的rules", rules)
    }

    rules?.forEach(item => {
      // 获取下拉数据
      if (item.ui == 'select' && item.func) {
        item.func().then(data => { item.items = data })
      }

      // 默认数据
      if (state.data[item.prop] == undefined) {
        if (item.ui == 'checkbox' || item.ui == 'tags') {
          state.data[item.prop] = []
        }
      }

      if (item.default != undefined) {
        state.data[item.prop] = item.default
      }
    })

    return {
      state,
    }
  },

  methods: {
    Open(data, api, callback) {
      if (Object.keys(data).length > 0) {
        this.state.data = data
      }
      this.state.api = api
      this.state.callback = callback
    },
    GetData() {
      return this.state.data
    },
    async handleButton(func) {
      await func()
    },
    async handleSearch() {
      let ok = await this.check()
      if (!ok) {
        return
      }
      ok = await this.state.api()
      if (ok && this.state.callback) {
        return this.state.callback()
      }
      return true
    },
    handleReset() {
      for (let key in this.state.data) {
        delete(this.state.data[key])
      }
      this.handleSearch()
    },
    async check() {
      this.config.rules.forEach(item => {
        if (item.ui == 'tree') {
          this.state.data[item.prop] = this.$refs.tree[0].getData()
        }
      })

      return await this.$refs.formRef.validate( (valid, fields) => {
        return valid
      })
    },
    // 解决类型导致的回显问题
    computeOptionValue(val) {
      if (isNaN(val) || val > Number.MAX_SAFE_INTEGER) {
        return val
      }
      return val * 1
    },

  },


}

function fillRules(rules, defaultRequired) {
  rules.forEach((item, index) => {
    let required = defaultRequired
    if (item.required != undefined) {
      required = item.required
    }
    if (required) {
      // 校验规则
      rules[index].rules = Object.assign({
        required: true,
        type: getType(item.default, item.ui),
        message: `请填写`,
        trigger: 'blur',
      }, item.rules)

      if (item.ui == 'select' || item.ui == 'checkbox') {
        rules[index].rules.message = '请选择'
      } else if (item.ui == 'upload') {
        rules[index].rules.message = '请上传'
      }

      if (item.placeholder == undefined) {
        rules[index].placeholder = rules[index].rules.message
      }
    }
  })
 
}


function getType(defaultVal, ui) {
  if (defaultVal != undefined) {
    if (Array.isArray(defaultVal)) {
      return 'array'
    }
    return typeof defaultVal
  }

  if (['checkbox', 'tags'].includes(ui)) {
    return 'array'
  }

  if (ui == 'number' || (ui == 'select')) {
    return 'number'
  }
  
  return 'string'
}


export default Vue

</script>

<style lang="scss" scoped>
.el-select, 
.el-input, 
.el-textarea { 
  width: 100%;
}

</style>