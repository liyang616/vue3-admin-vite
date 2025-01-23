<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: '403'
})

const router = useRouter()
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <img
      :class="$isMobile ? 'error-img-min' : 'error-img'"
      src="@/assets/status/403.png"
      alt=""
    />
    <div class="ml-12">
      <p
        v-motion
        class="font-medium text-4xl mb-4 dark:text-white"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80
          }
        }"
      >
        403
      </p>
      <p
        v-motion
        class="mb-4 text-gray-500"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 120
          }
        }"
      >
        {{ $t('error.page403') }}
      </p>
      <el-button
        v-motion
        type="primary"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 160
          }
        }"
        @click="router.push('/')"
      >
        {{ $t('error.backToHome') }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('./index.scss');
</style>
