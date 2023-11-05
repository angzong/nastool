<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-input v-model="listQuery.id" placeholder="用户iD" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search" @click="handleSearch">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-edit" @click="handleReset">
        重置
      </el-button>
      <el-checkbox v-permission="['ADMIN']" v-model="showPassword" class="filter-item" style="margin-left:20px;" @change="tableKey=tableKey+1">
        查看密码
      </el-checkbox>
    </div>
    <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag> -->
    <!-- <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" /> -->
    <!-- <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane  v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane ref="tabpane" v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs> -->
    <tab-pane ref="tabpane" @create="showCreatedTimes" />
  </div>
</template>

<script>
import { searchUser } from '@/api/remote-search'
import TabPane from './components/TabPane'

export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: 'ADMIN', key: 'ADMIN' },
        { label: 'ADV_USER', key: 'ADV_USER' },
        { label: 'GUEST', key: 'GUEST' },
        { label: 'SYS_ADMIN', key: 'SYS_ADMIN' },
        { label: 'USER', key: 'USER' }
      ],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showPassword:false,
      listQuery: {
        username:undefined,
        id:undefined,
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      activeName: 'ADMIN',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  watch:{
    showPassword(val){
      console.log(this.$refs.tabpane)
      if(val){
        this.$refs.tabpane._data.showPassword=val
      }else{
        this.$refs.tabpane._data.showPassword=val
      }
    }
    
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    handleReset(){
      this.$refs.tabpane.getList()
    },
    handleCreate(){
      this.$refs.tabpane.getList()
    },
    handleSearch(){
      this.listLoading = true
      searchUser(this.listQuery.id).then(response => {
        this.activeName=response.data.userLevel
        this.$refs.tabpane._data.list = [{
          "email": response.data.email,
          "id": response.data.id,
          "password": response.data.password,
          "plugins": response.data.plugins,
          "userLevel": response.data.userLevel,
          "username": response.data.username
          
        }]
        
        this.$refs.tabpane._data.total = 1
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
