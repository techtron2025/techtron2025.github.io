import _http from '@/utils/http';

export default {
	getBloger(params, loading, headers) {
		return _http('post', { url: '/api/client/user/getBloger', apiName: '博主信息' }, params, loading, headers);
	},
	msg(params, loading, headers) {
		return _http('post', { url: '/api/client/message/messageDdd', apiName: '留言' }, params, loading, headers);
	},
      settingList(params, loading, headers) {
		return _http('post', { url: '/api/client/setting/settingList', apiName: '设置图片' }, params, loading, headers);
	}
};
