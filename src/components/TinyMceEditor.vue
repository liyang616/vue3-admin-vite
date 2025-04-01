<template>
  <div class="tinymce-editor">
    <textarea :id="editorId"></textarea>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: { type: Number, default: 300 }
})

const emit = defineEmits(['update:modelValue'])

const editorId = ref(`editor-${Math.random().toString(36).slice(2, 11)}`)
let editor = null

const isDark = JSON.parse(localStorage.getItem('responsive-layout')).darkMode

// 动态加载 TinyMCE
const loadTinyMCE = () => {
  return new Promise((resolve, reject) => {
    if (window.tinymce) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = '/tinymce/tinymce.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 初始化编辑器
const initEditor = async () => {
  await window.tinymce.init({
    selector: `#${editorId.value}`,
    license_key: 'gpl',
    language: 'zh_CN',
    width: '100%',
    height: props.height,
    menubar: 'file edit view insert format tools table help',
    statusbar: true,
    branding: false,
    autosave_ask_before_unload: false, // 禁用浏览器警告
    plugins: [
      'preview',
      'importcss',
      'searchreplace',
      'autolink',
      'autosave',
      'save',
      'directionality',
      'code',
      'visualblocks',
      'visualchars',
      'fullscreen',
      'image',
      'link',
      'media',
      'codesample',
      'table',
      'charmap',
      'pagebreak',
      'nonbreaking',
      'anchor',
      'insertdatetime',
      'advlist',
      'lists',
      'wordcount',
      'help',
      // 'quickbars',
      'emoticons',
      'accordion'
    ],
    toolbar:
      'blocks fontfamily fontsize | undo redo | accordion accordionremove | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
    toolbar_mode: 'sliding',
    skin: isDark ? 'oxide-dark' : 'oxide',
    toolbar_sticky: true,
    content_css: '/path/to/content.css',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    images_upload_handler: image_upload,
    setup: (editorInstance) => {
      editorInstance.on('init', () => {
        editorInstance.setContent(props.modelValue)
      })
      editorInstance.on('change', () => {
        emit('update:modelValue', editorInstance.getContent())
      })
    }
  })
}

const image_upload = (blobInfo, progress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = false
    xhr.open('POST', '/api/upload')

    xhr.upload.onprogress = (e) => {
      progress((e.loaded / e.total) * 100)
    }

    xhr.onload = () => {
      if (xhr.status === 403) {
        reject({ message: 'HTTP Error: ' + xhr.status, remove: true })
        return
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject('HTTP Error: ' + xhr.status)
        return
      }

      const json = JSON.parse(xhr.responseText)

      if (!json || typeof json.data.url != 'string') {
        reject('JSON 无效: ' + xhr.responseText)
        return
      }

      resolve(json.data.url)
    }

    xhr.onerror = () => {
      reject('由于 XHR 传输错误，图像上传失败。代码： ' + xhr.status)
    }

    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    xhr.send(formData)
  })

// 生命周期
onMounted(async () => {
  try {
    await loadTinyMCE()
    await initEditor()
  } catch (error) {
    console.error('Failed to initialize editor:', error)
  }
})

onBeforeUnmount(() => {
  editor?.destroy()
})

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && editor.getContent() !== newValue) {
      editor.setContent(newValue)
    }
  }
)
</script>

<style lang="scss">
.tox-tinymce-aux {
  z-index: 9999 !important;
}
.tox {
  .tox-promotion {
    display: none;
  }
  .tox-toolbar__group {
    padding: 0 0 0 12px !important;
  }
}
</style>
