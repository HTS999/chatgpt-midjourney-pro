<script setup lang="ts">
import { ajax, mlog,userInfoType ,timeFormat} from '@/api';
import { homeStore } from '@/store';
import { ref } from 'vue';
import { NButton,NCard,NTable } from 'naive-ui';
import { svgIcon } from '@/components/common';

 

const st= ref({isLoad:false})
const userInfo=ref<userInfoType>();
const logsList= ref<any[]>([]);
const emit = defineEmits(['close']);
const loadUserInfo= ()=>{
    st.value.isLoad= true;
    ajax({url:'/hetao/express/account'}).then( (d:any )=> {
        mlog('d',d );
        st.value.isLoad= true
        const account= d.data.account as userInfoType;
        userInfo.value= account;
        queryLogs();
    }).catch(()=>st.value.isLoad= true )
}

const queryLogs= ()=>{
    ajax({url:'/hetao/express/log'}).then( (d:any )=> {
        mlog('loadLogs',d );
        logsList.value= d.data.logs;
    });
}
const goPay= ()=>{
    homeStore.setMyData({act:'showReharge'});
    emit('close');
}
loadUserInfo();
</script>
<template>
<div>
    <template v-if="userInfo">
        <!-- <div class="grid grid-cols-[repeat(auto-fill,200px)] justify-center" > 
            <div class="uinfo" ><svgIcon icon="ri:account-box-line"></svgIcon> UID:{{userInfo?.user_id}}</div>  
            <div class="uinfo" ><svgIcon icon="ri:account-box-line"></svgIcon> 可用积分:{{userInfo.fen-userInfo.use_fen}}</div>  
            <div class="uinfo" ><svgIcon icon="ri:account-box-line"></svgIcon> 已积分:{{userInfo.use_fen}}</div>  
            <div class="uinfo" ><svgIcon icon="ri:account-box-line"></svgIcon> 掉用次数:{{userInfo.cnt}}</div>  
        </div> -->
        <div class="p-2 justify-between items-center flex">
            <div class="uinfo" ><svgIcon icon="ri:account-box-line"></svgIcon> UID:{{userInfo?.user_id}}</div>  
            <NButton type="warning" @click="goPay">充值续费</NButton>
        </div>
        <div class="grid grid-cols-4 gap-4 justify-center text-center">
            <NCard size="small">
                <div class="text-3xl py-2">{{userInfo.fen-userInfo.use_fen}}</div>
                <div>可用积分</div>
            </NCard>
            <NCard size="small">
                <div class="text-3xl py-2">{{userInfo.use_fen}}</div>
                <div>已用积分</div>
            </NCard>
            <NCard size="small">
                <div class="text-3xl py-2">{{userInfo.cnt}}</div>
                <div>使用次数</div>
            </NCard> 
            <NCard size="small">
                <div class="text-3xl py-2">{{(userInfo.cz_amount/100).toFixed(2)}}</div>
                <div>充值金额</div>
            </NCard> 
        </div>
        <div class="pt-4" v-if="logsList.length>0" >
            <n-table striped size="small">
            <thead>
                <tr>
                <th>时间</th>
                <th>模型</th>
                <th>问</th>
                <th>答</th> 
                <th>Tokens</th>
                <th>消耗分</th>
                <th>余额分</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="v in logsList">
                    <td>{{ timeFormat( v.ctime, 'MM-dd hh:mm:ss') }}</td>
                    <td>{{ v.model }}</td>
                    <td>{{ v.prompt_tokens }}</td>
                    <td>{{ v.completion_tokens }}</td>
                    <td>{{ v.tokens }}</td>
                    <td>{{ v.fen }}</td>
                    <td>{{ v.yufen }}</td>
                </tr>
            </tbody>
            </n-table>
        </div>
    </template>
    <div v-else-if="st.isLoad" class="text-center h-[200px] justify-center items-center flex">
        Loaindg...
    </div>
    <div v-else class="text-center h-[200px] justify-center items-center flex">
        <NButton type="primary" @click="homeStore.setMyData({act:'showLogin'})">请先登录</NButton>
    </div>
</div>
</template>
<style scoped>
.uinfo{
@apply flex justify-start items-center
}
</style>