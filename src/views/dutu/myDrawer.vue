<script setup lang="ts">
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { NDrawer,NModal,NDrawerContent } from 'naive-ui'
import { computed,useAttrs } from 'vue'

const { isMobile } = useBasicLayout()
const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue:boolean,wlClass?:'' ,title?:string}>();
const attrs = useAttrs()

const mvalue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
<template>
    <NDrawer v-if="isMobile" v-model:show ="mvalue" placement="bottom"  class="myclass" >
       <NDrawerContent :title="title" > <slot/></NDrawerContent>
    </NDrawer>
    <NModal v-else v-model:show ="mvalue" preset="card"  v-bind="attrs" :title="title">
        <slot />
    </NModal>
</template>
<style scoped>
.myclass{
  --n-body-padding:10px 20px;
}
</style>