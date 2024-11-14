<template>
  <el-card>
    <AudioPlayer ref="audioPlayer" />
    <div id="ArticleManger">
      <el-table :data="musicData" border style="width: 100%">
        <el-table-column
          prop="date"
          label="发布日期"
          :key="musicData.date"
          :formatter="dateFormat"
          align="center"
        />
        <el-table-column label="歌名" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="演唱者" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.artist"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="主题颜色" align="center">
          <template #default="scope">
            <el-progress
              :percentage="100"
              :indeterminate="true"
              :duration="2"
              :color="scope.row.theme"
            />
            <el-input v-model="scope.row.theme"></el-input>
          </template>
        </el-table-column>
        
        <el-table-column label="更新音乐" align="center">
          <template #default="scope">
            <el-upload
              class="upload-demo"
              :action="`${baseURL}/api/adminServer/music/musicAdd`"
              :on-success="(res) => music_upload_success(res, scope.row._id, scope.row.url)"
              :before-upload="music_before_upload"
              :limit="1"
              :with-credentials="true"
              :show-file-list="false"
            >
              <el-button size="large" color="#626aef">更新音乐</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="重新上传封面图" align="center" width="300px">
          <template #default="scope">
            <div class="cover">
              <el-image
                style="width: 150px; height: 150px;"
                :src="`${baseURL}${staticURL}${scope.row.cover}`"
                :preview-src-list="[`${baseURL}${staticURL}${scope.row.cover}`]"
                preview-teleported="true"
              />
              <el-upload
                class="upload-demo"
                :action="`${baseURL}/api/adminServer/music/cover`"
                :on-success="(res) => cover_upload_success(res, scope.row._id, scope.row.cover)"
                :before-upload="cover_before_upload"
                :limit="1"
                :with-credentials="true"
                :show-file-list="false"
              >
                <el-button size="large" type="warning">重传封面</el-button>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新歌词" align="center">
          <template #default="scope">
            <el-upload
              class="upload-demo"
              :action="`${baseURL}/api/adminServer/music/lrc`"
              :on-success="(res) => lrc_upload_success(res, scope.row._id, scope.row.lrc)"
              :before-upload="lrc_before_upload"
              :limit="1"
              :with-credentials="true"
              :show-file-list="false"
            >
              <el-button size="large" color="#EC7BB0" circle>
                <svg-icon icon="lrc" style="width: 50px;height: 50px"></svg-icon>
              </el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="播放音乐" align="center">
          <template #default="scope">
            <div class="player">
              <svg-icon icon="player"  @click="playMusic(scope.row.url,scope.row.lrc)"></svg-icon>    
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作1" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              @click="update(scope.row._id, { name: scope.row.name, artist: scope.row.artist, theme: scope.row.theme })"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作2" align="center">
          <template #default="scope">
            <el-button
              type="danger"
              @click="deleteMusic(scope.row._id, scope.row.url, scope.row.cover, scope.row.lrc)"
              circle
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="sizes, prev, pager, next, jumper, ->, slot, total"
      :total="total"
      v-model:page-size="query.perPage"
      v-model:current-page="query.page"
      @current-change="getMusic"
      @size-change="getMusic"
      :page-sizes="[2, 4, 5, 10, 20, 30]"
    />
  </el-card>
</template>

<script>
import moment from "moment";
import { emitter } from '../../utils/eventBus';
export default {
  name: "ArticleManger",
  data() {
    return {
      musicData: [],
      total: 0,
      display: true,
      query: {
        page: 1,
        perPage: 4,
      },
    };
  },
  methods: {
    dateFormat(row, column) {
      let date = row[column.property];
      return date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : "";
    },
    async getMusic() {
      let { data } = await this.$axios({
        method: "get",
        url: "/api/get/music",
        params: this.query,
      });
      if (data.code) {
        return this.$message.error(data.msg);
      }
      this.musicData = data.data;
      this.total = data.total;
      this.display = this.total !== 0;
    },

    playMusic(url, lrc) {
  // 先发出暂停音乐的事件
  emitter.emit('pauseMusic'); // 通知外部暂停音乐
  // 然后触发播放事件
  emitter.emit('playMusic', this.baseURL + url, this.baseURL + lrc);
},

    
    lrc_before_upload(file) {
      const isLrc = /\.lrc$/.test(file.name);
      if (!isLrc) {
        this.$message.error("只能上传.lrc文件");
      }
      return isLrc;
    },
    lrc_upload_success(res, id, musicUrl) {
      if (res.code) {
        return this.$message.error(res.msg);
      }
      this.update(id, { lrc: res.url }, musicUrl);
    },
    async update(id, doc, musicUrl) {
      let { data } = await this.$axios({
        method: "POST",
        url: "/api/adminServer/music/update",
        data: { id, doc, musicUrl },
      });
      if (data.code) {
        return this.$message.error(data.msg);
      }
      this.$message.success("更新成功");
      await this.getMusic();
    },
    music_before_upload(file) {
      const isMusic = /\.(mp3|m4a)$/.test(file.name);
      if (!isMusic) {
        this.$message.error("请上传音乐文件");
      }
      return isMusic;
    },
    music_upload_success(res, id, musicUrl) {
      if (res.code) {
        return this.$message.error(res.msg);
      }
      this.update(id, { url: res.url }, musicUrl);
    },
    cover_before_upload(file) {
      const isJPG = /^image\/(jpeg|png)$/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    cover_upload_success(res, id, musicUrl) {
      if (res.code) {
        return this.$message.error(res.msg);
      }
      this.update(id, { cover: res.url }, musicUrl);
    },
    async deleteMusic(id, mcUrl, mcCover, mcLrc) {
      let { data } = await this.$axios({
        method: "DELETE",
        url: "/api/adminServer/music/delete",
        data: { id, mcUrl, mcCover, mcLrc },
      });
      if (data.code) {
        return this.$message.error(data.msg);
      }
      this.$message.success("删除完成");
      await this.getMusic();
    },
  },
  created() {
    this.getMusic();
  },
};
</script>
<style lang="scss" scoped>
#ArticleManger {
  .cover {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search {
    margin-bottom: 10px;
  }

  .buttonSubmit {
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
  }
  .player{
    cursor: pointer;
  }
}
</style>














