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
<div v-else>
     <n-table striped size="small">
        <thead>
            <tr>
                <th>模型</th>
                <th>单位</th>
                <th>消耗积分</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="v in list">
                <td>{{ v.model }}</td>
                <td>{{ v.ut }}</td>
                <td>{{ v.fen }}</td>
            </tr>
        </tbody>
    </n-table>
</div>
</template>