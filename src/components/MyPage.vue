<template>
	<ul v-if="total" class="flex items-center justify-center mt-8 space-x-2 cursor-pointer mx-auto w-full">
		<li
			:class="pageNum == 1 ? ' cursor-not-allowed' : ''"
			class="border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md flex items-center justify-center w-9 h-9 dark:hover:bg-slate-600 hover:bg-slate-200"
			@click="pageChangePrev"
		>
			<
		</li>
		<li
			:class="p == pageNum ? 'bg-green-600 text-white dark:border-slate-700 ' : ''"
			class="border dark:border-slate-800 dark:text-white hover:bg-green-700 rounded-md flex items-center justify-center w-9 h-9"
			v-for="p in pages"
			:key="p"
			@click="pageChangePage(p)"
		>
			{{ p }}
		</li>
		<li
			:class="pageNum == x ? ' cursor-not-allowed' : ''"
			class="border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md flex items-center justify-center w-9 h-9 dark:hover:bg-slate-600 hover:bg-slate-200"
			@click="pageChangeNext"
		>
			>
		</li>
	</ul>
	<div v-else class="text-center py-32">暂无数据</div>
</template>

<script setup>
const props = defineProps(['total', 'pageNum', 'pageSize']);
const emits = defineEmits(['changePage', 'changeNext', 'changePrev']);

// 结构赋值，保留响应式
let { total: t, pageNum: m, pageSize: s } = toRefs(props);

// 最大页码数
const x = computed(() => Math.ceil(t.value / s.value));

const pages = computed(() => {
	// 小于6页码，就不用...了
	if (x.value <= 6) return x.value;

	if (m.value <= 3) {
		// 如果当前页面小于=3，则显示下面的，下面的数组要大于3，否则你没法点击
		return [1, 2, 3, 4, '...', x.value];
	} else if (m.value > x.value - 3) {
		return [1, '...', x.value - 3, x.value - 2, x.value - 1, x.value];
	} else {
		return [1, '...', m.value - 1, m.value, m.value + 1, '...', x.value];
	}
});

// 下一页
const pageChangeNext = () => {
	if (m.value == x.value) return;
	emits('changeNext');
};
// 上一页
const pageChangePrev = () => {
	if (m.value == 1) return;
	emits('changePrev');
};

// 点击分页
const pageChangePage = (p) => {
	if (p === '...') return;
	emits('changePage', p);
};
</script>

<style lang="scss" scoped></style>
