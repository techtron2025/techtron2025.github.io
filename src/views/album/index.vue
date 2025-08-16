<template>
	<banner :url="bannerImg" v-if="bannerImg">
		<div class="baner-text">{{ bannerText }}</div>
	</banner>
      <div class="h-[400px]" v-else></div>
	<div class="big-main dark:text-white">
		<h1 class="flex items-center py-4 space-x-2 text-xl">
			<svg-icon name="baozu" class="w-5 h-5"></svg-icon>
			<span>我的相册</span>
		</h1>

		<div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
			<div class="rounded-md overflow-hidden border dark:border-slate-700 dark:bg-slate-800 shadow-md" v-for="(item, index) in list" :key="index">
				<div class="relative cursor-pointer h-[200px] overflow-hidden">
					<img :src="item.fullUrl" alt="" class="h-full w-full hover:scale-125 transition duration-300" @click="goDetail(item)" />
					<div class="bg-03-black absolute left-0 top-0 w-full h-full flex justify-center items-center" v-if="item.isPwd == 1">
						<input
							type="password"
							v-model="item.password"
							placeholder="请输入密码"
							class="rounded-sm border placeholder:text-red-300 border-red-300 bg-transparent text-white pl-2 outline-none text-sm py-1"
						/>
						<button class="text-red-300 ml-2 font-bold" @click="goDetail(item)">look</button>
					</div>
				</div>
				<div class="px-3 py-5">
					<p class="text-purple-700 dark:text-purple-400 font-bold">{{ item.name }}（{{ item.nums || 0 }} 张）</p>
					<span>时间：{{ item.createTime }}</span>
				</div>
			</div>
		</div>
		<my-page :total="total" :pageNum="pageNum" :pageSize="pageSize" @changePage="changePage" @changeNext="changeNext" @changePrev="changePrev" />
	</div>
</template>

<script setup>
import api from './api';
import { errorDeal } from '@/utils/utils';

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
		pageNum: pageNum.value,
		pageSize: pageSize.value
	};
	api.albumList(json).then((res) => {
		list.value = res.data.data;
		total.value = res.data.total;
		window.scrollTo(0, 0);
	});
}

const bannerText = ref('');
const bannerImg = ref('');
const settingList = () => {
	api.settingList({ id: 3 }).then((res) => {
		bannerImg.value = res.data.fullUrl;
		bannerText.value = res.data.title;
	});
};

const $router = useRouter();

const goDetail = (item) => {
	api.albumPwd({ id: item.id, password: item.password }).then((res) => {
		if (!res.data.total) return errorDeal('当前相册还没有图片哦');
		$router.push({
			path: '/album-detail',
			query: {
				id: item.id,
				name: item.name
			}
		});
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
</script>

<style lang="scss" scoped></style>
