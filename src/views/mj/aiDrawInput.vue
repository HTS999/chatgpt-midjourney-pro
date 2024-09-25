<script setup lang="ts">
import { NTabs,NTabPane } from 'naive-ui';
import aiDrawInputItem from './aiDrawInputItem.vue'
import aiFace from './aiFace.vue'
import aiBlend from './aiBlend.vue'
import aiDall from './aiDall.vue'
import aiIdeoInput from './aiIdeoInput.vue'

const $emit=defineEmits(['drawSent','close']);
const drawSent=(d:any )=> $emit('drawSent',d);
</script>
<template>
<div class="overflow-y-auto bg-[#fafbfc] pt-2 dark:bg-[#18181c] h-full ">
 
<n-tabs type="line" animated default-value="draw">
    <n-tab-pane name="start" tab=""> 

    </n-tab-pane>
     <n-tab-pane name="draw" tab="MidJourney" >
        <n-tabs type="segment" animated   default-value="draw23" size="small">
            <n-tab-pane name="draw23" :tab="$t('mjchat.draw')" >
                <aiDrawInputItem @draw-sent="drawSent" @close="$emit('close')"></aiDrawInputItem>

            </n-tab-pane>
            <n-tab-pane name="face" :tab="$t('mjchat.face')">
            <div class="p-4"><aiFace  /></div>
            
            </n-tab-pane>
            <n-tab-pane name="blend" :tab="$t('mjchat.blend')">
            <div class="p-4"><aiBlend  /></div>
            </n-tab-pane>
        </n-tabs>
    </n-tab-pane>
    <n-tab-pane name="dall3" tab="Dall.E">
     <div class="p-4"><aiDall  /></div>
    </n-tab-pane>

    <n-tab-pane name="ideogram" tab="IdeoGram">
     <div class="p-2"> <aiIdeoInput/> </div>
    </n-tab-pane>
</n-tabs> 
</div>
</template>