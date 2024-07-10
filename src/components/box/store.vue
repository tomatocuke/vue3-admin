<template>
  <el-dialog v-model="state.visible" :header="state.title" width="600" destroy-on-close >
    <Form ref="formRef" :config="config" />

    <el-col style="margin: 40px 0 10px 40px;">
      <button @click="close" class="btn">取消</button>
      <button @click="handleSubmit" class="btn-primary" v-loading="state.loading">保存</button>
    </el-col>
  </el-dialog>
</template>

<script>
import Form from '@/components/box/form.vue'

export default {
  components: { Form },
  props: {
    config: Object,
  },
  data() {
 
    const state = reactive({
      visible: false,
      title: '',
      api: null,
      callback: null,
      originalData: {},
    })

    this.config.isSearch = false
    this.config.width = '430px'
    this.config.required = true

    return {
      state,
    }
  },
  mounted() {

  },
  methods: {
    Open(data, api, callback) {
      if (Object.keys(data).length == 0) {
        this.state.title = '新增'
      } else {
        this.state.title = '编辑'
        this.state.originalData = data
        data = copy(data)
        filter(data, this.config.rules)
      }
      this.state.visible = true
      setTimeout(_=>{
        this.$refs.formRef.Open(data)
        this.state.api = api
        this.state.callback = callback
      }, 10)
    },
    close() {
      this.state.visible = false
    },
    async handleSubmit() {
      let checkOK = await this.$refs.formRef.check()
      if (!checkOK) {
        return
      }
      // 对比改变
      let change = getchange(this.$refs.formRef.GetData(), this.state.originalData)
      if (!change) {
        VITE_DEBUG && log("数据无更改")
        this.close()
        return
      }
      log("提交数据", change)
      this.state.loading = true
        this.state.loading = false
        let data = await this.state.api(change).finally(_=>{ this.state.loading = false })
      if (data) {
        if (this.state.callback) {
          this.state.callback(data)
        }
        this.close()
      }
    },
  }
}

// 删除data中规则未定义的字段(id除外)
function filter(data, rules) {
  let rulekeys = rules.map(item => item.prop)

  Object.keys(data).forEach(key => {
    if (key != 'id' && !rulekeys.includes(key)) {
      delete data[key]
    }
  })
}

function getchange(newData, originalData) {
  let change = {}
  for (let key in newData) {
    let typ = typeof newData[key]
    if (key == 'id' || (typ != 'object' && newData[key] != originalData[key]) || typ == 'object' && JSON.stringify(newData[key]) != JSON.stringify(originalData[key]) ) {
      change[key] = newData[key]
    }
  }
  if (Object.keys(change).length == 1 && change['id'] ) {
    return null
  }
  return change
}

</script>

<style lang="scss" scoped>

</style>