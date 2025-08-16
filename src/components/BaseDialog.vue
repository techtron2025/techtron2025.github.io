<template>
    <el-dialog v-model="show" :title="title" :width="width" :before-close="closeDialog">
        <slot name="default"></slot>
        <template #footer v-if="footer">
            <div class="dialog-footer">
                <el-button @click="cancleDialog">取消</el-button>
                <el-button type="primary" @click="submitDialog">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const $emit = defineEmits(['submit', 'cancle'])
const props = defineProps({
    title: {
        type: String,
        default: '提示',
    },
    width: {
        type: Number,
        default: 500,
    },
    footer: {
        type: Boolean,
        default: true,
    },
})

const show = ref(false)

// 关闭按钮
const closeDialog = () => {
    show.value = false
}
// 开启
const openDialog = () => {
    show.value = true
}
// 确认按钮
const submitDialog = () => {
    $emit('submit')
}
//取消按钮
const cancleDialog = () => {
    $emit('cancle')
}

// 暴露出去，父组件调用
defineExpose({
    closeDialog,
    openDialog,
    submitDialog,
})
</script>

<style lang="scss" scoped></style>
