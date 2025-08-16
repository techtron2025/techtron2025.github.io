import _http from '@/utils/http';

export default {
	articleList(params, loading, headers) {
		return _http('post', { url: '/blog/list', apiName: '文章列表' }, params, loading, headers);
	},
	visitorAdd(params, loading, headers) {
		return _http('post', { url: '/api/client/visitor/addVisitor', apiName: '新增访客' }, params, loading, headers);
	},
	settingList(params, loading, headers) {
		return _http('post', { url: '/api/client/setting/settingList', apiName: '设置图片' }, params, loading, headers);
	},
	albumList(params, loading, headers) {
		return _http('post', { url: '/api/client/album/albumList', apiName: '相册列表' }, params, loading, headers);
	},
	albumListById(params, loading, headers) {
		return _http('post', { url: '/api/client/album/albumListById', apiName: '相册的图片列表' }, params, loading, headers);
	},
	albumPwd(params, loading, headers) {
		return _http('post', { url: '/api/client/album/albumPwd', apiName: '密码校验' }, params, loading, headers);
	}
};
