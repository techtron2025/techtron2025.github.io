<template>
	<section>
		<div class="border border-slate-300 mt-5 p-2 rounded-md hover:border-purple-400 text-sm duration-300">
			<div class="dark:text-white">评论内容</div>
			<textarea
				placeholder="示例：你好！"
				ref="textareaRef"
				v-model="content"
				class="block py-2 dark:text-white bg-slate-100 dark:bg-slate-700 min-h-[50px] w-full outline-none resize-none overflow-hidden"
				@input="textHandle"
			/>
		</div>

		<div class="flex items-center justify-between mt-4">
			<div>
				<V3Emoji size="small" :options-name="optionsName" @click-emoji="appendText"></V3Emoji>
			</div>

			<button class="btn-green" @click="submit">提交</button>
		</div>
	</section>
</template>

<script setup>
import { errorDeal } from '@/utils/utils';
import V3Emoji from 'vue3-emoji';
import 'vue3-emoji/dist/style.css';

const $emits = defineEmits(['answer']);

import { useUserStore } from '@/stores';
const userStore = useUserStore();

const optionsName = {
	'Smileys & Emotion': '笑脸&表情',
	'Food & Drink': '食物&饮料',
	'Animals & Nature': '动物&自然',
	'Travel & Places': '旅行&地点',
	'People & Body': '人物&身体',
	Objects: '物品',
	Symbols: '符号',
	Flags: '旗帜',
	Activities: '活动'
};

const content = ref('');

function appendText(e) {
	content.value += e;
}

// 提交信息
function submit() {
	if (!userStore?.userInfo?.username) return errorDeal('请先登录');
	if (!content.value) return errorDeal('评论不能为空哦');
	$emits('answer', content.value);
      content.value = '';
}

const textareaRef = ref(null);
const textHandle = (e) => {
	e.stopPropagation();
	e.preventDefault();
	textareaRef.value.style.height = '56px';
	textareaRef.value.style.height = e.target.scrollHeight + 'px';
};
</script>

<style lang="scss" scoped></style>
