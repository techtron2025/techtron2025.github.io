<template>
	<div>
		<ul class="items-center h-16" :class="mode == 'vertical' ? 'flex' : ''">
			<li class="relative h-full group" v-for="(p, i) in list" :key="i">
				<router-link class="px-5 h-full hover:text-blue-500 flex items-center space-x-2" :to="p.path">
					<svg-icon :name="p.icon" class="w-6 h-6"></svg-icon>
					<span>{{ p.name }}</span>
				</router-link>
				<ul
					v-if="p.children && p.children.length"
					:class="mode == 'vertical' ? '-left-3 top-14' : 'left-24 top-4'"
					class="absolute z-30 w-[160px] bg-[#f9f9f9] rounded-md hidden group-hover:block overflow-hidden"
				>
					<li class="hover:bg-slate-200" v-for="(c, j) in p.children" :key="j">
						<router-link class="p-2 flex items-center space-x-2 hover:translate-x-2 transition-all" :to="c.path">
							<!-- <svg-icon :name="c.icon" size="16"></svg-icon> -->
							<span class="hover:text-blue-500 text-slate-600 font-bold pl-3">{{ c.name }}</span>
						</router-link>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<script setup>
const props = defineProps(['list', 'mode']);
</script>

<style lang="scss" scoped></style>
