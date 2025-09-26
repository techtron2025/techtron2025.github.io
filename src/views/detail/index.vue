<template>
	<banner url="../../assets/imgs/colorful_8.jpg">
		<div class="baner-text">
			<h2 class="px-5 text-base sm:text-xl md:text-2xl lg:text-3xl py-1 line-clamp-1" @click="back">{{ info.title }}</h2>
			<div class="flex flex-wrap mt-3 md:justify-between text-xs px-7 gap-1">
				<div class="flex items-center space-x-1">
					<svg-icon class="rounded-full p-1 text-white bg-orange-500 w-4 h-4" name="time"></svg-icon>
					<span>更新时间：</span>
					<span>{{ info.updateTime }}</span>
				</div>
				<!-- <div class="flex items-center space-x-1">
					<svg-icon class="rounded-full p-1 text-white bg-blue-500 w-4 h-4" name="eyes"></svg-icon>
					<span>浏览量：</span>
					<span>{{ info.visitors || 0 }}</span>
				</div>
				<div class="flex items-center space-x-1">
					<svg-icon class="rounded-full p-1 bg-green-500 w-4 h-4 text-red-600" name="like"></svg-icon>
					<span>点赞数：</span>
					<span>{{ info.likes || 0 }}</span>
				</div> -->
			</div>
		</div>
	</banner>
	<div class="small-main">
		<v-md-editor class="dark" @copy-code-success="onCopyCode" v-model="info.content" mode="preview" @image-click="previewImgs"></v-md-editor>
	</div>
	<!-- <div class="small-main">
		<comment :acticleId="acticleId" :list="commentList" @answer="answer" :total="total" />
	</div> -->

	<el-image @mousewheel="mousewheel" ref="imgViewRef" :max-scale="1.5" :min-scale="0.5" style="width: 0" :src="srcList[0]" :preview-src-list="srcList" :initial-index="0" fit="cover" />
</template>

<script setup>
import { errorDeal, successDeal } from '@/utils/utils';
import api from './api';
// markdown 黑暗模式修改
import { useMarkdown } from '@/hooks/markdown';
useMarkdown();
const $route = useRoute();
const acticleId = ref('');

onMounted(() => {
	document.documentElement.scrollTop = 0;
	acticleId.value = $route.query.id;
	
	getDetail();
	// getCommentList();
});

const info = ref({});
function getDetail(id) {
	api.detail({ id: acticleId.value }).then((res) => {
		info.value = res.data;
	});
}

// 获取评论列表
const commentList = ref([]);
const total = ref(0);
function getCommentList() {
	api.commentList({ id: acticleId.value }).then((res) => {
		commentList.value = res.data.list;
		total.value = res.data.total;
	});
}

const imgViewRef = ref(null);
const srcList = ref([]);
function previewImgs(val) {
	srcList.value = val;
	setTimeout(() => {
		imgViewRef.value.$el.children[0].click();
	}, 30);
}

function mousewheel(e) {
	e.preventDefault();
}

// 发布评论
function answer(data) {
	api.addComment(data).then((res) => {
		getCommentList();
		successDeal('已评论');
	});
}

const onCopyCode = (code)=>{
	successDeal('复制成功')
	
}

const $router = useRouter();
function back() {
	$router.go(-1);
}
</script>
