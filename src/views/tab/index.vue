<template>
  <div class="tab-container">
    <div class="filter-container">
<!--      &lt;!&ndash; 输入查找条件，我多放了按用户名查找和正反排序查找，不想要可以只留用户ID的input &ndash;&gt;-->
<!--      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />-->
<!--      <el-input v-model="listQuery.id" placeholder="用户iD" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />-->
<!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
<!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
<!--      </el-select>-->

<!--      &lt;!&ndash; 输入查找条件后，点击查找，调用handleSearch &ndash;&gt;-->
<!--      <el-button v-waves class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search" @click="handleSearch">-->
<!--        查找-->
<!--      </el-button>-->
<!--      &lt;!&ndash; 你好像没留接口，不用就删了吧 &ndash;&gt;-->
<!--      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
<!--        新增-->
<!--      </el-button>-->
      <!-- 查找之后，重置列表 -->
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-edit" @click="handleReset">
        重置
      </el-button>
      <!-- 这里v-permission="['ADMIN']",可以方便的控制谁可以看到这个check-box，你可以进行更改 -->
<!--      <el-checkbox v-permission="['ADMIN']" v-model="showPassword" class="filter-item" style="margin-left:20px;" @change="tableKey=tableKey+1">-->
<!--        查看密码-->
<!--      </el-checkbox>-->
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
    <!-- 真正的表单展示在这里，进入components查看，这里不太优美，先这样吧 -->
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
      //权限选择
      tabMapOptions: [
        { label: 'ADMIN', key: 'ADMIN' },
        { label: 'ADV_USER', key: 'ADV_USER' },
        { label: 'GUEST', key: 'GUEST' },
        { label: 'SYS_ADMIN', key: 'SYS_ADMIN' },
        { label: 'USER', key: 'USER' }
      ],
      //排序选择
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showPassword:false,
      //list大小设置
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
      activeName: 'ADMIN', //这里是多个tab的接口，用不到，不用管
      createdTimes: 0
    }
  },
  watch: {
    //tab，不用管
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  watch:{
    //展示用户密码，只有admin用户有此权限
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
    //重置用户列表展示
    handleReset(){
      this.$refs.tabpane.getList()
    },
    //新增，可以删
    handleCreate(){
      this.$refs.tabpane.getList()
    },
    //查找，调用api中的函数
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
