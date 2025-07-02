<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchForm.phone" placeholder="手机号" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择" clearable>
          <el-option label="已启用" :value="1" />
          <el-option label="已停用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="searchLoading" @click="getList">搜索</el-button>
        <el-button type="primary" v-auth="'btn_add'" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="pub-table">
      <el-table :data="list" :max-height="$tableHeight" border :row-key="(row) => row.id">
        <el-table-column label="用户ID" prop="id" min-width="80" />
        <el-table-column label="头像" min-width="90" align="center">
          <template #default="scope">
            <img v-viewer :src="scope.row.avatar" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="username" min-width="130" />
        <el-table-column label="昵称" prop="nickname" min-width="100" />
        <el-table-column label="性别" min-width="90" align="center">
          <template #default="scope">
            <span v-if="scope.row.sex == 0">男</span>
            <span v-if="scope.row.sex == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="90" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              active-text="已启用"
              inactive-text="已停用"
              :active-value="1"
              :inactive-value="0"
              @change="statusChange($event, scope.row)"
              v-if="hasAuth('btn_edit')"
            />
            <div v-else>
              <span v-if="scope.row.status == 1">已启用</span>
              <span v-if="scope.row.status == 0">已停用</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" min-width="130" />
        <el-table-column label="备注" prop="remark" min-width="160" />
        <el-table-column label="创建时间" min-width="160" align="center">
          <template #default="scope">
            {{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :fixed="$isMobile ? false : 'right'" min-width="130">
          <template #default="scope">
            <el-button link type="primary" v-auth="'btn_edit'" @click.prevent="editRow(scope.row)">
              编辑
            </el-button>
            <el-button link type="danger" v-auth="'btn_delete'" @click.prevent="deleteRow(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page.currentPage"
        v-model:page-size="page.pageSize"
        :page-sizes="[10, 25, 50, 100]"
        size="small"
        :disabled="false"
        :background="true"
        :layout="$isMobile ? layoutApp : layoutPc"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="showForm"
      :title="formTitle"
      draggable
      width="720"
      :close-on-click-modal="false"
      :fullscreen="$isMobile ? true : false"
      @close="closeForm"
    >
      <el-form
        ref="formRef"
        :model="dialogForm"
        :rules="formRules"
        :inline="$isMobile ? false : true"
        label-width="auto"
        class="pub-form"
      >
        <el-form-item label="头像" :class="$isMobile ? '' : 'w100'">
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
        <el-form-item label="用户名" prop="username" :class="$isMobile ? '' : 'w50'">
          <el-input v-model="dialogForm.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" :class="$isMobile ? '' : 'w50'">
          <el-input v-model="dialogForm.nickname" placeholder="请输入" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :class="$isMobile ? '' : 'w50'"
          v-if="formTitle != '编辑'"
        >
          <el-input v-model="dialogForm.password" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="dialogForm.roles" multiple placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="dialogForm.sex" placeholder="请选择">
            <el-option label="男" :value="0" />
            <el-option label="女" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :class="$isMobile ? '' : 'w50'">
          <el-switch
            v-model="dialogForm.status"
            inline-prompt
            active-text="已启用"
            inactive-text="已停用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="手机号" :class="$isMobile ? '' : 'w50'">
          <el-input v-model="dialogForm.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="邮箱" :class="$isMobile ? '' : 'w50'">
          <el-input v-model="dialogForm.email" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注" :class="$isMobile ? '' : 'w100'">
          <el-input v-model="dialogForm.remark" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showForm = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { hasAuth } from '@/router/utils'
import { Search } from '@element-plus/icons-vue'
import { ref, getCurrentInstance, reactive } from 'vue'
import moment from 'moment'
import type { UploadProps } from 'element-plus'
import { aliUpload } from '@/utils/upload'
import { api as viewerApi } from 'v-viewer'
const { proxy }: any = getCurrentInstance()
defineOptions({
  name: 'systemUser'
})

const searchForm = ref<any>({
  username: '',
  phone: '',
  status: ''
})
const list = ref([])
const showForm = ref<boolean>(false)
const formTitle = ref<any>('')
const dialogForm = ref<any>({})
const formRules = reactive({
  username: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
  nickname: [{ required: true, message: '昵称为必填项', trigger: 'blur' }],
  password: [{ required: true, message: '密码为必填项', trigger: 'blur' }]
})
const roleList = ref([])
const fileList = ref([])

// 分页
const layoutPc = 'total, sizes, prev, pager, next, jumper'
const layoutApp = 'total, sizes, jumper'
const page = ref({
  currentPage: 1,
  pageSize: 10,
  total: 10
})
const handleSizeChange = (val: number) => {
  page.value.pageSize = val
  getList()
}
const handleCurrentChange = (val: number) => {
  page.value.currentPage = val
  getList()
}

// 获取数据
const searchLoading = ref<boolean>(false)
const getList = () => {
  searchLoading.value = true
  let json = { ...searchForm.value, ...page.value }
  proxy.$api.getUser(json).then((res: any) => {
    searchLoading.value = false
    if (res.code !== 200) return
    list.value = res.data.list
    page.value.total = res.data.total
  })
}
getList()

// 获取菜单
const getAllRole = () => {
  proxy.$api.getAllRole().then((res: any) => {
    if (res.code !== 200) return
    // 初始化树形数据
    roleList.value = res.data
  })
}

// 状态开关
const statusChange = (val: any, row: any) => {
  ElMessageBox.confirm(`确认${val ? '启用' : '停用'} [${row.username}] ? `, '提示', {
    type: 'warning',
    draggable: true,
    closeOnClickModal: false
  })
    .then(() => {
      // submitLoading.value = true
      // proxy.$api.userEdit(row).then((res: any) => {
      //   submitLoading.value = false
      //   if (res.code !== 200) {
      //     val ? (row.status = 0) : (row.status = 1)
      //     return
      //   }
      //   ElMessage({
      //     message: `${val ? '[' + row.userName + '] ' + '已停用' : '[' + row.userName + '] ' + '已启用'} `,
      //     type: 'success',
      //     duration: 3 * 1000
      //   })
      // })
      ElMessage({
        message: `${val ? '[' + row.username + '] ' + '已启用' : '[' + row.username + '] ' + '已停用'} `,
        type: 'success',
        duration: 3 * 1000
      })
    })
    .catch(() => {
      val ? (row.status = 0) : (row.status = 1)
    })
}

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
  dialogForm.value.avatar = url.toString()
}
const handleRemove = () => {
  dialogForm.value.avatar = ''
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

// 关闭弹窗
const closeForm = () => {
  fileList.value = []
  proxy.$refs.formRef.resetFields()
}

// 新增
const add = () => {
  formTitle.value = '新增'
  dialogForm.value = {
    avatar: '',
    username: '',
    nickname: '',
    password: '',
    phone: '',
    email: '',
    sex: '',
    status: 1,
    roles: [],
    remark: ''
  }
  showForm.value = true
  getAllRole()
}

// 编辑
const editRow = (row: any) => {
  formTitle.value = '编辑'
  showForm.value = true
  getAllRole()
  let rowData = JSON.parse(JSON.stringify(row))
  dialogForm.value = rowData
  if (rowData.avatar) fileList.value = [{ url: rowData.avatar }]
}

// 删除
const deleteRow = (row: any) => {
  ElMessageBox.confirm(`是否确认删除: ${row.username} ? `, '提示', {
    type: 'warning',
    draggable: true,
    closeOnClickModal: false
  })
    .then(() => {
      // proxy.$api.userDel(row.id).then((res: any) => {
      //   if (res.code !== 200) return
      //   getList()
      //   ElMessage({
      //     message: '删除成功',
      //     type: 'success'
      //   })
      // })
    })
    .catch(() => {
      // catch error
    })
}

// 确定
const formRef = ref(null)
const submitLoading = ref<boolean>(false)
const submit = () => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      // submitLoading.value = true
      if (dialogForm.value.id) {
        // proxy.$api.userEdit(dialogForm.value).then((res: any) => {
        //   submitLoading.value = false
        //   showForm.value = false
        //   if (res.code !== 200) return
        //   getList()
        //   ElMessage({
        //     message: '编辑成功',
        //     type: 'success'
        //   })
        // })
      } else {
        // proxy.$api.userAdd(dialogForm.value).then((res: any) => {
        //   submitLoading.value = false
        //   showForm.value = false
        //   if (res.code !== 200) return
        //   getList()
        //   ElMessage({
        //     message: '新增成功',
        //     type: 'success'
        //   })
        // })
      }

      showForm.value = false
      console.log(dialogForm.value)
    }
  })
}
</script>

<style lang="scss" scoped></style>
