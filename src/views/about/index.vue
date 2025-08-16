<template>
	<banner :url="bannerImg" v-if="bannerImg">
		<div class="baner-text">{{ bannerText }}</div>
	</banner>
	<div class="h-[400px]" v-else></div>
	<div class="small-main dark:text-white">
		<v-md-editor v-model="content" mode="preview"></v-md-editor>

		<div class="content">
			<div class="flex items-center space-x-2 mt-10">
				<svg-icon name="baozu" class="w-5 h-5"></svg-icon>
				<span class="f-fs-20 f-ml-10 black">给我留言</span>
			</div>

			<form @submit="submitHandle">
				<div class="border border-slate-300 mt-5 p-2 rounded-md hover:border-purple-400 text-sm duration-300">
					<div>您的邮箱（选填）</div>
					<input placeholder="示例：990748875@qq.com" v-model="form.email" class="block bg-slate-100 dark:bg-slate-700 py-2 w-full outline-none resize-none overflow-hidden" />
				</div>
				<div class="border border-slate-300 mt-5 p-2 rounded-md hover:border-purple-400 text-sm duration-300">
					<div>留言内容</div>
					<textarea
						placeholder="示例：你好！"
						ref="textareaRef"
						v-model="form.content"
						class="block bg-slate-100 dark:bg-slate-700 py-2 min-h-[80px] w-full outline-none resize-none overflow-hidden"
						@input="textHandle"
					/>
				</div>

				<div class="mt-4 m-auto text-center space-x-2">
					<button class="btn-purple" @click="reset">重置</button>
					<button class="btn-green">提交</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import api from './api';
import { getStore, successDeal, errorDeal } from '@/utils/utils';
// markdown 黑暗模式修改
import { useMarkdown } from '@/hooks/markdown';
useMarkdown();

onMounted(() => {
	settingList();
});
const content = ref('');
api.getBloger().then((res) => {
	content.value = res.data.content;
});

const form = reactive({
	email: '',
	content: ''
});

const submitHandle = (e) => {
	e.preventDefault();
	if (!form.content) return errorDeal('请输入留言内容');
	api.msg(form)
		.then((res) => {
			successDeal('留言成功');
			cancle();
		})
		.catch((err) => {
			cancle();
		});
};

const reset = (e) => {
	e.preventDefault();
	cancle();
};

const cancle = () => {
	form.email = '';
	form.content = '';
	textareaRef.value.style.height = '80px';
};
const textareaRef = ref(null);
const textHandle = (e) => {
	e.preventDefault();

	textareaRef.value.style.height = '80px';
	textareaRef.value.style.height = e.target.scrollHeight + 'px';
};

const bannerText = ref('');
const bannerImg = ref('');
const settingList = () => {
	api.settingList({ id: 6 }).then((res) => {
		bannerImg.value = res.data.fullUrl;
		bannerText.value = res.data.title;
	});
};
</script>

<style lang="scss" scoped></style>

<style>
.vuepress-markdown-body:not(.custom) {
	padding: 10px !important;
}
</style>
