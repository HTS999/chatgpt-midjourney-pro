<script setup lang="ts">
import { watch ,ref } from 'vue'
import {homeStore} from "@/store";
import { mlog ,logout} from '@/api';
import { useBasicLayout } from '@/hooks/useBasicLayout'
import {NDrawer ,NDrawerContent,useMessage } from "naive-ui"

import WeixinLogin from './weixinLogin.vue';
import MyDrawer from './myDrawer.vue';
import DuReharge from './duReharge.vue';
import DuUserInfo from './duUserInfo.vue'
import DuPrice from './duPrice.vue';

const { isMobile } = useBasicLayout();
const st = ref({showLogin:false,showReharge:false,showUserInfo:false,showPrice:false });
const ms= useMessage();
watch(()=>homeStore.myData.act, async (n)=>{
    mlog('autu', n  );
    if(n=='showLogin'){ //需要登录 显示登录二维码
        mlog('🐞 showLogin');
        st.value.showLogin= true;
    }else if( n=='showUserInfo' ){
        if(homeStore.myData.isLogin) st.value.showUserInfo= true;
        else  st.value.showLogin= true;
    }else if( n=='showPrice' ){
        st.value.showPrice= true;
    }else if( n=='showReharge' ){
        if( !homeStore.myData.isLogin) st.value.showLogin= true;
        else st.value.showReharge= true;
    }else if(n=='gologout'){
        await logout();
        ms.success( '退出成功');
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
 mlog('dutuing'  );
</script>
<template>
    <MyDrawer v-model:model-value="st.showLogin"  :class="getCls()"  title="微信登录">
        <WeixinLogin v-if="st.showLogin" @success="st.showLogin=false" />
    </MyDrawer>
    <MyDrawer v-model:model-value="st.showReharge"  :class="getCls()" title="会员充值续费">
       <DuReharge v-if="st.showReharge" @success="st.showReharge=false" />
    </MyDrawer>
    <NDrawer  v-model:show="st.showUserInfo"  :class="[isMobile?'!h-[75vh]':'!w-[80%]']"
     :placement="isMobile?'bottom':'right'" >
      <NDrawerContent   title="个人信息"><DuUserInfo @close="st.showUserInfo=false" v-if="st.showUserInfo" /></NDrawerContent>
        
    </NDrawer>
    <NDrawer v-model:show="st.showPrice"  :class="[isMobile?'!h-[75vh]':'!w-[600px]']"
     :placement="isMobile?'bottom':'right'"  >
       <NDrawerContent   title="模型价格" :closable="!isMobile"><DuPrice v-if="st.showPrice" @success="st.showPrice=false" /></NDrawerContent>
    </NDrawer>

        
</template>