<script setup lang="ts">
import { NSwitch } from 'naive-ui';
import { gptServerStore } from '@/store';
import { watch } from 'vue'
import pkg from '../../../package.json'

watch(()=>gptServerStore.myData, ()=>  gptServerStore.setMyData( gptServerStore.myData ),{deep:true});
</script>
<template>
<div>
    <h2 class="text-xl font-bold uitem"> 核桃国际： V{{ pkg.version }}</h2>
    <section class="mb-4 flex justify-start items-center">
        <n-switch v-model:value="gptServerStore.myData.MJ_CDN_WSRV" size="small" >
            <template #checked>  {{ $t('mj.wsrvClose') }} </template>
            <template #unchecked> {{ $t('mj.wsrvOpen') }} </template>
        </n-switch>
    </section>
</div>
</template>
<style scoped>
.uitem{
    @apply pb-4;
}
</style>