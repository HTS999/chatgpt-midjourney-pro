<script setup lang="ts">
import { homeStore } from '@/store';
import { NButton } from 'naive-ui'
</script>
<template>
  <NButton type="warning" block v-if="!homeStore.myData.isLogin" @click="homeStore.setMyData({act:'showLogin'})" >
    登录
  </NButton>
  <NButton type="warning" block v-else @click="homeStore.setMyData({act:'showReharge'})" >
    充值续费
  </NButton>
</template>