import _http from '@/utils/http';

export default {
	musicList(params, loading, headers) {
		return _http('post', { url: '/api/client/music/list', apiName: '歌曲列表' }, params, loading, headers);
	}
};
