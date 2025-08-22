<template>
	<banner :url="bannerImg" v-if="bannerImg">
		<div class="baner-text">{{ bannerText }}</div>
	</banner>
	<div class="h-[400px]" v-else></div>
	<div class="big-main dark:text-white">
		<h1 class="flex items-center py-4 space-x-2 text-xl">
			<svg-icon name="baozu" class="w-5 h-5"></svg-icon>
			<span>生活倒影</span>
		</h1>

		<div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-5">
			<div class="rounded-md overflow-hidden border dark:border-slate-700 dark:bg-slate-800 shadow-md" v-for="(item, index) in list" :key="index">
				<div class="cursor-pointer h-40 overflow-hidden" @click="goDetail(item)">
					<img :src="item.fullUrl" alt="" class="hover:scale-125 duration-300" />
				</div>
				<div class="bottom p-4 text-slate-500">
					<div class="flex items-center space-x-2 py-1" @click="goDetail(item)">
						<svg-icon class="rounded-full p-1 text-white bg-orange-500 w-5 h-5" name="time"></svg-icon>
						<span>{{ item.createTime }}</span>
					</div>

					<div class="text-black py-2 flex space-x-2 items-center" @click="goDetail(item)">
						<svg-icon class="rounded-full text-white p-1 bg-red-500 w-5 h-5" name="hot"></svg-icon>
						<span class="line-clamp-1 flex-1 dark:text-white">{{ item.title }}</span>
					</div>

					<div class="flex items-center space-x-5 text-slate-500">
						<div class="flex items-center space-x-2">
							<svg-icon class="rounded-full p-1 text-white bg-yellow-500 w-5 h-5" name="msg"></svg-icon>
							<span>{{ item.comments || 0 }}</span>
						</div>
						<div class="flex items-center space-x-2">
							<svg-icon class="rounded-full p-1 text-white bg-purple-500 w-5 h-5" name="eyes"></svg-icon>
							<span>{{ item.visitors || 0 }}</span>
						</div>
						<div class="flex items-center space-x-2 cursor-pointer" @click="likeHandle($event, item)">
							<svg-icon
								class="rounded-full p-1 bg-green-500 w-5 h-5"
								name="like"
								:class="item.isLike == 1 && userStore.userInfo.username ? 'text-red-600' : 'text-slate-500'"
								size="20"
							></svg-icon>
							<span>{{ item.likes || 0 }}</span>
						</div>
					</div>

					<div>{{ item.content }}</div>
					<div class="flex items-center space-x-2 mt-4 cursor-pointer">
						<div class="px-2 rounded-md border border-slate-500 text-sm hover:border-blue-600 font-normal hover:text-blue-600" v-for="(p, i) in JSON.parse(item.tags)" :key="i">
							<span>{{ p }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<my-page :total="total" :pageNum="pageNum" :pageSize="pageSize" @changePage="changePage" @changeNext="changeNext" @changePrev="changePrev" />
	</div>
</template>

<script setup>
import { useUserStore } from '@/stores';
const userStore = useUserStore();
import api from './api';

onMounted(() => {
	getList();
	settingList();
});

const list = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(6);
function getList() {
	let json = {
		title: '',
		lable: '',
		type: 7, //生活
		pageNum: pageNum.value,
		pageSize: pageSize.value
	};
	api.articleList(json).then((res) => {
		list.value = res.data.data;
		total.value = res.data.total;
		window.scrollTo(0, 0);
	});
}
let bannerText = ref('');
const bannerImg = ref('');
const settingList = () => {
	api.settingList({ id: 2 }).then((res) => {
		bannerImg.value = res.data.fullUrl;
		bannerText.value = res.data.title;
	});
};

const $router = useRouter();

const goDetail = (item) => {
	$router.push({
		path: '/detail',
		query: {
			id: item.id
		}
	});
};

// 分页
function changePage(val) {
	pageNum.value = val;
	getList();
}

function changeNext() {
	pageNum.value++;
	getList();
}

function changePrev() {
	pageNum.value--;
	getList();
}

// 点赞
function likeHandle(e, item) {
	e.stopPropagation();
	api.giveLike({ id: item.id }).then(({ data }) => {
		list.value.forEach((p) => {
			if (p.id == data.id) {
				p.isLike = data.isLike;
				p.likes = data.likes;
			}
		});
	});
}
</script>

<style lang="scss" scoped></style>
