import OSS from 'ali-oss'
import { Api } from '@/api/index'

// 阿里云直传
const aliUpload = (obj: any) => {
  let fileName = 'files/' + obj.file.size + obj.file.name
  Api.getAlioss().then((res: any) => {
    if (res.code == 200) {
      let ossClient = new OSS({
        region: res.data.region,
        accessKeyId: res.data.accessKeyId,
        accessKeySecret: res.data.accessKeySecret,
        stsToken: res.data.stsToken,
        bucket: res.data.bucket
      })

      let partSize = 1024 * 1024 // 每个分片大小,1M
      let parallel = 3 // 同时上传的分片数
      ossClient
        .multipartUpload(fileName, obj.file, {
          parallel,
          partSize,
          progress: function (progress, checkpoint) {
            obj.onProgress({ percent: progress * 100 })
            localStorage.setItem(fileName, JSON.stringify(checkpoint)) //记录断点续传信息
          },
          checkpoint: JSON.parse(localStorage.getItem(fileName)) || {}
        })
        .then((result) => {
          // 上传成功
          localStorage.removeItem(fileName) //删除断点续传信息
          let url = 'https://' + res.data.bucket + '.' + res.data.region + '.aliyuncs.com/' + result.name
          obj.onSuccess(url) // 上传组件成功钩子，返回文件url
        })
        .catch((err) => {
          obj.onError('上传失败')
          ElMessage({
            message: '上传失败',
            type: 'error',
            duration: 3 * 1000
          })
        })
    } else {
      obj.onError('上传失败')
      ElMessage({
        message: '上传失败',
        type: 'error',
        duration: 3 * 1000
      })
    }
  })
}

// 后端接口上传
const fileUpload = (obj: any) => {
  Api.httpUpload({ file: obj.file }).then((res: any) => {
    if (res.code == 200) {
      // 上传组件成功钩子，返回文件url
      obj.onSuccess(res.data.url)
    } else {
      obj.onError('上传失败')
      ElMessage({
        message: '上传失败',
        type: 'error',
        duration: 3 * 1000
      })
    }
  })
}

export { aliUpload, fileUpload }
