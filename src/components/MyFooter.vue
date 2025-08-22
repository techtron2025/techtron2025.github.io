<template>
	<div class="border-t dark:border-t-slate-500 text-black dark:text-white mt-5">
		<div class="xl:w-[1200px] lg:w-[960px] mx-auto  flex justify-between leading-9 py-4 px-4">
			<!-- <ul>
				<li>
					<a href="https://www.cnblogs.com" target="_blank">博客园</a>
				</li>
				<li>
					<a href="https://www.zhihu.com" target="_blank">知乎</a>
				</li>
				<li>
					<a href="https://juejin.cn" target="_blank">掘金</a>
				</li>
			</ul>
			<ul>
				<li>
					<a href="https://www.proginn.com" target="_blank">程序员客栈</a>
				</li>
				<li>
					<a href="https://pixabay.com" target="_blank">免费图片</a>
				</li>
				<li>
					<a href="https://tool.aiapaas.com/" target="_blank">工具箱</a>
				</li>
			</ul>
			<ul>
				<li>
          <router-link to="/about">个人主页</router-link>
				</li>
				<li>
					<a href="https://techtron2025.github.io/blog-admin" target="_blank">后台管理系统</a>
				</li>
			</ul> -->
		</div>
	</div>
</template>

<script setup></script>

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
