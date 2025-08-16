<!-- 评论组件 -->
<template>
	<div class="text-sm text-slate-600">
		<h3 class="mt-5 text-black text-xl dark:text-white">评论 {{ total }}</h3>
		<!-- 当前评论 -->
		<div class="flex mt-5 space-x-2">
			<el-avatar :size="32" :src="userStore.userInfo.avatar || '/uploads/avatar/nv.png'" />
			<div class="flex-1">
				<answer @answer="currentAnswer" />
			</div>
		</div>

		<!-- 全部评论 -->
		<div class="mt-5 leading-7 dark:text-slate-300" v-for="(p, i) in list" :key="i">
			<!-- 一级 -->
			<div class="flex space-x-2">
				<div class="w-8">
					<el-avatar :size="32" :src="p.avatar || '/uploads/avatar/nv.png'" />
				</div>
				<div class="flex-1">
					<div>
						<div class="text-blue-700 dark:text-blue-400 font-bold">{{ p.username }}</div>
						<div class=" ">{{ p.content }}</div>
						<div class="flex items-center cursor-pointer space-x-3 py-1" @click.stop="commentHandle(p)">
							<span>{{ timeAgo(p.time) }}</span>
							<div class="flex items-center space-x-2">
								<svg-icon name="comment" class="w-3 h-3"></svg-icon>
								<span class="cursor-pointer">评论</span>
							</div>
						</div>
					</div>
					<answer v-clickOutside="p" v-if="p.isShow" @answer="otherAnswer($event, 1)" class="f-mt-10" />
				</div>
			</div>

			<!-- 二级 -->
			<template v-if="p.children && p.children.length">
				<div v-for="(k, j) in p.children" class="f-mt-10" :key="j">
					<div class="flex items-center flex-wrap ml-14 space-x-2">
						<el-avatar :size="20" :src="k.avatar || '/uploads/avatar/nv.png'" />
						<span class="text-blue-700 dark:text-blue-400 font-bold">@{{ k.username }}</span>
						<span class="text-black mx-2 dark:text-white">回复</span>
						<span class="text-blue-700 dark:text-blue-400 font-bold">@{{ k.toUsername }}</span>
						<span>：</span>
						<p>{{ k.content }}</p>
					</div>

					<div class="flex items-center space-x-3 ml-14">
						<span>{{ timeAgo(k.time) }}</span>
						<div class="flex items-center space-x-2" @click.stop="commentHandle(k)">
							<svg-icon name="comment" class="w-3 h-3"></svg-icon>
							<span class="cursor-pointer">评论</span>
						</div>
					</div>
					<div class="ml-14">
						<answer v-clickOutside="k" v-if="k.isShow" @answer="otherAnswer($event, 2)" />
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from '@/stores';
const userStore = useUserStore();

import { timeAgo } from '@/utils/utils';

const props = defineProps(['acticleId', 'list', 'total']);

const $emits = defineEmits(['answer']);

// 一级评论
const currentInfo = ref(null);
function commentHandle(p) {
	p.isShow = 1;
	currentInfo.value = p;
}

// 当前评论
function currentAnswer(content) {
	let data = {
		type: 1, //1当前评论  2级评论
		acticleId: props.acticleId,
		userId: userStore.userInfo.id,
		username: userStore.userInfo.username,
		avatar: userStore.userInfo.avatar,
		content,
		toUserId: '',
		toUsername: '',
		toAvatar: '',
		commentId: ''
	};
	$emits('answer', data);
}

// 其他评论
function otherAnswer(content, level) {
	let data = {
		type: 2, //1当前评论  2级评论
		acticleId: props.acticleId,
		userId: userStore.userInfo.id,
		username: userStore.userInfo.username,
		avatar: userStore.userInfo.avatar,
		content,
		toUserId: currentInfo.value.userId,
		toUsername: currentInfo.value.username,
		toAvatar: currentInfo.value.avatar,
		commentId: level == 1 ? currentInfo.value.id : currentInfo.value.commentId
	};
	$emits('answer', data);
}
</script>

<style lang="scss" scoped></style>
