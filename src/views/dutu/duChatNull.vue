<script setup lang="ts">
import { ajax, mlog } from '@/api';
import { homeStore } from '@/store';
import { ref } from 'vue';
import { NButton } from 'naive-ui'
const st =ref({isLoader:false});
const config= ref({msg:''});
const loadStart= ()=>{
    ajax({url:'/hetao/token/chatstart'}).then( (d:any )=> {
        st.value.isLoader=true;
        mlog('dd',d );
        config.value= d.data.conf ;
    });
}
loadStart();
</script>

<template>
<div>
    <div class="text-neutral-300 mt-6 " v-if="st.isLoader">
        <div v-html="config.msg" class="text-left"></div>
        <div class="p-4 justify-center items-center flex">
            <NButton type="info"  v-if="!homeStore.myData.isLogin" @click="homeStore.setMyData({act:'showLogin'})" >请先登录</NButton>
            <NButton type="info"  v-else @click="homeStore.setMyData({act:'showReharge'})" >续费充值</NButton>
            
        </div>
    </div>
</div>

</template>