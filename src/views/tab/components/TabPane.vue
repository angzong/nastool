<template>
  <div class="app-container">
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
      <!-- <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column min-width="200px" label="插件">
        <template slot-scope="{row}">
          <!-- <span>{{ row.userLevel }}</span> -->
          <el-tag v-for="item in row.plugins" :key="item">{{ item }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
    
      <el-table-column class-name="status-col" label="用户权限" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.userLevel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>  
</template>

<script>
import { fetchUser,deleteUser } from '@/api/user'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  directives: { permission,Pagination },
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
      total:0,
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
      const params={
        pageNum:this.listQuery.page,
        pageSize:this.listQuery.limit
      }
      fetchUser(params).then(response => {
        this.list = response.data.records
        this.total=response.data.total
        this.loading = false
      })
    },
    handleDelete(row,index){
      this.loading = true
      deleteUser(row.id).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
        this.loading = false
      }
      )

    }
  }
}
</script>

