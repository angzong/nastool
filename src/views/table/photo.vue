<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.criteria" placeholder="标准" style="width: 90px" class="filter-item" @change="changeOption">
        <el-option v-for="item in criterias" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <el-row>
      <el-col v-for="(o, index) in picData" :key="o" style="margin-top: 32px;" >

        <span style="padding-left: 16px; margin-top: 32px; font-weight: bold">{{index}}</span>
        <el-divider></el-divider>

        <el-row>
          <el-col v-for="(o1, index1) in o" :key="o1" :span="4" :offset="(index1 % 5) > 0 ? 1 : 0.8" style="margin-top: 16px;position: relative;  display: inline-block;">
            <el-card :body-style="{ padding: '0px'}" style="max-height: 400px;">
              <img :src="'http://localhost:12131/image/' + o1.photoName" class="image" alt="">
              <div style="padding: 14px;background-color: #ffffff;position: absolute;  bottom: 0;left:0;width: 210px">
                <span style="font-size: 14px;margin: 0;padding: 0" >{{ o1.photoName|getFilename }}</span>
                <el-divider style="margin: 0"></el-divider>
                <div class="bottom clearfix">
                  <p style="font-size: 12px;margin: 0px 0px 12px 0px">{{ o1.originalTime||"无" }}</p>
                  <p style="font-size: 12px;margin: 0">{{ o1.location||"无" }}</p>
                  <br/>
                  <el-button type="button" class="primary button" @click="showDetail(o1)">查看详情</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog title="图片详细信息" :visible.sync="detailShow" @close="closeDetail">
      <el-form :model="detailData">
        <img :src="'http://localhost:12131/image/' + detailData.photoName" alt="" class="blur" style="position: absolute;top: 60px;right: 50px; height: 250px; width: auto">

        <el-form-item label="图片名称" :label-width="formLabelWidth">
          {{detailData.photoName|getFilename}}
        </el-form-item>
        <el-form-item label="拍摄设备" :label-width="formLabelWidth">
          {{detailData.device}}
        </el-form-item>
        <el-form-item label="拍摄地点" :label-width="formLabelWidth">
          {{detailData.location}}
        </el-form-item>
        <el-form-item label="拍摄时间" :label-width="formLabelWidth">
          {{detailData.originalTime}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import { getId } from '@/utils/auth'
import { getPicData } from '@/api/article'

export default {
  name: 'PhotoPlugin',
  filters: {
    getFilename(name) {
      console.log(name)
      const arr = name.split('\\')
      return arr[arr.length - 1]
    }
  },
  data() {
    return {
      currentDate: new Date(),
      criterias: ['默认标准', '设备名', '时间', '地点'],
      listQuery: {
        criteria: '默认标准'
      },
      id: getId(),
      picData: [],
      detailData: {
        photoName: '',
        device: '',
        location: '',
        originalTime: ''
      },
      detailShow: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getOriginalData()
  },
  methods: {
    getOriginalData() {
      getPicData(this.listQuery.criteria, this.id).then(response => {
        this.picData = response.data
        console.log(this.picData)
      })
    },
    changeOption() {
      this.getOriginalData()
    },
    showDetail(item) {
      this.detailShow = true
      Object.assign(this.detailData, item)
      console.log(this.detailData)
    },
    closeDetail() {
      this.detailShow = false
      this.detailData = {
        photoName: '',
        device: '',
        location: '',
        originalTime: ''
      }
    }
  }
}
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  max-width: 250px;
  height: 600px;
  overflow: hidden;
  display: block;
  object-fit: cover;
  position: relative;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.blur {
  border-radius: 10px;
}
</style>
