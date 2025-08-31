import _http from '@/utils/http';

export default {
	login(params, loading, headers) {
		return _http('post', { url: '/user/login', apiName: '登录' }, params, loading, headers);
	},
	getCode(params, loading, headers) {
		return _http('post', { url: '/captcha', apiName: '获取验证码' }, params, loading, headers);
	}
};
