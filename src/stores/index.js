import { getStore, removeStore, setStore } from '@/utils/utils';
import { defineStore } from 'pinia';

// 用户
export const useUserStore = defineStore('user', {
	state: () => {
		return {
			userInfo: getStore('client_userInfo') || {},
			theme: 'light'
		};
	},
	actions: {
		setUserInfo(info) {
			this.userInfo = info;
			setStore('client_userInfo', info);
		},
		delUserInfo() {
			this.userInfo = {};
			removeStore('client_userInfo');
			removeStore('client_token');
		},
		setTheme(theme) {
			this.theme = theme;
			setStore('client_theme', theme);
		}
	},
	getters: {}
});
