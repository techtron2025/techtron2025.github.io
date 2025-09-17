import _http from '@/utils/http';

export default {
	classifyList(params, loading, headers) {
		return _http('post', { url: '/api/client/classify/list', apiName: '分类列表' }, params, loading, headers);
	},
	giveLike(params, loading, headers) {
		return _http('post', { url: '/api/client/article/giveLike', apiName: '点赞' }, params, loading, headers);
	},
	addComment(params, loading, headers) {
		return _http('post', { url: '/api/client/comment/add', apiName: '新增当前评论' }, params, loading, headers);
	},
	upload(params, loading, headers) {
		return _http('post', { url: '/api/common/upload/single', apiName: '上传图片' }, params, loading, headers);
	},
	chatUploadImg(params, loading, headers) {
		return _http('post', { url: '/api/client/chat/chatUploadImg', apiName: '上传值oss' }, params, loading, headers);
	},
	chatUserList(params, loading, headers) {
		return _http('post', { url: '/api/client/chat/chatUserList', apiName: '获取聊天用户列表' }, params, loading, headers);
	}
};

export function getCode(params, loading, headers) {
	return _http('post', { url: '/admin-api/system/captcha/get', apiName: '获取图形验证码' }, params, loading, headers);
}
export function reqCheck(params, loading, headers) {
	return _http('post', { url: '/admin-api/system/captcha/check', apiName: '验证图像验证码' }, params, loading, headers);
}
