<template>
	<banner :url="bannerImg" v-if="bannerImg">
		<div class="baner-text">{{ bannerText }}</div>
	</banner>
      <div class="h-[400px]" v-else></div>
	<div class="small-main">
		<div class="mb-4 mt-5 py-5 text-center text-2xl animated-gradient text-white">
			关于 "
			<i class="black font-bold">{{ (list && list.length && list[0].typeName) || '-' }}</i>
			" 相关的文章
		</div>
		<div>
			<Article :list="list" @updateList="updateList" />
			<my-page :total="total" :pageNum="pageNum" :pageSize="pageSize" @changePage="changePage" @changeNext="changeNext" @changePrev="changePrev" />
		</div>
	</div>
</template>

<script setup>
import api from './api';

const $route = useRoute();
const list = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(6);

onMounted(() => {
	settingList();
});

watch(
	() => $route.params.id,
	() => {
		reset();
		getList();
	},
	{ immediate: true }
);

function getList() {
	let json = {
		id: $route.params.id,
		pageNum: pageNum.value,
		pageSize: pageSize.value
	};
	api.listByClassifyId(json).then((res) => {
		list.value = [...list.value, ...res.data.data];
		total.value = res.data.total;
	});
}
const bannerText = ref('');
const bannerImg = ref('');
const settingList = () => {
	api.settingList({ id: 4 }).then((res) => {
		bannerImg.value = res.data.fullUrl;
            bannerText.value = res.data.title;
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

function reset() {
	pageNum.value = 1;
	pageSize.value = 6;
	total.value = 0;
	list.value = [];
}

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
.animated-gradient {
	animation: gradient 15s ease infinite;
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	background-color: #8685ef;
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>
