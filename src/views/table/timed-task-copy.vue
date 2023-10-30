<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="优先级" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in invokeMethodTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        显示创建者
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重复" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.repeat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.invokeMethod | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="插件" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="创建者" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="已执行次数" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='using'" size="mini" type="success" @click="handleModifyStatus(row,'using')">
            启用
          </el-button>
          <el-button v-if="row.status!='disabled'" size="mini" @click="handleModifyStatus(row,'disabled')">
            禁用
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item label="是否允许并发执行" prop="type">
            <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
              <el-option v-for="item in invokeMethodTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item> -->
        <!-- <el-form-item label="插件" prop="content">
            <el-select v-model="temp.plugin" class="filter-item" placeholder="Please select">
              <el-option v-for="item in pluginTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="优先级">
            <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
          </el-form-item>
          <el-form-item label="重复周期">
            <el-checkbox-group v-model="checkboxVal">
                <el-checkbox label="Mon"> 周一 </el-checkbox>
                <el-checkbox label="Tue">周二</el-checkbox>
                <el-checkbox label="Wed">周三</el-checkbox>
                <el-checkbox label="Thur"> 周四 </el-checkbox>
                <el-checkbox label="Fri">周五</el-checkbox>
                <el-checkbox label="Sat">周六</el-checkbox>
                <el-checkbox label="Sun">周日</el-checkbox>
                <el-checkbox label="EveryDay">每天</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
          </el-form-item> -->
        <el-form-item label="任务组名">
          <el-input v-model="temp.jobGroup" />
        </el-form-item>
        <el-form-item label="任务名">
          <el-input v-model="temp.jobName" />
        </el-form-item>
        <el-form-item label="是否允许并发执行" prop="concurrent">
          <el-radio v-model="temp.concurrent" label="1">是</el-radio>
          <el-radio v-model="temp.concurrent" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="下一次执行时间">
          <el-time-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="请求方式" prop="invokeMethod">
          <el-select v-model="temp.invokeMethod" class="filter-item" placeholder="请选择">
            <el-option v-for="item in invokeMethodTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="请求参数">
          <el-input v-model="temp.invokeParam" />
        </el-form-item>
        <el-form-item label="调用目标字符串">
          <el-input v-model="temp.invokeTarget" />
        </el-form-item>
        <el-form-item label="corn计划策略">
          <el-input v-model="temp.misfirePolicy" />
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const defaultFormThead = ['Mon', 'Sun']
const invokeMethodTypeOptions = [
  { key: 'HTTP_GET', display_name: 'HTTP_GET' },
  { key: 'HTTP_POST', display_name: 'HTTP_POST' },
  { key: 'HTTP_PUT', display_name: 'HTTP_PUT' },
  { key: 'HTTP_DELETE', display_name: 'HTTP_DELETE' }
]
/* const pluginTypeOptions = [
    { key: 'CN', display_name: '影视类' },
    { key: 'US', display_name: '音乐类' },
    { key: 'JP', display_name: '图片' },
  ]*/

// arr to obj, such as { CN : "China", US : "USA" }
const invokeMethodTypeKeyValue = invokeMethodTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        using: 'success',
        disabled: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return invokeMethodTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      not_used: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      invokeMethodTypeOptions,
      // pluginTypeOptions,
      sortOptions: [{ label: '升序', key: '+id' }, { label: '降序', key: '-id' }],
      statusOptions: ['using', 'disabled'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        plugin: '',
        title: '',
        type: '',
        status: 'using',
        checkboxVal: ['Mon', 'Sun'],

        concurrent: '', // 是否允许并发执行
        timestamp: new Date(), // 下一次执行时间
        invokeMethod: '', // 请求方式
        invokeParam: '', // 请求参数
        invokeTarget: '', // 调用目标字符串
        jobGroup: '', // 任务组名
        jobName: '', // 任务名
        misfirePolicy: '' // cron计划策略
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      key: 1, // table key
      formTheadOptions: ['apple', 'banana', 'orange'],
      checkboxVal: defaultFormThead
    }
  },
  created() {
    this.getList()
  },
  // watch: {
  //     checkboxVal(valArr) {
  //     this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
  //     this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
  //     }
  // },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'using',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          this.temp.checkboxVal = this.checkboxVal
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
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
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
