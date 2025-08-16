import axios from 'axios';
import { errorDeal, getStore, setStore } from '@/utils/utils';
import globConfig from '@/config';

//请求拦截器
axios.interceptors.request.use(
	function (config) {
		globConfig.show.value = true;
		//获取token
		config.headers.token = getStore('client_token') || '';
		config.baseURL = import.meta.env.VITE_URL + '/api';
		return config;
	},
	function (error) {
		globConfig.show.value = false;
		return Promise.reject(error);
	}
);

//响应拦截器
axios.interceptors.response.use(
	function (response) {
		// 获取后台生成的token
		if (response.headers?.token) {
			setStore('client_token', response.headers.token);
		}

		globConfig.show.value = false;
		if (response.request?.responseType == 'blob') {
			return response;
		}

		if (response.data.code !== 0) {
			errorDeal(response.data);

			return Promise.reject(response);
		} else {
			return response.data;
		}
	},
	function (error) {
		globConfig.show.value = false;

		const status = error?.response?.status;
		let message = '';
		switch (status) {
			case 66:
				message = 'TOKEN过期';
				break;
			case 403:
				message = '无权访问';
				break;
			case 404:
				message = '请求地址错误';
				break;
			case 500:
				message = '服务器出现问题';
				break;
			default:
				message = '网络出现问题';
				break;
		}
		errorDeal(message);
		return Promise.reject(error);
	}
);

/**
 *@describe http请求
 *@method {String} 请求方式
 *@url {String} 接口地址
 *@params {Object} 对应接口参数
 **/

export default function _http(method = 'post', { url, apiName = '' }, params = {}, loading = true, headers = {}) {
	return axios({
		method: method,
		url: url,

		headers: Object.assign(
			{
				'Content-Type': 'application/json;charset=UTF-8' //这里charset=UTF-8如果加了；,express接收不到参数
			},
			headers
		),
		params: method === 'get' ? params : '' || method === 'delete' ? params : '',
		data: params instanceof FormData ? params : typeof params === 'object' ? JSON.stringify(params) : params,
		timeout: 1000 * 60,
		responseType: params.responseType == 'blob' ? 'blob' : undefined,
		withCredentials: true
	});
}
