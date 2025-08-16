<template>
	<banner :url="bannerImg" v-if="bannerImg">
		<div class="baner-text">{{ bannerText }}</div>
	</banner>
	<div class="h-[400px]" v-else></div>
	<div class="small-main dark:text-white">
		<h1 class="flex items-center py-4 space-x-2 text-xl">
			<svg-icon name="baozu" class="w-5 h-5"></svg-icon>
			<span>树洞</span>
			<button @click="off.mask = true" class="btn-purple text-sm">来一条</button>
		</h1>

		<div class="columns-2 gap-3 sm:columns-3 sm:gap-5">
			<div v-for="(p, i) in list" :key="i" :class="p.color" class="break-inside-avoid-column mb-3 sm:mb-5 p-5 w-full cursor-pointer rounded-md hover:scale-[1.05] duration-300">
				<div class="py-3 dark:text-black">{{ p.createTime }}</div>
				<div class="text-neutral-600 text-sm">{{ p.content }}</div>
				<div class="py-3 text-right dark:text-black">{{ p.name }}</div>
			</div>
		</div>
		<my-page :total="total" :pageNum="pageNum" :pageSize="pageSize" @changePage="changePage" @changeNext="changeNext" @changePrev="changePrev" />
		<!-- 自定义弹框 -->
		<div class="mask" v-if="off.mask">
			<form class="border bg-white dark:text-black w-[90%] sm:w-[500px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-md" @submit="submitHandle">
				<div>写点什么</div>
				<div class="border border-slate-300 mt-5 p-2 rounded-md hover:border-purple-400 text-sm duration-300">
					<div>留言内容</div>
					<textarea placeholder="示例：你好！" ref="textareaRef" v-model="form.content" class="block py-2 min-h-[50px] w-full outline-none resize-none overflow-hidden" @input="textHandle" />
				</div>

				<div class="border border-slate-300 mt-5 p-2 rounded-md hover:border-purple-400 text-sm duration-300">
					<div>您的名称（选填）</div>
					<input placeholder="示例：马云" v-model="form.name" class="block py-2 w-full outline-none resize-none overflow-hidden" />
				</div>

				<div class="border border-slate-300 mt-5 p-2 rounded-md hover:border-purple-400 text-sm duration-300">
					<div>您的邮箱（选填）</div>
					<input placeholder="示例：990748875@qq.com" v-model="form.email" class="block py-2 w-full outline-none resize-none overflow-hidden" />
				</div>
				<div class="mt-4 m-auto text-center space-x-2">
					<button class="btn-purple" @click="cancleHandle">取消</button>
					<button class="btn-green">提交</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import api from './api';
import { errorDeal, successDeal } from '@/utils/utils';

const off = reactive({
	mask: false
});
const colorList = ['bg-cyan-100', 'bg-amber-100', 'bg-lime-100', 'bg-sky-100', 'bg-fuchsia-100', 'bg-rose-100', 'bg-emerald-100', 'bg-yellow-100', 'bg-violet-100', 'bg-orange-100'];
const randomColor = () => {
	return colorList[Math.floor(Math.random() * 10)];
};

const form = reactive({
	content: '',
	name: '',
	email: ''
});
const submitHandle = (e) => {
	e.preventDefault();
	if (!form.content) return errorDeal('请输入留言内容');
	api.holeAdd(form).then((res) => {
		off.mask = false;
		form.content = '';
		form.name = '';
		form.email = '';
		successDeal('留言成功,等待后台审核！');
		getList();
	});
};

const cancleHandle = (e) => {
	e.preventDefault();
	form.content = '';
	form.name = '';
	form.email = '';
	off.mask = false;
};

onMounted(() => {
	getList();
	settingList();
});

const list = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(12);
function getList() {
	let json = {
		pageNum: pageNum.value,
		pageSize: pageSize.value
	};
	api.holeList(json).then((res) => {
		list.value = res.data.data.map((p) => {
			return {
				...p,
				color: randomColor()
			};
		});
		total.value = res.data.total;
		window.scrollTo(0, 0);
	});
}

const bannerText = ref('');
const bannerImg = ref('');
const settingList = () => {
	api.settingList({ id: 5 }).then((res) => {
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
const textareaRef = ref(null);
const textHandle = (e) => {
	e.stopPropagation();
	e.preventDefault();
	textareaRef.value.style.height = '56px';
	textareaRef.value.style.height = e.target.scrollHeight + 'px';
};
</script>

<style lang="scss" scoped>
.mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 999;
}
</style>
