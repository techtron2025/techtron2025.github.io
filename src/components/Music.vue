<template>
	<div class="container mx-auto">
		<div class="top dy">
			<!-- 左侧开关 -->
			<div class="top-left">
				<div class="mask dy dy-jc-c dy-ai-c" @click="begin">
					<svg-icon name="play" class="play" v-if="off.isPlay" size="35" color="grey"></svg-icon>
					<svg-icon name="stop" class="stop" v-else size="35" color="grey"></svg-icon>
				</div>
			</div>
			<!-- 右侧控制区 -->
			<div class="top-right flex-1 dy dy-c dy-jc-b">
				<div class="title">{{ musicList[form.currentIndex - 1].name }}</div>
				<div class="content f-center">{{ musicList[form.currentIndex - 1].name }}</div>
				<div class="control dy dy-ai-c dy-jc-b">
					<!-- 进度 -->
					<div class="flex-1">
						<el-slider size="small" :min="0" :step="0.01" :max="100" :show-tooltip="false" v-model="form.timeProgress" @change="changeProgress" />
					</div>
					<!-- 时间 -->
					<div class="time f-ml-10" style="width: 100px">{{ form.currentTimeTitle }}/{{ form.durationTimeTitle }}</div>
					<div class="dy dy-jc-a dy-ai-c" style="width: 100px">
						<!-- 喇叭 -->
						<div class="volume">
							<svg-icon name="volume" v-if="form.volume" size="16" color="grey"></svg-icon>
							<svg-icon name="noVolume" v-if="!form.volume" size="16" color="grey"></svg-icon>
							<div class="volume-change">
								<el-slider size="small" :step="0.1" :min="0" :max="1" vertical height="50px" :show-tooltip="false" v-model="form.volume" @change="volumeChange" />
							</div>
						</div>
						<!-- 随机 -->
						<div class="random">
							<svg-icon name="random" v-if="off.isRandom" size="16" color="grey" @click="off.isRandom = !off.isRandom"></svg-icon>
							<svg-icon name="noRandom" v-else size="16" color="grey" @click="off.isRandom = !off.isRandom"></svg-icon>
						</div>
						<!-- 循环 -->
						<div class="loop">
							<svg-icon name="loop" v-if="off.isLoop" size="16" color="grey" @click="off.isLoop = !off.isLoop"></svg-icon>
							<svg-icon name="onlyLoop" v-else size="16" color="grey" @click="off.isLoop = !off.isLoop"></svg-icon>
						</div>
						<!-- 折叠 -->
						<div>
							<el-icon v-if="off.isFold" size="16" @click="off.isFold = !off.isFold">
								<Expand />
							</el-icon>
							<el-icon v-else size="16" @click="off.isFold = !off.isFold">
								<Fold />
							</el-icon>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="music-bottom" :style="{ height: off.isFold ? 0 : '158px' }">
			<div class="music-bottom-item" :class="item.id == form.currentIndex ? 'active' : ''" v-for="item in musicList" :key="item.id" @click="changeMusic(item.id)">
				<div>
					<span>{{ item.id }}</span>
					<span class="f-ml-10">{{ item.name }}</span>
				</div>
				<span>{{ item.author }}</span>
			</div>
		</div>
	</div>
	<audio ref="audio" :src="musicList[form.currentIndex - 1].url" v-show="false"></audio>
</template>

<script setup>
import { secondsFormat } from '@/utils/utils';
import musicList from './music';

// 开关
const off = reactive({
	isPlay: false, //是否播放
	isRandom: true, //随机
	isLoop: true, //循环
	isFold: false //折叠
});

let timer = null;

//数据
const form = reactive({
	currentIndex: 1, //当前哪一首

	currentTime: 0, //当前时间(秒)
	durationTime: 0, //所有时间(秒)
	timeProgress: 0, // 播放时间进度条
	currentTimeTitle: '00:00',
	durationTimeTitle: '00:00',

	volume: 0 //当前音量
});

// 开始
const audio = ref();
const begin = () => {
	off.isPlay = !off.isPlay;

	if (off.isPlay) {
		// 开始播放
		init();
	} else {
		// 暂停
		audio.value.pause();
		clearInterval(timer);
	}
};

// 初始化
const init = () => {
	audio.value.play();
	// 总时长(00:00)
	form.durationTimeTitle = secondsFormat(audio.value.duration);
	form.durationTime = audio.value.duration;
	clearInterval(timer);
	// 当前播放时间
	timer = setInterval(() => {
		let currentTime = audio.value.currentTime;
		form.currentTimeTitle = secondsFormat(currentTime);
		form.timeProgress = (currentTime / form.durationTime) * 100;
		//  当前歌曲播放完了
		if (currentTime === form.durationTime) {
			// 如果不循环(就关闭音乐)
			clearInterval(timer);
			if (!off.isLoop) {
				clearAudio();
			} else {
				//循环播放+随机播放
				if (off.isRandom) {
					let randomNum = Math.floor(Math.random() * 5) + 1;
					// 这里有个问题，同一首歌循环时， 走changeMusic函数，'canplaythrough'不会调用，所以直接init(),后面解决
					if (form.currentIndex === randomNum) {
						init();
					} else {
						changeMusic(randomNum);
					}
				} else {
					// 单曲播放
					init();
				}
			}
		}
	}, 1000);

	// 当前播放音量
	form.volume = audio.value.volume;
};

//修改音量 (0-1) 默认时1
const volumeChange = (num) => {
	audio.value.volume = num;
};

// 修改播放时长
const changeProgress = (num) => {
	// 这里赋值偶尔有效，多数无效(有些音乐无效)
	audio.value.currentTime = (num / 100) * form.durationTime;
};

//音乐切换12
const changeMusic = (id) => {
	form.currentIndex = id;
	off.isPlay = true;
	audio.value.removeEventListener('canplaythrough', init);
	audio.value.addEventListener('canplaythrough', init);
};

// 清空
const clearAudio = () => {
	audio.value.pause();
	clearInterval(timer);
	off.isPlay = false;
	form.currentTime = 0;
	form.timeProgress = 0;
	form.currentTimeTitle = '00:00';
	form.durationTime = 0;
	form.durationTimeTitle = '00:00';
};

onBeforeUnmount(() => {
	clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.music {
	border-radius: 5px;
	overflow: hidden;
	border: 1px solid #eee;
	max-width: 800px;
	margin: 100px auto;
	box-shadow: 2px 4px 20px -2px rgba(0, 0, 0, 0.1);
}

.top-left {
	position: relative;
	width: 100px;
	height: 100px;
	background: url(../assets/imgs/tab01.png) no-repeat center;
	background-size: cover;
}

.mask {
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
	cursor: pointer;
}

.control {
	font-size: 14px;
	height: 16px;
	cursor: pointer;
}

.top-right {
	padding: 5px 5px 0px 20px;
}

.volume {
	position: relative;

	&:hover {
		.volume-change {
			display: block;
		}
	}

	.volume-change {
		position: absolute;
		left: -75%;
		top: -50px;
		display: none;
	}
}

.music-bottom {
	margin-top: 5px;
	height: 158px;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.5);
	transition: all 0.3s;
	overflow: auto;

	.music-bottom-item {
		display: flex;
		justify-content: space-between;
		height: 30px;
		line-height: 30px;
		background-color: #fff;
		border-bottom: 1px solid #e9e9e9;
		padding: 0 20px;
		font-size: 12px;
		border-left: 3px solid transparent;

		&:hover {
			background-color: #e9e9e9;
			cursor: pointer;
		}
	}

	.music-bottom-item:nth-child(1) {
		border-top: 1px solid #e9e9e9;
	}

	.music-bottom-item:nth-last-child(1) {
		border-bottom: none;
	}
}

.music-bottom .active {
	border-left: 3px solid red !important;
	background-color: rgba(0, 0, 0, 0.1);
}
</style>
