import _http from '@/utils/http';

export default {
	detail(params, loading, headers) {
		return _http('post', { url: '/api/client/article/detail', apiName: '博文详情' }, params, loading, headers);
	},
      commentList(params, loading, headers) {
		return _http('post', { url: '/api/client/comment/list', apiName: '评论列表' }, params, loading, headers);
	},
      addComment(params, loading, headers) {
		return _http('post', { url: '/api/client/comment/add', apiName: '新增当前评论' }, params, loading, headers);
	},

};
