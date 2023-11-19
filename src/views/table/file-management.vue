<template>
  <div class="app-container">
    <span style="padding-left: 16px; margin-top: 32px; font-weight: bold" />
    <el-divider />
    <el-row style="margin-top: 32px;margin-left: -20px">
      <el-col v-for="(o) in animeData" :key="o" span="7" offset="1">
        <el-card class="card" :body-style="{ padding: '0px'}" style="height: 280px;margin-top: 16px">
          <img :src="o.pic" class="image" alt="">
          <div style="margin-top: 16px;margin-left: 8px">
            <p style="font-size: 16px;margin-left:8px;margin-top:2px">{{ o.name }}</p>
            <el-button type="button" class="primary button" style="margin-right: 8px;margin-top: 4px" @click="showDetail(o)">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="电影详细信息" :visible.sync="detailShow" width="1120px" height="600px" @close="closeDetail">
      <img :src="detailData.pic" alt="" class="blur" style="top: 40px;margin-left: 20px; height: auto; width: 400px">
      <el-form :model="detailData" style="position: absolute;top: 100px;left: 200px;right: 40px">
        <el-form-item label="番剧名称" :label-width="formLabelWidth" style="margin-top: -30px;margin-left: 220px">
          {{ detailData.name }}
        </el-form-item>
        <el-form-item label="上映时间" :label-width="formLabelWidth" style="margin-top: 0px;margin-left: 220px">
          {{ detailData.aniInitialDate }}
        </el-form-item>

        <el-form-item label="番剧简介" :label-width="formLabelWidth" style="margin-top: 0px;margin-left: 220px">
          {{ detailData.description }}
        </el-form-item>

        <el-form-item label="下载链接" :label-width="formLabelWidth" style="margin-top: 0px;margin-left: 220px;font-size: 14px;height: 100px;line-height: 1px">
          <span v-if="detailData.downloadUri && detailData.downloadUri.length <= 15">{{ detailData.downloadUri }}</span>
          <el-tooltip v-if="detailData.downloadUri && detailData.downloadUri.length > 15" id="copy_item" class="item" effect="dark" :content="detailData.downloadUri" placement="top">
            <span @click="copy(detailData)">{{ detailData.downloadUri | ellipsis }}</span>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAnimeData } from '@/api/article'
import Clipboard from 'clipboard'

export default {
  name: 'FileManagement',
  filters: {
    ellipsis: function(value) {
      if (!value) {
        return ''
      }
      if (value.length > 120) {
        return value.slice(0, 120) + '......'
      }
      return value
    }
  },
  data() {
    return {
      id: 0,
      animeData: [],
      detailData: {
        picSrc: '',
        picName: '',
        fileDirector: '',
        fileTime: '',
        fileIntro: ''
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
      getAnimeData().then(response => {
        this.animeData = response.data.records
        this.animeData.forEach(item => {
          if (item.pic === null) {
            item.pic = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201607%2F24%2F20160724163323_jmS4T.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1702732118&t=6f21e871cc9fbb667f91cb98a013bd8d'
          } else {
            item.pic = 'http:\\\\localhost:12133\\image\\' + item.pic
          }
        })
        console.log(this.animeData)
      })
    },
    changeOption() {

    },
    showDetail(item) {
      this.detailShow = true
      Object.assign(this.detailData, item)
      console.log(this.detailData)
    },
    closeDetail() {

    },
    copy(detailData) {
      console.log(detailData)
      const val = `downloadUrl:${detailData.downloadUri};title:${detailData.name}`
      const clipboardObj = navigator.clipboard;

      clipboardObj.writeText(val)
      // document.execCommand('copy', val, null)
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
  margin-right: 6px;
  margin-top: -11px;
  float: right;
}

.card {
  padding: 0;
  height: 260px;
}
.image {
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  display: block;
  object-fit: cover;
  position: relative;
  padding: 0;
  margin: 0;
  background-repeat: repeat-x center;
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
