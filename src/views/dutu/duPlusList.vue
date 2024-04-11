<script setup lang="ts">
import { ref,watch } from 'vue'
import {NDrawerContent, NDrawer} from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout' 
import { homeStore } from '@/store'
import { mlog } from '@/api'
import duplusItem from './duPlusItem.vue'

const st= ref({'show':false,showImg:false})
const { isMobile } = useBasicLayout()

watch(() =>  homeStore.myData.act, (act) =>{
    mlog('act',act)
    act=='showplus' && (st.value.showImg=true);
})


</script>
<template>

<n-drawer v-model:show="st.showImg" :placement="isMobile?'bottom':'right'"  :class="isMobile?['!h-[90vh]']: ['!w-[80vw]']" style="--n-body-padding:0">
    <n-drawer-content  title="选择可用账号" closable> 
        <duplusItem  />  
    </n-drawer-content>
</n-drawer>

</template>