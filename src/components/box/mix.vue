<template>
 
  <!-- 搜索 -->
  <Form ref="searchRef" :config="Object.assign(search, {isSearch: true})" />
  <!-- 按钮 -->
  <el-col >
    <span v-if="api.Create && (!table.showSave || table.showSave(null))" >
      <button @click="handleCreate" class="btn btn-primary">新增</button>
    </span>
    <span v-for="(btn, i) in buttons.rules" :key="i">
      <button :disabled="state.selectedIds.length == 0" @click="handleOperate({ids: state.selectedIds}, btn)" class="btn btn-primary">{{ btn.label }}</button>
    </span>
  </el-col>

   <!-- 工具栏 -->
  <div id="toolbar" >
    <Refresh id="icon-refresh" @click="toolbarRefresh" />
  </div>

  <!-- 表格 -->
  <el-table :data="state.list" :border="table.showBorder || true" stripe v-loading="state.loading"
    @sort-change="sortChange" @selection-change="selectionChange" ref="tableRef" row-key="id" >
    <el-table-column v-if="table.showSelection" type="selection" width="55" />
    <el-table-column v-for="(item, i) in table.rules" :key="i" :label="item.label" :prop="item.prop"
      :fixed="item.fixed ? true : (item.label === '操作' ? 'right' : false)"
      :sortable="item.sortable ? 'custom' : false" 
      :width="getMinWidth(item)"
      >
      <template #default="scope">
        <!-- 数组类型以标签形式展示 -->
        <span v-if="item.ui === 'tags'">
          <el-tag v-for="(tag, j) in scope.row[item.prop]" :key="j" class="mr5"
            :type="['primary', 'success', 'warning'][j % 3]">{{ tag }}</el-tag>
        </span>
        <!-- 切换按钮 -->
        <span v-else-if="item.ui === 'switch'">
          <el-switch v-model.number="scope.row[item.prop]" :before-change="handleTableSwitchChange.bind(this, item.func, scope.row)" :active-value="1" :inactive-value="0" :active-text="item.activetext" :inactive-text="item.inactivetext" :disabled="item.disabled && item.disabled(scope.row)" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </span>
        <!-- 过长隐藏/可复制的 -->
        <span v-else-if="item.ui === 'tooltip' || item.ui === 'copy'">
          <Tooltip :content="scope.row[item.prop]?.toString()" :copy="item.ui === 'copy'" />
        </span>
        <!-- 图片 -->
        <span v-else-if="item.ui === 'image'">
          <el-image style="max-width: 60px;" :src="scope.row[item.prop]" :preview-src-list="[scope.row[item.prop]]"
            :preview-teleported="true" :hide-on-click-modal="true" :teleported="true" fit="cover" />
        </span>
        <!-- 视频 -->
        <span v-else-if="item.ui === 'video'" style="width: 70px; overflow: hidden;">
          <video :src="scope.row[item.prop]" style="max-height: 130px;" class="cursor-pointer"
            @click="playVideo(scope.row[item.prop])"></video>
        </span>
        <!-- 枚举变形 -->
        <span v-else-if="item.ui === 'select'">{{ item.items[scope.row[item.prop]]  }}</span>
        <span v-else-if="item.ui === 'selecthtml'">
          <el-select v-model="scope.row[item.prop]" @change="item.func($event, scope.row)">
            <el-option v-for="(name, key) in item.items" :key="key" :label="name" :value="computeOptionValue(key)"></el-option>
          </el-select>
        </span>
        <!-- 自定义html -->
        <!-- <span v-else-if="item.ui === 'html'" v-html="item.func(scope.row)" ></span> -->
        <!-- 链接 -->
        <span v-else-if="item.ui === 'link'"><a :href="item.func(scope.row)" target="_blank">{{ scope.row[item.prop] }}</a></span>
        <!-- 函数变形 -->
        <span v-else-if="item.func" v-html="item.func(scope.row)"></span>
        <!-- 操作栏 -->
        <span v-else-if="item.label === '操作'">
          <!-- 编辑 -->
          <span v-if="api.Update && (!table.showSave || table.showSave(scope.row))" >
            <span @click="handleUpdate(scope.row)" :class="`color-blue operate-btn`" >编辑</span>
          </span>
          <!-- 删除 -->
          <span v-if="api.Delete && (!table.showDelete || table.showDelete(scope.row))" >
            <el-popconfirm @confirm="handleDelete(scope.row)" title="是否确认删除？">
              <template #reference>
                <span :class="`color-red operate-btn`">删除</span>
              </template>
            </el-popconfirm>
          </span>
          <!-- 自定义操作 -->
          <span v-for="(btn, j) in item.items" :key="j">
            <span v-if="btn.confirm" v-show="btn.show ? btn.show(scope.row) : true">
              <el-popconfirm @confirm="handleOperate(scope.row, btn)" :title="btn.confirm">
                <template #reference>
                  <span :class="`color-blue operate-btn ${btn.class}`">{{ btn.label }}</span>
                </template>
              </el-popconfirm>
            </span>

            <span v-else-if="btn.title" v-show="btn.show ? btn.show(scope.row) : true">
              <span @click="handleOperateDialog(scope.row, btn)" :class="`color-blue operate-btn ${btn.class || ''}`" >{{ btn.label }}</span>
            </span>

            <span v-else v-show="btn.show ? btn.show(scope.row) : true" @click="handleOperate(scope.row, btn)" :class="`color-blue operate-btn ${btn.class || ''}`" >{{ btn.label }}</span>
          </span>
        </span>
        <!-- 直接展示 -->
        <span v-else>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>

  </el-table>

  <!-- 分页 -->
  <el-pagination  v-model:current-page="state.page" v-show="state.total != 0" :page-size="state.size" :page-sizes="[10, 20, 30]" style="margin: 15px 0;"
    :total="state.total"  @size-change="sizeChange" @current-change="pageChange" layout="->, total, sizes, prev, pager, next, jumper" />

  <!-- 视频播放 -->
  <el-dialog v-model="state.videoVisiable" width="50%" top="20px" @close="$refs.videoRef.pause()">
    <video controls :src="state.videoUrl" style="width:100%; max-height:800px" ref="videoRef" class="cursor-pointer"></video>
  </el-dialog>

  <!-- 新增和编辑弹窗 -->
  <Store ref="storeRef" :config="store" />

  <!-- 确认弹窗 -->
  <Dialog ref="dialogRef" />
</template>

<script>

import Tooltip from '@/components/ui/tooltip.vue'
import Dialog from '@/components/ui/dialog.vue'
import storage from '@/assets/js/storage'
import Form from '@/components/box/form.vue'
import Store from '@/components/box/store.vue'
import api from '@/config/api'


// Dom元素，需要在mounted里查找
var element = {
  export: null, // 工具栏导出
  refresh: null, // 工具栏刷新表格
}

const Vue = {
  components: { Tooltip, Dialog, Form, Store },
  props: {
    api: Object,
    config: Object,
  },
  setup(props, { emit }) {
    const { search, buttons, table, store } = props.config


    const state = reactive({
      loading: false,

      page: 1,
      size:  Number(storage.Get("size") || 10),
      total: 100,
      list: [],
      selectedIds: [],

      videoVisiable: false,
      videoUrl: '',
    })


    return {
      search, table, store, buttons,
      state, 
    }
  },
  // 页面被缓存后，仅此函数重新执行
  activated() {

  },
  mounted() {
    // 开启搜索栏
    this.$refs.searchRef.Open({}, this.Refresh)

    this.Refresh()
    element.export = document.querySelector('#icon-export')
    element.refresh = document.querySelector('#icon-refresh')
  },
  methods: {
    async Refresh() {
      if (this.state.loading) {
        return false
      }
      this.state.loading = true
      let query = this.$refs.searchRef.GetData()
      VITE_DEBUG && Object.keys(query).length && log("搜索", query )
      let params = Object.assign({ page: this.state.page, size: this.state.size }, query)
      let start = unix()
      let data = await this.api.List(params)
      // 接口太快，增加一个延迟效果
      setTimeout(() => {
        this.state.list = data?.list || []
        this.state.total = data?.total || 0
        this.state.loading = false
      }, unix() - start < 100 ? 100 : 0)
    },
    // page改变
    pageChange(page) {
      this.state.page = page
      this.Refresh()
    },
    sizeChange(size) {
      this.state.size = size
      this.state.page = 1
      storage.Set("size", size)
      this.Refresh()
    },
    // 字段排序 TODO
    sortChange(column) {
      this.Refresh()
    },
    selectionChange(selects) {
      let ids = []
      selects.forEach(item => {
        ids.push(item.id)
      })
      this.state.selectedIds = ids
    },
    // 表格内switch滑块改变
    async handleTableSwitchChange(func, row) {
      let data = await func(row)
      if (data) {
        alertSuccess("修改成功")
      }
      return data != null
    },
    // 自定义操作
    async handleOperate(row, item) {
      if (!row) {
        return
      }
      let refresh = await item.func(row)
      refresh && this.Refresh()
    },
    async handleOperateDialog(row, item) {
      this.$refs.dialogRef.Open(item.title, row, item.func, this.Refresh)
    },
    async handleCreate() {
      this.$refs.storeRef.Open({}, this.api.Create, this.Refresh)
    },
    async handleUpdate(row) {
      let copyed = copy(row)
      this.$refs.storeRef.Open(copyed, this.api.Update, this.Refresh)
    },
    async handleDelete(row) {
      let data = await this.api.Delete({id: row.id})
      if (data) {
        this.Refresh()
      }
    },
    // 下载
    async toobarExport() {

    },
    // 刷新表格
    async toolbarRefresh() {
      element.refresh.classList.add("rotate")
      await this.Refresh()
      setTimeout(_ => {
        element.refresh.classList.remove("rotate")
      }, 500)
    },
    // 播放视频
    playVideo(url) {
      this.videoUrl = url
      this.videoVisiable = true
    },
    // 解决类型导致的回显问题
    computeOptionValue(val) {
      if (isNaN(val) || val > Number.MAX_SAFE_INTEGER) {
        return val
      }
      return val * 1
    },
    getMinWidth(item) {
      if (item.width !== undefined) {
        return item.width + 'px'
      }
      if (item.label == 'ID') {
        return '100px'
      }
      if (item.label === '操作') {
        return '130px'
      }
      if (item.label.indexOf("时间") > -1 || item.label.indexOf("日期") > -1) {
        return '205px'
      }
      return 'auto'
    }
  },


}



export default Vue


</script>

<style lang="scss" scoped>

.operate-btn {
  margin: 0 5px;
  cursor: pointer;
}

#toolbar {
  float: right;
  padding: 3px 0;
  svg {
    display: inline-block;
    width: 20px;
    margin-right: 10px;
    color: #bbb;
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.el-table {
  border-radius: 5px;
  &:deep(th) {
    height: 66px;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.8);
    background-color: #FAFAFA !important;
  }
  &:deep(td) {
    height: 60px;
  }
}

/* 旋转动画， class增加rotate */
.rotate {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}

</style>