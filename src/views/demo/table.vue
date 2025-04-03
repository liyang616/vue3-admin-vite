<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="姓名" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择" clearable>
          <el-option label="已启用" :value="1" />
          <el-option label="已停用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" v-if="!$isMobile">
        <el-date-picker
          v-model="dateArea"
          type="datetimerange"
          value-format="x"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <template v-else>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchForm.startDate"
            type="datetime"
            value-format="x"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="searchForm.endDate"
            type="datetime"
            value-format="x"
            placeholder="结束时间"
          />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getList">搜索</el-button>
        <el-button type="primary" v-auth="'btn_add'" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="pub-table">
      <el-table :data="list" :max-height="$tableHeight" border :row-key="(row) => row.id">
        <el-table-column label="ID" prop="id" min-width="80" />
        <el-table-column label="姓名" prop="name" min-width="90" />
        <el-table-column label="图片" width="104" align="center">
          <template #default="scope">
            <div class="img-box">
              <img v-viewer :src="getAssetURL(scope.row.image)" alt="" />
            </div>
          </template>
        </el-table-column>
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
        <el-table-column label="手机" prop="phone" min-width="120" />
        <el-table-column label="邮箱" prop="email" min-width="120" />
        <el-table-column label="IP" prop="ip" min-width="130" />
        <el-table-column label="备注" min-width="160" align="center">
          <template #default="scope">
            <el-tooltip effect="dark" :content="scope.row.remark" placement="top">
              {{ scope.row.remark }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160" align="center">
          <template #default="scope">
            {{ moment(parseInt(scope.row.createTime)).format('YYYY-MM-DD HH:mm:ss') }}
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
        <el-form-item label="姓名" prop="name" :class="$isMobile ? '' : 'w50'">
          <el-input v-model="dialogForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="性别" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="dialogForm.sex" placeholder="请选择" clearable>
            <el-option label="男" :value="0" />
            <el-option label="女" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" :class="$isMobile ? '' : 'w50'">
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
        <el-form-item label="备注" :class="$isMobile ? '' : 'w100'">
          <!-- v-if使富文本根据弹窗初始和销毁, 解决数据交换的问题 -->
          <Editor v-if="showForm" v-model="dialogForm.remark" :height="380"></Editor>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showForm = false">取消</el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Editor from '@/components/TinymceEditor.vue'
import { hasAuth } from '@/router/utils'
import { Search } from '@element-plus/icons-vue'
import { ref, getCurrentInstance, reactive } from 'vue'
import moment from 'moment'
import type { UploadProps } from 'element-plus'
import { fileUpload } from '@/utils/upload'
import { api as viewerApi } from 'v-viewer'
const { proxy }: any = getCurrentInstance()
defineOptions({
  name: 'demoTable'
})

// vite动态获取本地图片
const getAssetURL = (num) => {
  return new URL(`/src/assets/picture/img${num}.jpg`, import.meta.url).href
}

const dateArea = ref<any>([])
const searchForm = ref<any>({
  name: '',
  status: '',
  startDate: '',
  endDate: ''
})
const list = ref([])
const showForm = ref<boolean>(false)
const formTitle = ref<any>('')
const dialogForm = ref<any>({})
const formRules = reactive({
  name: [{ required: true, message: '姓名为必填项', trigger: 'blur' }],
  nickname: [{ required: true, message: '昵称为必填项', trigger: 'blur' }],
  password: [{ required: true, message: '密码为必填项', trigger: 'blur' }]
})
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
const getList = () => {
  let json = { ...searchForm.value, ...page.value }
  if (!proxy.$isMobile) {
    json.startDate = dateArea.value[0]
    json.endDate = dateArea.value[1]
  }
  proxy.$api.getTable(json).then((res: any) => {
    if (res.code !== 200) return
    list.value = res.data.list
    page.value.total = res.data.total
  })
}
getList()

// 状态开关
const statusChange = (val: any, row: any) => {
  ElMessageBox.confirm(`确认${val ? '启用' : '停用'} [${row.name}] ? `, '提示', {
    type: 'warning',
    draggable: true,
    closeOnClickModal: false
  })
    .then(() => {
      ElMessage({
        message: `${val ? '[' + row.name + '] ' + '已启用' : '[' + row.name + '] ' + '已停用'} `,
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
  fileUpload(options)
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
}

// 编辑
const editRow = (row: any) => {
  formTitle.value = '编辑'
  showForm.value = true
  let rowData = JSON.parse(JSON.stringify(row))
  dialogForm.value = rowData
  fileList.value = [{ url: getAssetURL(rowData.image) }]
}

// 删除
const deleteRow = (row: any) => {
  ElMessageBox.confirm(`是否确认删除: ${row.name} ? `, '提示', {
    type: 'warning',
    draggable: true,
    closeOnClickModal: false
  })
    .then(() => {})
    .catch(() => {
      // catch error
    })
}

// 确定
const submit = () => {
  showForm.value = false
  console.log(dialogForm.value)
}
</script>

<style lang="scss" scoped></style>
