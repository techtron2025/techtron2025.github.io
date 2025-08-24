<template>
	<div
		:class="num > 200 ? 'bg-white text-black dark:bg-slate-800 dark:text-white' : 'bg-06-black text-white '"
		class="shadow-2xl fixed left-0 right-0 top-0 bottom-0 h-16 w-full z-50 transition-all"
	>
		<div class="absolute px-5 left-1/2 top-0 transform -translate-x-1/2 w-full 2xl:w-[80%] h-full z-20 flex justify-between">
			<div class="flex items-center space-x-5">
				<img class="h-9 cursor-pointer" src="../assets/imgs/logo.png" alt="" @click="goHome" />

				<!-- <div class="block lg:hidden" @click="showMask">
					<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="h-full text-[30px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m.646 2.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L4.293 8 2.646 6.354a.5.5 0 0 1 0-.708M7 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m-5 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
						></path>
					</svg>
				</div> -->
				<!-- <MyMenu :list="menuList" class="hidden lg:block" :mode="mode" /> -->
				<div class="hidden xl:block">
					<div class="text-sm h-7 flex items-center">
						<input type="text" v-model="title" placeholder="文章标题关键字查询" class="bottom-0 border border-r-0 outline-none h-full text-black pl-3 rounded-sm rounded-e-none" />
						<button class="border h-full px-3 bg-white text-slate-700 hover:text-slate-800 hover:bg-slate-100 rounded-sm rounded-s-none" @click="searchHandle">搜索</button>
					</div>
				</div>
			</div>

			<!-- <div class="flex items-center">
				<div class="size-7 border rounded-full flex items-center justify-center cursor-pointer mr-5 dark:bg-slate-800 shadow-md">
					<svg-icon :name="isTheme == 'light' ? 'sun' : 'moon'" :class="num <= 200 ? 'text-white' : 'text-black'" class="w-5 h-5 dark:text-white" @click="changeTheme"></svg-icon>
				</div>
				<div v-if="!userStore.userInfo.email" class="flex space-x-3">
					<button class="btn-purple" @click="register">注册</button>
					<button class="btn-green" @click="login">登录</button>
				</div>

				<div v-else class="relative group h-full flex items-center cursor-pointer">
					<div class="flex items-center space-x-2">
						<img :src="userStore.userInfo.avatar" alt="" class="w-8 h-8 rounded-full" />
						<span>{{ userStore.userInfo.username }}</span>
					</div>
					<ul class="absolute hidden group-hover:block sm:-left-3 -left-14 top-14 bg-white shadow-md rounded-md w-32 overflow-hidden">
						<li class="p-2 flex items-center space-x-2 transition-all hover:bg-slate-200" @click="command(1)">
							<svg-icon name="baozu" class="w-5 h-5"></svg-icon>
							<span class="hover:text-blue-500 text-slate-600 font-bold">个人中心</span>
						</li>
						<li class="p-2 flex items-center space-x-2 transition-all hover:bg-slate-200" @click="command(2)">
							<svg-icon name="baozu" class="w-5 h-5"></svg-icon>
							<span class="hover:text-blue-500 text-slate-600 font-bold">退出</span>
						</li>
					</ul>
				</div>
			</div> -->
		</div>
	</div>

	<!-- 小屏幕的mask -->
	<div v-if="mask" class="fixed left-0 right-0 bottom-0 top-0 bg-06-black z-50" @click="closedMask">
		<div class="absolute left-0 top-0 h-full bg-white p-5" :class="mask ? 'w-[80%]' : 'w-0'" @click="closedMaskSon($event)">
			<MyMenu :list="menuList" :mode="mode" />
		</div>
	</div>
</template>

<script setup>
import mitter from '@/utils/mitter';
import { useUserStore } from '@/stores';
const userStore = useUserStore();
const $router = useRouter();
const $route = useRoute();
import api from './api';
import { getStore, throttle } from '@/utils/utils';

onMounted(() => {
	// 本地存储

	isTheme.value = getStore('client_theme') || 'light';
	userStore.setTheme(isTheme.value);
	initTheme();

	// getClassifyList();
	window.addEventListener('scroll', throttle(scroll, 100));
});

// 页面刷新时，初始化主体
const initTheme = () => {
	if (isTheme.value == 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
};

// 切换主题
const isTheme = ref('light');
const changeTheme = () => {
	isTheme.value = isTheme.value == 'light' ? 'dark' : 'light';
	if (isTheme.value == 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}

	userStore.setTheme(isTheme.value);
};

onUnmounted(() => {
	window.removeEventListener('scroll', scroll);
});

watch(
	() => $route.path,
	() => {
		mask.value = false;
		mode.value = 'vertical';
	}
);

// mask
const mask = ref(false);
const mode = ref('vertical'); // vertical /horizontal
const showMask = () => {
	mask.value = true;
	mode.value = 'horizontal';
};

const closedMask = () => {
	mask.value = false;
	mode.value = 'vertical';
};

const closedMaskSon = (e) => {
	e.stopPropagation();
};

const menuList = ref([
	{ name: '首页', path: '/home', icon: 'banner01' },
	{ name: '生活', path: '/life', icon: 'banner02' },
	{ name: '相册', path: '/album', icon: 'banner03' },
	{
		name: '学习',
		path: '/',
		icon: 'banner04',
		children: []
	},
	{ name: '树洞', path: '/hole', icon: 'banner08' },
	{ name: '博主', path: '/about', icon: 'banner05' }
]);

// 学习分类
function getClassifyList() {
	api.classifyList().then((res) => {
		let arr = res.data.map((item) => {
			return { name: item.name, icon: item.icon || 'banner07', path: '/study/' + item.id };
		});
		menuList.value.forEach((p) => {
			if (p.name == '学习') {
				p.path = '/study/0';
				p.children = arr;
			}
		});
	});
}

// 搜索框
const title = ref();
function searchHandle() {
	if ($route.path == '/home') {
		mitter.emit('getHomeList', title.value);
	} else {
		$router.push({
			path: '/home',
			query: { title: title.value }
		});
	}
	// title.value = '';
}

// 登录与注册

function login() {
	$router.push('/login');
}
function register() {
	$router.push('/register');
}

function goHome() {
	$router.push('/home');
}

// 个人中你
function command(com) {
	if (com == 1) {
		$router.push('/userInfo');
	} else {
		userStore.delUserInfo();
		$router.push('/home');
	}
}

const num = ref(0);
const scroll = () => {
	let top = document.documentElement.scrollTop || document.body.scrollTop;
	num.value = top;
};
</script>

<style lang="scss" scoped></style>
