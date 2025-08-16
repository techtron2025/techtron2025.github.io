<template>
	<div>
		<banner :url="list[0].fullUrl" v-if="list.length">
			<div class="text-shadow p-2 cursor-pointer text-base md:text-xl lg:text-2xl xl:text-3xl text-white text-center font-bold tracking-widest" @click="goBack">“{{ form.name }}”</div>
		</banner>
		<div class="h-[400px]" v-else></div>
		<div class="small-main">
			<div v-lazy="'img'" v-if="list.length" class="columns-2 gap-3 sm:columns-3 sm:gap-5">
				<img
					class="mb-3 border-none min-h-28 sm:mb-5 w-full cursor-pointer rounded-md hover:scale-[1.05] duration-300"
					@click="openShowViewer(i)"
					v-for="(p, i) in list"
					:key="i"
					:data-url="p.fullUrl"
				/>
			</div>
		</div>

		<!-- 预览组件 -->
		<el-image-viewer v-if="showViewer" :url-list="srcList" :initial-index="initialIndex" @close="closeImageViewer" />
	</div>
</template>

<script setup>
import api from './api';
const $route = useRoute();
const $router = useRouter();
const showViewer = ref(false);
const initialIndex = ref(0);
const list = ref([]);
const srcList = ref([]);
const form = reactive({
	id: '',
	name: ''
});

onMounted(() => {
	Object.assign(form, $route.query);
	getList();
});

const getList = () => {
	api.albumListById({ id: form.id }).then((res) => {
		list.value = res.data;
		srcList.value = list.value.map((item) => item.fullUrl);
	});
};

const goBack = () => {
	$router.go(-1);
};
const openShowViewer = (id) => {
	initialIndex.value = id;
	showViewer.value = true;
};
const closeImageViewer = () => {
	showViewer.value = false;
};
</script>

<style lang="scss" scoped></style>
