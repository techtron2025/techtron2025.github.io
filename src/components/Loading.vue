<template>
	<div class="mask" v-show="show">
		<div class="loading-box">
			<svg t="1735095469069" class="icon" viewBox="0 0 1146 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28412" width="45" height="45">
				<path
					d="M1101.824 565.248l-233.472 405.504c-16.384 24.576-40.96 40.96-69.632 40.96H327.68c-28.672 0-57.344-16.384-69.632-40.96L24.576 565.248c-16.384-24.576-16.384-57.344 0-81.92l233.472-405.504c16.384-24.576 40.96-40.96 69.632-40.96h466.944c28.672 0 57.344 16.384 69.632 40.96l233.472 405.504c20.48 24.576 20.48 53.248 4.096 81.92z"
					fill="#FF615A"
					p-id="28413"
				></path>
				<path d="M872.448 532.48v81.92h-348.16V266.24h81.92V532.48z" fill="#FFFFFF" p-id="28414"></path>
			</svg>
			<p class="loading-text text-white mt-2">数据加载中..</p>
		</div>
	</div>
</template>

<script setup>
import config from '../config';

const show = computed(() => {
	return config.show.value;
});
</script>

<style lang="scss" scoped>
.mask {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 9999;
}
.loading-box {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
}
.icon {
	animation: rotate 2s linear infinite;
}

@keyframes rotate {
	to {
		transform: rotate(0deg);
	}

	from {
		transform: rotate(360deg);
	}
}
</style>
