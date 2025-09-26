<template>
	<!-- <MyHeader /> -->

	<router-view />
	<!-- <div :class="isbigMain ? 'big-main' : 'small-main'" class="mt-4">
		<APlayer ref="aplayerRef" />
	</div> -->

	<MyFooter />
	<Loading />
	<div class="border bg-slate-100 border-slate-300 rounded-md fixed right-5 sm:right-10 bottom-5 sm:bottom-20 z-40 flex flex-col cursor-pointer">
		<!-- <div class="w-10 h-12 border-b border-b-slate-300 flex justify-center items-center p-1 hover:bg-slate-200" @click="webSocket">
			<svg-icon name="chat" class="w-7 h-7 text-blue-600"></svg-icon>
		</div> -->
		<div class="w-10 h-12 flex justify-center items-center p-1 hover:bg-slate-200" @click="top">
			<svg-icon name="top" class="w-7 h-7 text-blue-600"></svg-icon>
		</div>
	</div>

	<!-- 聊天室 -->
	<WebChart ref="webChartRef" />
</template>

<script setup>
import APlayer from '@worstone/vue-aplayer';
import WebChart from '@/components/WebChart.vue';
import { useUserStore } from '@/stores';
const userStore = useUserStore();
import api from './api';
import { errorDeal } from '@/utils/utils';

const $route = useRoute();
const isbigMain = computed(() => {
	let path = $route.path;
	let arr = ['/home', '/life', '/album'];
	return arr.includes(path);
});

const aplayerRef = ref(null);
onMounted(() => {
	// api.musicList().then((res) => {
	// 	aplayerRef.value.addList(res.data);
	// });
});

// 通信
const webChartRef = ref(null);

const webSocket = () => {
	if (userStore.userInfo && userStore.userInfo.email) {
		webChartRef.value.open();
	} else {
		errorDeal('请先登录');
	}
};

const top = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
};
</script>

<style lang="scss" scoped></style>

<style>
.aplayer {
	margin: 0 !important;
}
</style>
