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
          <el-tag v-for="item in row.plugins" :key="item" style="margin: 10px;">{{ item }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showPassword" width="200px" align="center" label="密码">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
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
            <!-- <el-button v-if="row.status!='using'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
              启用
            </el-button>
            <el-button v-if="row.status!='disabled'" size="mini" @click="handleModifyStatus(row,'draft')">
              禁用
            </el-button> -->
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
            <el-button size="mini" type="primary" @click="handleEdit(row,$index)">
              编辑
            </el-button>
          </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 修改信息对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="用户权限">
          <el-select v-model="temp.userLevel" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="插件" prop="plugins">
          <el-tag v-for="item in temp.plugins" :key="item" style="margin: 10px;">{{ item }}</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchUser,deleteUser,updateUser } from '@/api/user'
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
      default: 'ADMIN'
    }
  },
  data() {
    return {
      list: null,
      total:0,
      showPassword:false,
      dialogFormVisible:false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      statusOptions: ['ADMIN','ADV_USER','GUEST','SYS_ADMIN','USER'	],
      temp:     {
        "email": "",
        "id": 0,
        "password": "",
        "plugins": [],
        "userLevel": "",
        "username": ""
      },
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
    //获取用户列表，打开页面时展示的数据，调动api的函数fetchUser
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
    //用不到
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //点击编辑
    handleEdit(row,index) {
      this.temp=row
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //我留了新建用户的接口，用就改改，不用就算了
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    //对话框点击确认后，调api
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData.id,tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    //删除用户，调用api
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

