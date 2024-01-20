<script setup lang="ts">
import { watch ,ref } from 'vue'
import {homeStore} from "@/store";
import { mlog } from '@/api';
import { useBasicLayout } from '@/hooks/useBasicLayout'

import WeixinLogin from './weixinLogin.vue';
import MyDrawer from './myDrawer.vue';
import DuReharge from './duReharge.vue';

const { isMobile } = useBasicLayout();
const st = ref({showLogin:false,showReharge:false });
watch(()=>homeStore.myData.act,(n)=>{
    mlog('autu', n  );
    if(n=='showLogin'){ //需要登录 显示登录二维码
        mlog('🐞 showLogin');
        st.value.showLogin= true;
    }else if( n=='showReharge' ){
        st.value.showReharge= true;
    }
},{deep:true})

const getCls=()=>{ 
    if(st.value.showLogin){
        return isMobile.value? '!h-[70vh]':'!w-[400px]'
    }
    // if(st.value.showReharge){
    //     return isMobile.value? '!h-[70vh]':'!w-[600px]'
    // }
    return isMobile.value? '!h-[70vh]':'!w-[640px]'
 }
</script>
<template>
    <MyDrawer v-model:model-value="st.showLogin"  :class="getCls()"  title="微信登录">
        <WeixinLogin v-if="st.showLogin" @success="st.showLogin=false" />
    </MyDrawer>
    <MyDrawer v-model:model-value="st.showReharge"  :class="getCls()" title="会员充值续费">
       <DuReharge v-if="st.showReharge" @success="st.showReharge=false" />
    </MyDrawer>

        
</template>