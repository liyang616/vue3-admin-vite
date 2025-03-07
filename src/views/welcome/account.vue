<template>
  <div class="account-box">
    <el-form :model="form">
      <el-form-item label="头像">
        <el-upload
          action="#"
          list-type="picture-card"
          :http-request="httpUpload"
          :file-list="fileList"
          :before-upload="(file) => handleBefore(file)"
          :on-remove="(file, fileList) => handleRemove"
          :on-success="(res, file, fileList) => handleSuccess(fileList)"
          :on-preview="(file) => handlePreview(file)"
          :on-exceed="handleExceed"
          :limit="1"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP"
        >
          <IconifyIconOffline icon="ep:plus" aria-hidden="false" />
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" placeholder="昵称" clearable />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="password" placeholder="请输入" show-password clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.sex" placeholder="请选择" clearable>
          <el-option label="男" :value="0" />
          <el-option label="女" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          type="textarea"
          v-model="form.description"
          placeholder="请输入"
          :autosize="{ minRows: 3, maxRows: 3 }"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="submit" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { aliUpload } from '@/utils/upload'
import { ref, getCurrentInstance } from 'vue'
import { api as viewerApi } from 'v-viewer'
import type { UploadProps } from 'element-plus'
const { proxy }: any = getCurrentInstance()
defineOptions({
  name: 'account'
})

const form = ref<any>({})
const password = ref<string>('')
const fileList = ref([])

proxy.$api.getUserInfo().then((res: any) => {
  if (res.code !== 200) return
  form.value = res.data
  if (form.value.avatar) fileList.value = [{ url: form.value.avatar }]
})

// 上传
const handleBefore: UploadProps['beforeUpload'] = (file) => {
  return new Promise((resolve, reject) => {
    let fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
    let typeAll = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    if (typeAll.includes(fileType)) {
      resolve(true)
    } else {
      ElMessage({
        message: '只能上传图片',
        type: 'success',
        duration: 3 * 1000
      })
      reject(false)
    }
  })
}
const httpUpload = async (options: any) => {
  aliUpload(options)
}
const handleSuccess = (fileList) => {
  let url = []
  for (let i = 0; i < fileList.length; i++) {
    url.push(fileList[i].response)
  }
  form.value.avatar = url.toString()
}
const handleRemove = () => {
  form.value.avatar = ''
}
const handlePreview = (file: any) => {
  viewerApi({
    options: {
      zIndex: 9999
    },
    images: [file.url || file.response]
  })
}
const handleExceed = (files, fileList) => {
  ElMessage({
    message: '只能上传一个文件',
    type: 'warning',
    duration: 3 * 1000
  })
}

// 确定
const submit = () => {
  if (fileList.value[0].url) form.value.avatar = fileList.value[0].url
  if (password.value) form.value.password = password.value
  console.log(form.value)
}
</script>
