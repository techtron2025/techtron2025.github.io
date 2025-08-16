import { useUserStore } from '@/stores';
const userStore = useUserStore();
export const useMarkdown = () => {
	watchEffect(async () => {
		userStore.theme;
		await nextTick();
		useMarkdownStyle();
	});
};

const useMarkdownStyle = () => {
	let markdown = document.querySelector('.vuepress-markdown-body');
	if (userStore.theme == 'dark') {
		markdown && (markdown.style.backgroundColor = 'rgb(51,65,85)');
		markdown && (markdown.style.color = '#f1f5f9');
	} else {
		markdown && (markdown.style.backgroundColor = '#f1f5f9');
		markdown && (markdown.style.color = '#000');
	}
};
