/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'selector', //主题手动模式
	theme: {
		extend: {
			backgroundColor: {
				'06-black': 'rgba(0, 0, 0, 0.6)',
				'03-black': 'rgba(0, 0, 0, 0.3)'
			}
		}
	},
	plugins: []
};
