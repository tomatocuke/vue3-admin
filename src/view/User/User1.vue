<template>
  <Mix :api="api" :config="config" />
</template>


<script>
import Mix from '@/components/box/mix.vue'
import api from '@/util/api'
import auth from '@/util/auth'


const gender = {1: '男', 2: '女', 3: '沃尔玛塑料袋'}

const config = {
  search: {
    rules: [
      {label: '名字', prop: 'name'},
      {label: '性别', prop: 'gender', ui: 'select', items: gender },
      {label: '创建时间', prop: 'create_time', ui: 'daterange', width: 240},
    ]
  },
  buttons: {
    rules: [
    ],
  },
  store: {
    rules: [
      {label: '名字', prop: 'name'},
      {label: '年龄', prop: 'age', ui: 'number', required: false},
      {label: '爱好', prop: 'likes', ui: 'tags'},
      {label: '性别', prop: 'gender', ui: 'select', items: gender },
    ]
  },
  table: {
    showSave: (row) => { return auth.allow[4] && (row == undefined || row.id != 1) },
    showDelete: (row) => {return auth.allow[5] },
    rules: [
      {label: 'ID', prop: 'id'},
      {label: '名字', prop: 'name', ui: 'copy'},
      {label: '年龄', prop: 'age'},
      {label: '爱好', prop: 'likes', ui: 'tags'},
      {label: '性别', prop: 'gender', ui:'select', items: gender },
      {label: '操作', width: 200, items: [
        {label: '弹出信息', title: '确认弹出信息吗？', show: (row) => { return row.id == 2 }, func: (row) => { alertSuccess("当前行：" + JSON.stringify(row)) }}
      ]}
    ]
  }
}

export default {
  name: 'app',
  components: { Mix },
  data() {
    return {
      api: api.User,
      config,
    }
  },
}
</script>