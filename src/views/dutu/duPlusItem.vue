<script setup lang="ts">
import { ajax, getLocalToken, mlog } from '@/api';
import { ref } from 'vue'
import {NTag ,useMessage } from 'naive-ui';
import { homeStore } from '@/store';
interface itemType{
    carID: string
    isPlus: number
    status: number
    obj?:objType 
}
interface objType{ 
  "color":  string
  "label": string
  "labelColor":string
  "message": string
  "namedLogo": string 
}
const pp =defineProps<{csize?:number}>();
const list= ref<itemType[]>([]);
const st = ref({host:'https://share.ccaiai.com'});
const ms= useMessage();
const initLoad=()=>{
    loadConfig();
    ajax({url:'/plusapi/carpage',method:'POST', data:{page:1,size:pp.csize?? 12}}).then( (d:any )=> {
        //mlog('d',d)
        list.value= d.data.list.map( (v:itemType)=> v );
        mlog('list', list.value )
        //getStauts()
    });
}

const loadConfig= ()=>{
     ajax({url:'/hetao/share/config'}).then( (d:any ) =>st.value.host= d.data.endpoint );
}
const getStautsItem= (v:itemType)=>{
    ajax({url:'/plusapi/endpoint?carid='+v.carID,method:'get' }).then( (d:objType ) =>v.obj=d );
}
const getStauts= ()=>{ 
    list.value.forEach( v=>getStautsItem(v) );
}
const go =(obj:any )=>{
    mlog('go',obj );
    // v-if="!homeStore.myData.isLogin" @click="homeStore.setMyData({act:'showLogin'})"
    if(!homeStore.myData.isLogin  ){
        ms.error('请先登录' );
        homeStore.setMyData({act:'showLogin'});
        return 
    }
    const token= getLocalToken(); 
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('target', '_blank');
    form.setAttribute('action', st.value.host+'/auth/login?carid='+ obj.carID); 
    const input = document.createElement('input');
    input.setAttribute('type', 'text') ;
    input.setAttribute('name', 'usertoken');
    input.setAttribute('value',token);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}
 
initLoad();

</script>
<template> 
   <div class="p-2">
        <div class="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"  >
                <div @click="go(v)" v-for="v in list" class="group relative    rounded-2xl bg-[#e8eaf1] lg:p-5  p-3   dark:bg-neutral-600 cursor-pointer ">
                    
                    <div class="flex justify-between items-center">
                        <div class="space-x-2">
                            <NTag size="small" type="success" round :bordered="false" v-if="v.isPlus" >PLUS</NTag>
                            <NTag size="small" type="info" round :bordered="false" v-else >3.5</NTag>
                            <NTag size="small" type="warning" round :bordered="false" v-if="v.isPlus && v.carID.toLocaleLowerCase().startsWith('t')" >TEAM</NTag>
                        </div>
                        <div  >{{ v.carID }}</div>
                    </div>
                    <div class=" lg:pt-5  pt-3  text-[12px] text-center flex justify-center items-center w-full"> 
                        <img :src="`https://img.closeai.biz/endpoint?url=${encodeURIComponent(st.host+'/endpoint?carid='+v.carID)}`"/>
                    </div>
                </div>
        </div>
        
   </div>
 </template>