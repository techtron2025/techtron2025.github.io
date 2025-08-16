<template>
	<div>
		<!-- banner -->
		<section v-lazy="'bg'" :data-url="url" class="w-full h-[350px] lg:h-[400px] xl:h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-center">
			<div class="h-10">
				<slot></slot>
			</div>
		</section>
		<!-- 水浪 -->
		<div class="h-[1px]">
			<svg class="wave h-10 md:h-20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
				<defs><path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path></defs>
				<g class="parallax">
					<use xlink:href="#gentle-wave" x="48" y="0" class="fill-[rgba(241,245,249,0.7)] dark:fill-[rgba(51,65,85,0.7)]"></use>
					<use xlink:href="#gentle-wave" x="48" y="3" class="fill-[rgba(241,245,249,0.5)] dark:fill-[rgba(51,65,85,0.5)]"></use>
					<use xlink:href="#gentle-wave" x="48" y="5" class="fill-[rgba(241,245,249,0.3)] dark:fill-[rgba(51,65,85,0.3)]"></use>
					<use xlink:href="#gentle-wave" x="48" y="7" class="fill-[rgba(241,245,249)] dark:fill-[rgba(51,65,85)]"></use>
				</g>
			</svg>
		</div>
	</div>
</template>

<script setup>
defineProps(['url']);
</script>

<style lang="scss" scoped>
.wave {
	position: relative;
	width: 100%;
	margin-bottom: -7px;
	transform: translateY(-100%);
	z-index: 2;
}

.parallax > use {
	animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
	transition: all 0.3s;
}
.parallax > use:first-child {
	animation-delay: -2s;
	animation-duration: 7s;
}

.parallax > use:nth-child(2) {
	animation-delay: -3s;
	animation-duration: 10s;
}

.parallax > use:nth-child(3) {
	animation-delay: -4s;
	animation-duration: 13s;
}

.parallax > use:nth-child(4) {
	animation-delay: -5s;
	animation-duration: 20s;
}

@keyframes move-forever {
	0% {
		transform: translate3d(-90px, 0, 0);
	}

	100% {
		transform: translate3d(85px, 0, 0);
	}
}
</style>
