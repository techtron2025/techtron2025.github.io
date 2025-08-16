import _http from '@/utils/http';

export default {
	articleList(params, loading, headers) {
		return _http('post', { url: '/blog/list', apiName: '文章列表' }, params, loading, headers);
	},
	giveLike(params, loading, headers) {
		return _http('post', { url: '/api/client/article/giveLike', apiName: '点赞' }, params, loading, headers);
	},
      settingList(params, loading, headers) {
		return _http('post', { url: '/api/client/setting/settingList', apiName: '设置图片' }, params, loading, headers);
	}
};
