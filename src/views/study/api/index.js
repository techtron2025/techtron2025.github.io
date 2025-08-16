import _http from '@/utils/http';

export default {
	listByClassifyId(params, loading, headers) {
		return _http('post', { url: '/api/client/article/listByTypeId', apiName: '获取博文分类列表' }, params, loading, headers);
	},
      settingList(params, loading, headers) {
		return _http('post', { url: '/api/client/setting/settingList', apiName: '设置图片' }, params, loading, headers);
	}
};
