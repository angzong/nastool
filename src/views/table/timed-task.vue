<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-select v-model="listQuery.importance" placeholder="优先级" clearable style="width: 90px" class="filter-item">-->
<!--        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
<!--      </el-select>-->
<!--      <el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in invokeMethodTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
<!--      </el-select>-->
<!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
<!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
<!--      </el-select>-->
<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
<!--        查找-->
<!--      </el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
<!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
<!--        导出-->
<!--      </el-button>-->
<!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
<!--        显示创建者-->
<!--      </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="records"
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
      <el-table-column label="任务组名" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jobGroup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.jobName }}</span>
          <el-tag>{{ row.invokeMethod | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime.date }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="创建者" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="更新者" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="130">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleStart(row)">
            启动
          </el-button>
          <el-button size="mini" type="normal" @click="handleRunOnce(row)">
            执行一次
          </el-button>
          <el-button size="mini" type="danger" @click="handleStop(row)">
            挂起
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :pages.sync="listQuery.pageNum" :size.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="metadataForm" :rules="rules" label-position="left" label-width="140px" style="width: 400px; margin-left:50px;">
        <el-form-item label="任务组名">
          <el-select v-model="groupName" class="filter-item" placeholder="请选择" @change="changeOption">
            <el-option v-for="(item,index) in metadata" :key="item.groupName" :label="item.groupName" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述">
          {{desc}}
        </el-form-item>
      </el-form>

      <br/>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="140px" style="width: 400px; margin-left:50px;">
        <el-form-item label="任务名">
          <el-input v-model="temp.jobName" />
        </el-form-item>
        <el-form-item label="是否允许并发执行">
          <el-radio v-model="temp.concurrent" label="1">是</el-radio>
          <el-radio v-model="temp.concurrent" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="下一次执行时间">
          <el-popover v-model="cronPopover" style="width: 200px;height: 100px">
            <el-input slot="reference" v-model="temp.cronExpression" placeholder="请输入定时策略" @click="cronPopover=true" />
            <vueCron i18n="cn" @change="changeCron" @close="cronPopover=false" />
          </el-popover>
        </el-form-item>
<!--        <el-form-item label="请求方式" prop="invokeMethod">-->
<!--          <el-select v-model="temp.invokeMethod" class="filter-item" placeholder="请选择">-->
<!--            <el-option v-for="item in invokeMethodTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="请求参数">
          <el-input v-model="temp.invokeParam" />
        </el-form-item>
        <el-form-item label="路径参数">
          <el-input v-model="pathvariable" />
        </el-form-item>
<!--        <el-form-item label="调用目标字符串">-->
<!--          <el-input v-model="temp.invokeTarget" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="cron计划策略">-->
<!--          <el-input v-model="temp.misfirePolicy" />-->
<!--        </el-form-item>-->
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
import { fetchList, fetchPv, createArticle, updateArticle, deleteArticle, getMetadata, start, stop, runOnce } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getId } from '@/utils/auth' // secondary package based on el-pagination
const defaultFormThead = ['Mon', 'Sun']
const invokeMethodTypeOptions = [
  { key: 'GET', display_name: 'GET' },
  { key: 'POST', display_name: 'POST' },
  { key: 'PUT', display_name: 'PUT' },
  { key: 'DELETE', display_name: 'DELETE' }
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
      operations: ['启动任务', '挂起任务', '立即执行一次'],
      metadata: [],
      desc: '',
      id: getId(),
      tableKey: 6,
      listLoading: true,
      not_used: true,

      importanceOptions: [1, 2, 3],
      invokeMethodTypeOptions,
      // pluginTypeOptions,
      sortOptions: [{ label: '升序', key: '+id' }, { label: '降序', key: '-id' }],
      statusOptions: ['using', 'disabled'],
      showReviewer: false,

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建'
      },
      selectTitle: '执行操作',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        createTime: [{ type: 'date', required: true, message: 'createTime is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      key: 1, // table key
      formTheadOptions: ['apple', 'banana', 'orange'],
      checkboxVal: defaultFormThead,

      current: 0, // 当前页数
      pages: 5, // 总页数
      size: 20, // 每页大小
      total: 0, // 记录条数
      records: [], // 记录数组
      policy:['MISFIRE_DEFAULT','MISFIRE_IGNORE_MISFIRES','MISFIRE_FIRE_AND_PROCEED','MISFIRE_DO_NOTHING'],
      temp:
        {
          concurrent: '测试任务', // 是否允许并发执行
          cronExpression: '', // cron执行表达式
          invokeMethod: '', // 请求方式
          invokeParam: '', // 请求参数
          invokeTarget: '', // 调用目标字符串
          jobGroup: '', // 任务组名
          jobName: '', // 任务名
          misfirePolicy: 'MISFIRE_DEFAULT' // cron计划策略
        },
      pathvariable: '',
      groupName: '',
      listQuery: {
        pageNum: 1,
        pageSize: 20,
      },
      cronPopover: false
    }
  },
  created() {
    this.getList()
    this.getMetadata()
  },
  // watch: {
  //     checkboxVal(valArr) {
  //     this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
  //     this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
  //     }
  // },
  methods: {
    changeOption(value) {
      const option = this.metadata[value]
      this.groupName = option.groupName
      this.desc = option.groupDesc
      this.temp.invokeTarget = option.groupTarget
      this.temp.jobGroup = option.groupName
      this.temp.invokeMethod = option.groupMethod
      this.pathvariable = option.groupPaths || '不用填写'
      this.temp.invokeParam = option.groupParams || '不用填写'

      console.log(this.temp)
    },
    getMetadata() {
      getMetadata().then((response) => {
        this.metadata = response.data
        console.log(this.metadata)
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.id, this.listQuery).then(response => {
        this.current = response.data.current
        this.pages = response.data.pages
        this.size = response.data.size
        this.total = response.data.total
        this.records = response.data.records

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      const tempData = Object.assign({}, row) // copy obj
      tempData.status = status
      updateArticle(tempData, tempData.id).then(() => {
        this.getList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      })
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
        concurrent: '', // 是否允许并发执行
        cronExpression: '', // cron执行表达式
        invokeMethod: '', // 请求方式
        invokeParam: '', // 请求参数
        invokeTarget: '', // 调用目标字符串
        jobGroup: '', // 任务组名
        jobName: '', // 任务名
        misfirePolicy: 'MISFIRE_DEFAULT' // cron计划策略
      }
      this.pathvariable = ''
    },
    changeCron(val) {
      this.temp.cronExpression = val
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      console.log(this.metadata)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.temp.misfirePolicy = 1
      if (this.pathvariable !== '不用填写') {
        this.temp.invokeTarget = this.temp.invokeTarget + this.pathvariable
      }
      if (this.temp.invokeParam === '不用填写') {
        this.temp.invokeParam = ''
      }
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList() // 新建任务后重新获取任务列表
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
          updateArticle(tempData, tempData.id).then(() => {
            this.dialogFormVisible = false
            this.getList()
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
      deleteArticle(index).then(() => {
        this.getList() // 删除后重新拉取数据
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        // this.total -= 1  //每删除一条记录，total值减一
        // this.pages = Math.ceil(this.total/this.listQuery.limit) //改变页数
        // console.log("total的值："  + this.total)
      })
      // this.records.splice(index, 1)
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
        const tHeader = ['createTime', 'title', 'type', 'importance', 'status']
        const filterVal = ['createTime', 'title', 'type', 'importance', 'status']
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
      return this.records.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleStart(item) {
      start(item.id)
    },
    handleStop(item) {
      stop(item.id)
    },
    handleRunOnce(item) {
      runOnce(item.id)
    }
  }
}
</script>
