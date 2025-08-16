import _http from '@/utils/http';

export default {
	holeList(params, loading, headers) {
		return _http('post', { url: '/api/client/hole/holeList', apiName: '列表' }, params, loading, headers);
	},
	holeAdd(params, loading, headers) {
		return _http('post', { url: '/api/client/hole/holeAdd', apiName: '新增' }, params, loading, headers);
	},
      settingList(params, loading, headers) {
		return _http('post', { url: '/api/client/setting/settingList', apiName: '设置图片' }, params, loading, headers);
	},
};
