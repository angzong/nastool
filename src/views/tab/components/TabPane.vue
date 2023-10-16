<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="创建时间">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="用户信息">
      <template slot-scope="{row}">
        <span>{{ row.title }}</span>
        <el-tag>{{ row.type }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="用户名">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

   

   

    <el-table-column class-name="status-col" label="账号状态" width="110">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status!='using'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            启用
          </el-button>
          <el-button v-if="row.status!='disabled'" size="mini" @click="handleModifyStatus(row,'draft')">
            禁用
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
  </el-table>
</template>

<script>
import { fetchUser } from '@/api/article'
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  directives: { permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        using: 'success',
        disabled: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'editor'
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      fetchUser(this.listQuery).then(response => {
        this.list = response.data.items
        this.loading = false
      })
    }
  }
}
</script>

