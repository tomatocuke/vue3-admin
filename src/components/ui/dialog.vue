<template>
 
  <el-dialog
    v-model="state.visible"
    title="Tips"
    width="500"
  >
    <div class="title">{{ state.title }}</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
  
</template>


<script>
export default {
  props: {

  },
  setup() {
    const state = reactive({
      visible: false,
      title: '',
      func: null,
      row: {},
      callback: null,
    })
    return {
      state
    }
  },
  methods: {
    Open(title, row, func, callback) {
      this.state.title = title
      this.state.func = func
      this.state.row = row
      this.state.callback = callback
      this.state.visible = true
    },
    async handleSubmit() {
      this.state.visible = false
      let data = await this.state.func(this.state.row)
      if (data) {
        this.state.callback()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  margin: 30px 10px;
}
</style>