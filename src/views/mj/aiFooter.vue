<script setup lang="ts">
import aiGpts from "./aiGpts.vue"
import aiGallery from "./aiGallery.vue" 
import dutu from '../dutu/dutu.vue'
import { homeStore } from "@/store"
import { getTokenFormServer } from "@/api"

//解决微信登录问题
const goInit=()=>{
    //if(/MicroMessenger/i.test(navigator.userAgent)  ){
    if( !homeStore.myData.isLogin  ) getTokenFormServer();
}
goInit();
</script>
<template>
<aiGpts/>
<aiGallery/>
<dutu/>
</template>