import './assets/css/base.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// markdown编辑器
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// import './assets/css/vuepress.css'
// 小图标
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
// 代码行号
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// 复制
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

import Prism from 'prismjs';

VueMarkdownEditor.use(vuepressTheme, {
	Prism
})
	.use(createEmojiPlugin())
	.use(createLineNumbertPlugin())
	.use(createCopyCodePlugin());

// 点击星星
import './utils/star';
// svg
import 'virtual:svg-icons-register';
// 自定义svg
import SvgIcon from '@/components/SvgIcon';

// 自定义指令
import myDirective from '@/directives/index';

const app = createApp(App);

// ElementPlusIcons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}

app.use(createPinia());
app.use(router);
app.use(myDirective);
app.use(VueMarkdownEditor);
app.component('SvgIcon', SvgIcon);
app.mount('#app');
