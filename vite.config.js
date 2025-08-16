import { fileURLToPath, URL } from 'node:url';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import AutoImport from 'unplugin-auto-import/vite'; // 自动导入
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import compression from 'vite-plugin-compression';
import prismjs from 'vite-plugin-prismjs';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ command, mode }) => {
	// 获取自定义环境变量
	const env = loadEnv(mode, process.cwd());
	console.log(env);

	return {
		plugins: [
			vue(),
			AutoImport({
				resolvers: [ElementPlusResolver()],
				include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
				imports: ['vue', 'vue-router'], // 自动导入
				//这个一定要配置，会多出一个auto-import.d.ts文件，
				dts: 'src/auto-import.d.ts'
			}),
			Components({
				resolvers: [ElementPlusResolver()]
			}),
			createSvgIconsPlugin({
				// 指定需要缓存的图标文件夹
				iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
				// 指定symbolId格式
				symbolId: 'icon-[dir]-[name]'
			}),
			prismjs({
				languages: ['json', 'css', 'javascript', 'bash', 'docker', 'http']
			}),
			compression({
				verbose: true, // 输出压缩日志
				disable: false, // 是否禁用压缩
				threshold: 10240, // 对超过10KB的文件进行压缩
				algorithm: 'gzip', // 使用gzip压缩
				ext: '.gz' // 压缩后文件的扩展名
			})
		],
		resolve: {
			extensions: ['.js', '.json', '.vue'],
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					silenceDeprecations: ['legacy-js-api']
				}
			}
		},
		// scss全局变量配置 全局变量配置在/variable.scss
		server: {
			open: true,
			host: '0.0.0.0',
			proxy: {
				'/api': {
					target: env.VITE_URL,
					configure: (proxy, options) => {
						// 配置此项可在响应头中看到请求的真实地址
						proxy.on('proxyRes', (proxyRes, req) => {
							proxyRes.headers['x-real-url'] = new URL(req.url || '', options.target)?.href || '';
						});
					}
				},
				'/neal/': {
					target: 'ws://localhost:3000/',
					changeOrigin: true,
					ws: true
				},
				'/uploads': env.VITE_URL
			}
		}
	};
});
