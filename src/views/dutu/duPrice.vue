<script setup lang="ts">
import { ajax } from '@/api';
import { ref } from 'vue';
import { NTable } from 'naive-ui'

const list= ref<any[]>([]);
const st =ref ({isLoad:false});
const loadPrice= ()=>{
    ajax({'url':'/hetao/token/price'}).then( (d:any )=> {
        st.value.isLoad= true;
        list.value= d.data.price;
    });
}
loadPrice();
</script>
<template>
<div class="flex justify-center items-center h-[60px]" v-if="!st.isLoad">
    Loading....
</div>
<div v-else style="margin: -16px -24px;">
     <n-table striped size="small" :bordered="false">
        <thead>
            <tr>
                <th class="!pl-4">模型</th>
                <th style="text-align: right;">单位</th>
                <th style="text-align: right;">消耗积分</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="v in list">
                <td class="!pl-4">{{ v.model }}</td>
                <td class="text-right w-[100px]">{{ v.ut }}</td>
                <td class="text-right">{{ v.fen }}</td>
            </tr>
        </tbody>
    </n-table>


    <ul class="p-6">
        说明：
        <li>1千Tokens约380汉字</li> 
    </ul>
</div>
</template>