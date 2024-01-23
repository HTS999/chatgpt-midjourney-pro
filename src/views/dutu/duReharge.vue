<script setup lang="ts">
import { ajax, mlog } from '@/api';
import { ref,watch } from 'vue'
import QrcodeVue from 'qrcode.vue';
import { NButton,useMessage,NTag ,NIcon,NEmpty} from 'naive-ui';
import { useBasicLayout } from '@/hooks/useBasicLayout' 
import { homeStore } from '@/store';
import { svgIcon } from '@/components/common';

const { isMobile } = useBasicLayout()
const isWechat = ref( /MicroMessenger/i.test(navigator.userAgent) ); //是否在微信内
const payConfig= ref<{qr:any[], msgFoot:string, msgHead:string,index:number}>({ qr:[], msgFoot:'', msgHead:'',index:-1});
const st= ref({isLoad:true,qrurl:''});
const emit = defineEmits(['success']);
const ms = useMessage();
const loadQrPay= ()=>{
    st.value.isLoad = true;
    ajax({url:'/hetao/pay/config'}).then( (d:any )=> {
        st.value.isLoad = false;
        mlog('pay', d )
        if(d.error==0) payConfig.value= d.data.payConfig;
    }).catch( ()=> st.value.isLoad = false );
}

watch( ()=>payConfig.value.index, (n:any)=>{
    st.value.qrurl= payConfig.value.qr[n].url
})
const goUrl= (url:string)=>  location.href=url
const goSelect = (k:number)=>{
    payConfig.value.index=k;
    if(isWechat.value){
       const qrurl= payConfig.value.qr[k].url
       goUrl( qrurl );
    }
}
const gzCheck= ()=>{
    ajax({url:'/hetao/pay/check'}).then( (d:any )=> {
        st.value.isLoad = false;
        //mlog('check', d );
        if(d.data.cf.cnt>0) {
            ms.success(d.data.cf.msg); 
            emit('success');
        }
        else ms.info(d.data.cf.msg);
    }).catch( ()=> st.value.isLoad = false );
}
loadQrPay();

</script>
<template>
<div   v-if="!st.isLoad"  >
    <div  v-html="payConfig.msgHead"></div>
    <div class="grid justify-center items-center  grid-cols-3 gap-2" v-if="payConfig.qr.length" >
    <div  v-for="(v,k) in payConfig.qr" class="text-center payinfo cursor-pointer" @click="goSelect(k)" >
        <div  :class="[ payConfig.index==k?'selected':'']"  class=" border rounded-md py-2 dark:border-neutral-700" >
            <h1 class="text-2xl text-yellow-500" >{{v.ds}}元</h1>
            <div v-html="v.info"></div>
        </div>
    </div>
    </div>
    <div class="uinfo py-2" >
        <div class="cursor-pointer"  @click="homeStore.setMyData({act:'showPrice'})">
            <NTag size="small" type="success" round :bordered="false"  class="!cursor-pointer" >
                <div class="flex justify-center items-center">
                    <svgIcon icon="ri:money-dollar-box-line"/> <span>各模型价格</span>
                </div>
            </NTag>
        </div>
    </div>
    <div class="flex justify-center items-center h-[200px] pt-4" v-if="payConfig.qr.length">
        <div class=" w-[180px] h-[180px]  rounded-md  bg-white flex justify-center items-center" >
                    <qrcode-vue :value="st.qrurl" :size="150" level="H" />
        </div>
        
        <div class="m-2 flex flex-col justify-start items-start">
            
            <div style="color: #999999">
                <span style="transform: translateY(4px) ;display: inline-block"><svg data-v-795b2144="" t="1669863099595" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"   width="16" height="16" class="icon"><path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z" p-id="2727" fill="#00be82"></path></svg>
                </span> 请使用微信扫一扫付款
            </div>
            
            <div class="py-2">
                <NButton  type="primary" ghost  @click="gzCheck()" >我已充值成功 刷新</NButton>
            </div>
            <div class="py-2" v-if="isWechat">
                <NButton  type="info" @click="goUrl(st.qrurl)"  >去付款</NButton>
            </div>
        </div>
    </div>
    <div v-html="payConfig.msgFoot"></div>
</div>
<div class="h-[140px] flex justify-center items-center" v-else>
    <n-empty description="正在载入...">
    <template #icon>
      <n-icon>
        <svgIcon icon="line-md:downloading-loop"    />
      </n-icon>
    </template>
    </n-empty>
</div>
</template>
<style >
.payinfo .selected{
    @apply  dark:border-yellow-500 border-yellow-500;
}
</style>