
<template>
  <el-card>


  <el-upload
      class="upload-demo"
      drag
      :http-request="uploadFiles"
      multiple
      list-type="text"
  >
    <div style="text-align: center">人工智能与大数据学院学生课表批量导入</div>
<div style="width: 100px;height: 100px;margin: 0 auto">
  <UploadFilled />
</div>

    <div class="el-upload__text">
      请点击或拖拽上传 <em>.xlsx.xls的excel文件</em>
    </div>

  </el-upload>
  </el-card>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const uploadFiles = async (options: any) => {
  const formData = new FormData();

  // Check if multiple files
  if (Array.isArray(options.file)) {
    options.file.forEach((file: File) => {
      formData.append('files', file);
    });
  } else {
    formData.append('files', options.file);
  }

  try {
    const response = await axios.post('/api/Curriculum/uploadMany', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.code === 0) {
      ElMessage({
        message: '导入成功',
        grouping: true,
        type: 'success',
      })
    } else {
      ElMessage.error('Files upload failed');
    }
  } catch (error) {
    ElMessage.error('Files upload failed');
  }
};
</script>

<style>
.upload-demo {
  width: 100%;
  height: 600px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
}
.el-upload__text em {
  color: #409eff;

}
.el-upload__text{
  line-height: 350px;
}
.el-upload__tip {
  color: #909399;
  font-size: 12px;
  text-align: center;
  margin-top: 7px;
}
.el-upload-list{
  height: 360px;
  overflow-y: auto;
 width: 500px;
}
.el-upload-dragger {

  width: 500px;
  height: 350px;
}
</style>
