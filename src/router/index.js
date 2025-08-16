import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/home'
		},
		{
			path: '/login',
			name: '登录',
			component: () => import('@/views/login/index.vue'),
			meta: {
				title: '登录'
			}
		},
		{
			path: '/register',
			name: '注册',
			component: () => import('@/views/register/index.vue'),
			meta: {
				title: '注册'
			}
		},
		{
			path: '/forget',
			name: '忘记密码',
			component: () => import('@/views/forget/index.vue'),
			meta: {
				title: '忘记密码'
			}
		},

		{
			path: '/layout',
			name: 'layout',
			component: () => import('@/views/layout/index.vue'),
			children: [
				{
					path: '/home',
					name: '首页',
					meta: {
						title: '春风不语，既随本心。'
					},
					component: () => import('@/views/home/index.vue')
				},
				{
					path: '/life',
					name: '生活',
					component: () => import('@/views/life/index.vue'),
					meta: {
						title: '我的生活'
					}
				},
				{
					path: '/album',
					name: '相册',
					component: () => import('@/views/album/index.vue'),
					meta: {
						title: '我的相册'
					}
				},
				{
					path: '/album-detail',
					name: '相册详情',
					component: () => import('@/views/album/detail.vue'),
					meta: {
						title: '相册详情'
					}
				},
				{
					path: '/study/:id',
					name: '学习',
					component: () => import('@/views/study/index.vue'),
					meta: {
						title: '学习-分类'
					}
				},
				{
					path: '/project/:id',
					name: '项目',
					component: () => import('@/views/project/index.vue'),
					meta: {
						title: '项目'
					}
				},
				{
					path: '/detail',
					name: '详情',
					component: () => import('@/views/detail/index.vue'),
					meta: {
						title: '详情'
					}
				},
				{
					path: '/hole',
					name: '树洞',
					component: () => import('@/views/hole/index.vue'),
					meta: {
						title: '树洞-说点什么'
					}
				},
				{
					path: '/about',
					name: '关于',
					component: () => import('@/views/about/index.vue'),
					meta: {
						title: '关于博主'
					}
				},
				{
					path: '/userInfo',
					name: '个人中心',
					component: () => import('@/views/userInfo/index.vue'),
					meta: {
						title: '个人中心'
					}
				}
			]
		}
	],
	scrollBehavior(to, from, savedPosition) {
		// 滚动到顶部
		return { top: 0 };
	}
});

router.beforeEach((to, from, next) => {
	document.title = to.meta.title;
	// 当点击侧边栏的“学习”时，让他不跳转
	if (to.path == '/study/0') return;
	next();
});

export default router;
