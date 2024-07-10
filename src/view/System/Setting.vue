<template>
  <Form :config="config" />
</template>


<script>
import Form from '@/components/box/Form.vue'



const config = {
  isSearch: false,
  width: '400px',
  rules: [
    {label: '参数1', prop: 'v1', default: '哈哈'},
    {label: '参数2', prop: 'v2', ui:'select', items: {0: '否', 1: '是'} },
    {label: '参数3', prop: 'v3', ui: 'switch', default: 1},
    {label: '参数4', prop: 'v4', ui: 'number', default: 999},
    {label: '参数5', prop: 'v5', ui: 'checkbox', items: {0: '否', 1: '是'}},
    {label: '参数6', prop: 'v6', ui: 'radio', items: {0: '否', 1: '是'}},
    {label: '参数7', prop: 'v7', ui: 'textarea'},

  ]
}

export default {
  name: 'app',
  components: { Form },
  data() {
    return {
      config,
    }
  },
}
</script>