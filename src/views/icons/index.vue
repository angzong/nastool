<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon-class="el-icon-search" @click="dialogFormVisible = true">
        上传
      </el-button>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column v-if="!not_used" label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件名" min-width="150px" prop="pluginName"></el-table-column>
      <el-table-column label="插件描述" min-width="150px" prop="pluginDesc"></el-table-column>
      <el-table-column label="版本号" min-width="150px" prop="pluginVersion"></el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button  size="mini" type="normal" @click="handleDownload(row,$index)">
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- Form -->
    <el-dialog title="上传插件" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="插件名称" :label-width="formLabelWidth">
          <el-input v-model="form.pluginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="插件描述" :label-width="formLabelWidth">
          <el-input v-model="form.pluginDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="插件版本" :label-width="formLabelWidth">
          <el-input v-model="form.pluginVersion" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传附件" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            drag
            action=""
            multiple
            :on-change="handleUpload"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { fetchAllPlugins, download, uploadFile } from '@/api/article'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Icons',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 5
      },
      list: null,
      total: 0,
      listLoading: false,
      tableKey: 0,
      dialogFormVisible: false,
      form: {
        pluginName: '',
        pluginDesc: '',
        pluginVersion: ''
      },
      file: null,
      url: '',
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAllPlugins(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleDownload(row) {
      download(row)
    },
    handleUpdate() {
      const format = new window.FormData()
      format.append('file', this.file)
      format.append('pluginName', this.form.pluginName)
      format.append('pluginDesc', this.form.pluginDesc)
      format.append('pluginVersion', this.form.pluginVersion)

      uploadFile(format).then(() => {
        this.$message({
          message: "Upload Success",
          type: 'success'
        })
        this.form.pluginName = ''
        this.form.pluginDesc = ''
        this.form.pluginVersion = ''
        this.file = null
        this.dialogFormVisible = false
        this.getList()

      })
    },
    handleUpload(file) {
      this.file = file.raw
      console.log(file)
    }
  }
}
</script>
