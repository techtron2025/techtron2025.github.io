import _http from '@/utils/http';

export default {
	register(params, loading, headers) {
		return _http('post', { url: '/app-api/member/user/register', apiName: '注册' }, params, loading, headers);
	},
	getCode(params, loading, headers) {
		return _http('post', { url: '/api/client/user/getCode', apiName: '获取验证码' }, params, loading, headers);
	},
	getEmailCode(params, loading, headers) {
		return _http('post', { url: '/app-api/member/auth/send-email-code', apiName: '获取邮箱验证码' }, params, loading, headers);
	}
};
