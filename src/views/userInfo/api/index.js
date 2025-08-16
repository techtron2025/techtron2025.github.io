import _http from '@/utils/http';

export default {
	login(params, loading, headers) {
		return _http('post', { url: '/api/client/user/login', apiName: '登录' }, params, loading, headers);
	},
	getCode(params, loading, headers) {
		return _http('post', { url: '/api/client/user/getCode', apiName: '获取验证码' }, params, loading, headers);
	},
	del(params, loading, headers) {
		return _http('post', { url: '/api/client/user/del', apiName: '注销用户' }, params, loading, headers);
	},
	del(params, loading, headers) {
		return _http('post', { url: '/api/client/user/del', apiName: '注销用户' }, params, loading, headers);
	},
	update(params, loading, headers) {
		return _http('post', { url: '/api/client/user/update', apiName: '更新用户' }, params, loading, headers);
	},
	userInfo(params, loading, headers) {
		return _http('post', { url: '/api/client/user/userInfo', apiName: '用户信息' }, params, loading, headers);
	},
	settingList(params, loading, headers) {
		return _http('post', { url: '/api/client/setting/settingList', apiName: '设置图片' }, params, loading, headers);
	},
	upload(params, loading, headers) {
		return _http('post', { url: '/api/common/upload/single', apiName: '上传图片' }, params, loading, headers);
	}
};
