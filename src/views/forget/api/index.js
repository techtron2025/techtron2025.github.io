import _http from '@/utils/http';

export default {
	forget(params, loading, headers) {
		return _http('post', { url: '/api/client/user/forget', apiName: '忘记密码' }, params, loading, headers);
	},
      getEmailCode(params, loading, headers) {
		return _http('post', { url: '/api/common/email/code', apiName: '获取邮箱验证码' }, params, loading, headers);
	},
	
};
