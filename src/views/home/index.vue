<template>
	<banner url="https://techtron-1304230447.cos.ap-shanghai.myqcloud.com/system/colorful_8.jpg">
		<div class="baner-text">{{ bannerText }}</div>
	</banner>
	<div class="big-main flex">
		<div class="flex-1">
			<Article :list="list" @updateList="updateList" />
			<my-page :total="total" :pageNum="pageNum" :pageSize="pageSize" @changePage="changePage" @changeNext="changeNext" @changePrev="changePrev" />
		</div>

		<!-- 右边 菜单 -->
		<div class="w-80 pl-5 lg:block hidden">
			<!-- 个人介绍 -->
			<section
				class="author shadow-md bg-white dark:bg-slate-800 dark:border-slate-700 w-full border-solid border overflow-hidden border-zinc-300 rounded-md flex flex-col flex-wrap items-center bg-no-repeat"
			>
				<div class="relative mt-[150px] w-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center">
					<div class="absolute left-1/2 -translate-x-1/2 tr -top-12 size-24 rounded-full cursor-pointer shadow-md overflow-hidden">
						<img src="../../assets/imgs/avatar.jpg" class="hover:scale-125 duration-300" />
					</div>
					<div class="h-12"></div>
					<p class="py-3 text-2xl dark:text-white">techtron</p>
					<p class="py-3 text-zinc-500 dark:text-white">Stay Hungry. Stay Foolish. </p>
					<div class="border-t border-zinc-300 dark:border-slate-800 w-full mt-8 flex flex-col items-center">
						<div class="-mt-3 w-28 h-6 text-center dark:bg-slate-800 bg-slate-100 dark:text-white">社交账号</div>

						<div class="flex space-x-4 mt-5 pb-4 cursor-pointer">
							<a href="https://github.com/techtron2025" target="_blank">
								<img class="w-5 h-5" src="../../assets/imgs/github.svg" alt="" />
							</a>
							<!-- <a href="" target="_blank">
								<img class="w-5 h-5" src="../../assets/imgs/Gitee.svg" alt="" />
							</a> -->
							<!-- <a href="https://juejin.cn/" target="_blank">
								<img class="w-5 h-5" src="../../assets/imgs/Juejin.svg" alt="" />
							</a> -->
						</div>
					</div>
				</div>
			</section>
			<!-- 生活推荐 -->
			<!-- <section class="w-full border-solid border border-zinc-300 dark:border-slate-700 dark:bg-slate-800 rounded-md mt-5 overflow-hidden text-center p-4 shadow-md cursor-pointer">
				<div class="py-2 border-b dark:border-b-slate-700 dark:text-white">生活推荐</div>
				<div class="life relative flex flex-col w-full h-40 hover text-white mt-5 rounded-md overflow-hidden" v-for="(p, i) in lifeList" :key="i" @click="goLifeDetail(p)">
					<div class="flex-1 left-0 top-0 bg-center bg-no-repeat bg-cover hover:scale-125 duration-300 overflow-hidden" :style="{ backgroundImage: `url(${p.fullUrl})` }"></div>
					<p class="absolute left-0 bottom-0 w-full h-10 leading-10 line-clamp-1 bg-03-black">{{ p.title }}</p>
				</div>
			</section> -->
			<!-- 我的相册 -->
			<!-- <section class="w-full border-solid border border-zinc-300 dark:border-slate-700 dark:bg-slate-800 rounded-md mt-5 overflow-hidden p-4 shadow-md">
				<div class="py-2 border-b dark:border-b-slate-700 text-center dark:text-white">我的相册</div>
				<div class="flex py-4 space-x-2 text-sm border-b dark:border-b-slate-700 cursor-pointer" v-for="(p, i) in albumList" :key="i" @click="goAlumbDetail(p)">
					<div class="size-12 cursor-pointer overflow-hidden rounded-full shadow-md">
						<img :src="p.fullUrl" class="w-full h-full hover:scale-125 duration-300" alt="" />
					</div>

					<div>
						<p class="line-clamp-2 py-1 hover:text-blue-700 dark:text-white">{{ p.name }}</p>
						<text class="text-xs text-slate-400 text-left">{{ p.createTime }}</text>
					</div>
				</div>
			</section> -->
		</div>
	</div>
</template>

<script setup>
import api from './api';
import mitter from '@/utils/mitter';
import { errorDeal } from '@/utils/utils';
const $route = useRoute();

// 其他页面调用这个方法
mitter.on('getHomeList', getHomeList);
mitter.on('getLableList', getLableList);

onMounted(() => {
	if ($route.query.title) {
		title.value = $route.query.title;
	}

	if ($route.query.lableName) {
		lable.value = $route.query.lableName;
	}
	getList();
	// visitorAdd();
	// getLifeList();
	// settingList();
	// getAlbumList();
});

// 首页全部文章·
const list = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(6);
const title = ref('');
const lable = ref('');

function cancel() {
	pageNum.value = 1;
	pageSize.value = 6;
	title.value = '';
	lable.value = '';
}

function getList() {
	let json = {
		title: title.value,
		tag: lable.value,
		current: pageNum.value,
		pageSize: pageSize.value
	};
	api.articleList(json).then((res) => {
		list.value = res.data.records;
		total.value = res.data.total;
		window.scrollTo(0, 0);
	});
}

const printText = (text, index = 0) => {
	if (index < text.length) {
		bannerText.value += text.split('')[index];
		++index;
		setTimeout(() => {
			printText(text, index);
		}, 200);
	} else {
		minusText(text, index);
	}
};

const minusText = (text, index) => {
	if (index >= 0) {
		bannerText.value = bannerText.value.substring(0, index);
		index--;
		setTimeout(() => {
			minusText(text, index);
		}, 100);
	} else {
		setTimeout(() => {
			printText(text, 0);
		}, 1000);
	}
};

onBeforeUnmount(() => {
	mitter.off('getHomeList');
	mitter.off('getLableList');
});

let bannerText = ref('书写是为了更好的思考');
const bannerImg = ref('https://techtron-1304230447.cos.ap-shanghai.myqcloud.com/blog/banner.png');
// printText('书写是为了更好的思考')
const settingList = () => {
	api.settingList({ id: 1 }).then((res) => {
		bannerImg.value = res.data.fullUrl;
		printText(res.data.title);
	});
};

// 相册相关
const albumList = ref([]);
const $router = useRouter();
const getAlbumList = () => {
	api.albumList({ pageNum: 1, pageSize: 6 }).then((res) => {
		albumList.value = res.data.data;
	});
};
const goAlumbDetail = (val) => {
	api.albumPwd({ id: val.id, password: '' }).then((res) => {
		if (!res.data.total) return errorDeal('当前相册还没有图片哦');
		$router.push({
			path: '/album-detail',
			query: {
				id: val.id,
				name: val.name
			}
		});
	});
};

// 新增访客
function visitorAdd() {
	api.visitorAdd().then((res) => {
		// console.log(res);
	});
}

// 关键字查询
function getHomeList(val) {
	cancel();
	title.value = val || '';
	getList();
}
// 标签查询
function getLableList(val) {
	cancel();
	lable.value = val || '';
	getList();
}

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

// 获取生活列表
const lifeList = ref([]);
function getLifeList() {
	let json = {
		title: '',
		lable: '',
		type: 7, //生活
		pageNum: 1,
		pageSize: 3
	};
	api.articleList(json).then((res) => {
		lifeList.value = res.data.data;
	});
}

const goLifeDetail = (val) => {
	$router.push({
		path: '/detail',
		query: {
			id: val.id
		}
	});
};

// 更新点赞
function updateList(data) {
	list.value.forEach((p) => {
		if (p.id == data.id) {
			p.isLike = data.isLike;
			p.likes = data.likes;
		}
	});
}
</script>

<style lang="scss" scoped>
.author {
	background-image: url('../../assets/imgs/top.jpg');
	background-position: center 0;
	background-size: 100% 40%;
}

@keyframes lineeff51 {
	0% {
		border-right: 1px solid rgba(0, 0, 0, 0);
	}
	100% {
		border-right: 1px solid rgba(0, 0, 0, 0.4);
	}
}
</style>
