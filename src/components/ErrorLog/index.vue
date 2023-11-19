<template>
  <div v-if="total>0">
    <el-badge :is-dot="true" style="line-height: 25px;margin-top: -5px;" @click.native="dialogTableVisible=true">
      <el-button style="padding: 8px 10px;" size="small" type="danger">
        <svg-icon icon-class="bug" />
      </el-button>
    </el-badge>

    <el-dialog :visible.sync="dialogTableVisible" width="80%" append-to-body @open="getLog" @close="clear">
      <div slot="title">
        <span style="padding-right: 10px;">Error Log</span>
      </div>
      <el-table :data="errorLog" border>
        <el-table-column label="Message">
          <template slot-scope="{row}">
            <div>
              <span class="message-title">id:</span>
              <el-tag type="danger">
                {{ row.id }}
              </el-tag>
            </div>
            <br>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template slot-scope="scope">
            {{ scope.row.logDesc }}
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"  @pagination="getLog" />

    </el-dialog>

  </div>
</template>

<script>
import { getLogList } from '@/api/log'
import Pagination from '@/components/Pagination'

export default {
  name: 'ErrorLog',
  components: { Pagination },
  data() {
    return {
      dialogTableVisible: false,
      errorLog: [],
      listQuery: {
        pageSize: 5,
        pageNum: 1
      },
      total: 0
    }
  },
  created() {
    this.getLog()
  },

  methods: {
    getLog() {
      getLogList(this.listQuery).then(response => {
        this.errorLog = response.data.records
        this.total = response.data.total
        console.log(this.errorLog)
      })
    },
    clear() {
      this.errorLog = []
    },
    handleSizeChange(val) {
      console.log(val)
      this.listQuery.pageSize = val
      this.getLog()
    },
    handleCurrentChange(val) {
      console.log(val)

      this.listQuery.pageNum = val
      this.getLog()
    }
  }
}
</script>

<style scoped>
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
</style>
