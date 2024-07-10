<template>
  <el-tree
    ref="tree"
    :data="list"
    show-checkbox
    node-key="id"
    :default-expanded-keys="[]"
    :default-checked-keys="checked"
    :props="props"
    :check-strictly="true"
    @check-change="handleCurrentChange"
  />
</template>

<script>

export default {
  props: {
    list: {type:Array, default: []},
    checked: {type:Array, default: []},
  },
  setup(props) {
    var allnodes = []
    props.list.forEach(i => {
      allnodes.push(i)
      i.children?.forEach(j => {
        allnodes.push(j)
        j.children?.forEach(k => {
          allnodes.push(k)
        })
      })
    })

    return {
      allnodes,
      props: {
        children: 'children',
        label: 'name',
      },
    }
  },
  methods: {
    getData() {
      return [].concat(this.$refs.tree.getHalfCheckedKeys()).concat(this.$refs.tree.getCheckedKeys())
    },
    handleCurrentChange(node, isChecked) {
      if (node.id == 0) {
        if (isChecked) {
          this.$refs.tree.setCheckedNodes(this.allnodes)
        } else {
          this.$refs.tree.setCheckedNodes([])
        }
      }
      if (!isChecked && node.id != 0) {
        // this.$refs.tree.setCurrentNode(node)
        // this.$refs.tree.setCheckedNodes(this.list.slice(1))
      }
    }

  },
}
</script>