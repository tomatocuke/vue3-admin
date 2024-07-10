<template>
  <Mix :config="config" :api="api" />
</template>

<script>
import Mix from '@/components/box/mix.vue'
import api from '@/config/api'
import auth from '@/config/auth'


const allpermissions = [{id: 0, name: '全部'}]

api.Role.Permission().then(data => {
  allpermissions.push(...data)
})

const config = {
  search: {
    rules: [],
  },
  buttons: {
    rules: [],
  },
  store: {
    rules: [
      {label: '角色名称', prop: 'name'},
      {label: '选择权限', prop: 'permissions', ui: 'tree', items: allpermissions, default: allpermissions },
    ]
  },
  table: {
    showSave: (row) => { return auth.allow[13] },
    showDelete: (row) => {return auth.allow[14] },
    rules: [
      {label: 'ID', prop: 'id'},
      {label: '名称', prop: 'name'},
      {label: '操作', items: []},
    ]
  }
}

export default {
  components: { Mix },
  setup() {
    return {
      api: api.Role,
      config,
    }
  },
}

</script>
