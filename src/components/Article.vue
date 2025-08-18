<template>
	<div
		class="w-full h-60 relative flex bg-slate-500 rounded-md shadow-md overflow-hidden text-white mt-5 first:mt-0"
		v-for="(p, i) in list"
		:key="i"
		@click="goDetail(p)"
		:class="i % 2 ? 'flex-row ' : 'flex-row-reverse'"
	>
		<!-- 图片 -->
		<div
			class="min-w-[45%] hidden sm:block relative z-10 scale-100 hover:scale-125 duration-300 bg-cover bg-no-repeat bg-center"
			:style="{ backgroundImage: `url(${p.fullUrl})`, clipPath: i % 2 ? ' polygon(0 0, 100% 0, 90% 100%, 0 100%) ' : 'polygon(10% 0px, 100% 0px, 100% 100%, 0px 100%)' }"
		></div>

		<!-- 文本 -->
		<div class="w-full py-5 px-3 sm:px-5 relative z-10 cursor-pointer">
			<h3 class="overflow-hidden text-center font-bold line-clamp-1 hover:text-blue-400">{{ p.title }}</h3>
			<div class="flex justify-end items-center text-sm py-1 space-x-5 mt-1">
				<div class="flex items-center space-x-2">
					<svg-icon class="rounded-full p-1 text-white bg-blue-500 w-5 h-5" name="eyes"></svg-icon>
					<span>{{ p.visitors || 0 }}</span>
				</div>
				<div class="flex items-center space-x-2">
					<svg-icon class="rounded-full p-1 text-white bg-red-500 w-5 h-5" name="msg"></svg-icon>
					<span>{{ p.comments || 0 }}</span>
				</div>
				<div class="flex items-center space-x-2 cursor-pointer">
					<svg-icon
						class="rounded-full p-1 bg-green-500 w-5 h-5"
						name="like"
						:class="p.isLike == 1 && userStore.userInfo.username ? 'text-red-600' : 'text-slate-500'"
						size="20"
						@click="likeHandle($event, p)"
					></svg-icon>
					<span>{{ p.likes || 0 }}</span>
				</div>
			</div>
			<!-- 摘要 -->
			<p class="min-h-20 line-clamp-3 leading-7 text-[#cecece] text-sm indent-[2em]">{{ p.blogAbstract }}</p>
			<!-- 标签 -->
			<div class="flex justify-between items-center mt-4 text-sm px-5">
				<div class="flex items-center space-x-2 cursor-pointer">
					<span
						@click.prevent.stop="lableSearchHandle(p)"
						class="px-2 rounded-md border hover:border-blue-500 font-normal hover:text-blue-500"
						v-for="(p, i) in JSON.parse(p.tags)"
						:key="i"
					>
						{{ p }}
					</span>
				</div>
				<div class="flex items-center space-x-2 text-sm">
					<svg-icon class="rounded-full p-1 text-white bg-orange-500 w-5 h-5" name="time"></svg-icon>
					<span>{{ p.createTime }}</span>
				</div>
			</div>
		</div>

		<div class="absolute w-full h-full bg-no-repeat bg-center bg-cover" :style="{ backgroundImage: `url(${p.fullUrl})`, filter: 'blur(2.5rem) brightness(0.6)' }"></div>
	</div>
</template>

<script setup>
import api from './api';
import { useUserStore } from '@/stores';
const userStore = useUserStore();

const props = defineProps(['list']);
const $emits = defineEmits(['updateList']);

const $router = useRouter();
const $route = useRoute();

const goDetail = (p) => {
	$router.push({
		path: '/detail',
		query: { id: p.id }
	});
};

// 点赞
function likeHandle(e, p) {
	e.stopPropagation();
	api.giveLike({ id: p.id }).then((res) => {
		$emits('updateList', res.data);
	});
}

import mitter from '@/utils/mitter';
function lableSearchHandle(p) {
	if ($route.path == '/home') {
		mitter.emit('getLableList', p);
	} else {
		$router.push({
			path: '/home',
			query: { lableName: p }
		});
	}
}
</script>

<style lang="scss" scoped></style>
