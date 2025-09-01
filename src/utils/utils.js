import router from "@/router";
/**
 * http错误处理
 */
export const errorDeal = (error) => {
	let errorText = error;
	if (errorText.toString().indexOf('timeout') > -1) {
		errorText = '请求超时';
	} else if (error.response) {
		errorText = error.response.statusText;
	} else if (error.request) {
		errorText = error.request;
	} else if (error.message) {
		errorText = error.message;
	} else if (error.msg) {
		errorText = error.msg;
	}

	if (error.apiName) {
		errorText = `${error.apiName || ''},${errorText}`;
	} else if (error.code == 40100) {
		ElMessageBox.alert(error.message, '提示', {
			confirmButtonText: '确定',
			'show-close': false,
			callback: (action) => {
				removeStore('client_token');
				removeStore('client_userInfo');
				removeStore('client_theme');
				router.push('/login');
			}
		});
	} else {
		ElMessage({
			message: errorText,
			type: 'warning'
		});
	}
};
export const successDeal = (title) => {
	ElMessage({
		message: title,
		type: 'success'
	});
};

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = (name) => {
	if (!name) return;
	let content = window.localStorage.getItem(name);
	if (!content) return '';
	if (content.indexOf('{') >= 0 || content.indexOf('[') >= 0) {
		return JSON.parse(content);
	} else {
		return content;
	}
};

/**
 * 删除localStorage
 */
export const removeStore = (name) => {
	if (!name) return;
	window.localStorage.removeItem(name);
};
/**
 * 时间戳格式化
 */
export const getDateTime = function (timestamp) {
	let t = null;
	// 不传值，则获取当前时间
	if (timestamp === undefined) {
		t = new Date();
	} else if (timestamp) {
		t = new Date(parseInt(timestamp));
	}

	if (t) {
		var n = t.getFullYear();
		var a = t.getMonth() + 1;
		var r = t.getDate();
		var o = t.getHours();
		var i = t.getMinutes();
		var s = t.getSeconds();

		a >= 10 || (a = '0' + a), r >= 10 || (r = '0' + r), o >= 10 || (o = '0' + o), i >= 10 || (i = '0' + i), s >= 10 || (s = '0' + s);

		return [
			n, // yy 0
			a, // mm 1
			r, // dd 2
			n + '-' + a, // yy-mm 3
			a + '/' + r, // mm/dd 4
			o + ':' + i + ':' + s, // hh:mm:ss 5
			n + '-' + a + '-' + r + ' ' + o + ':' + i + ':' + s, // yy-mm-dd hh:mm::ss 6
			a + '-' + r + ' ' + o + ':' + i + ':' + s, // mm-dd hh:mm::ss 7
			n + '-' + a + '-' + r, // yy-mm-dd 8
			n + a + r, // yymmdd 9
			n + a //yymm 10
		];
	} else {
		return ['--', '--', '--', '--', '--', '--', '--', '--', '--'];
	}
};
/**
 * 日期转时间戳
 */
export const getUnixTime = (e) => {
	var t;
	if (e) {
		if (typeof e === 'string') e = e.replace(/-/g, '/').replace(/T|Z/g, ' ');
		t = new Date(e);
	} else t = new Date();
	return t.getTime();
};

/**
 * 日期转时间戳
 */
export const getTimestamp = (e) => {
	var t;
	if (e) {
		e = e.replace(/-/g, '/');
		t = new Date(e);
	} else t = new Date();
	return t.getTime().toString();
};
/**
 * 日期加上‘-’
 */
export const getJoinDate = (e) => {
	e = e.toString();
	let year = e.substring(0, 4);
	let month = e.substring(4, 6);
	let day = e.substring(6, 8);
	let date = `${year}-${month}-${day}`;
	return date;
};

/**
 * 秒数格式化
 */
export const secondsFormat = (v = 0) => {
	v = parseInt(v);
	var day, minute, second, hour;
	day = Math.floor(v / (60 * 60 * 24));
	hour = Math.floor((v % (60 * 60 * 24)) / (60 * 60));
	minute = Math.floor((v % (60 * 60)) / 60);
	second = Math.floor(v % 60);
	hour < 10 && (hour = '0' + hour);
	minute < 10 && (minute = '0' + minute);
	second < 10 && (second = '0' + second);
	return day != '00' ? day + '天' + hour + ':' + minute + ':' + second : hour != '00' ? hour + ':' + minute + ':' + second : minute != '00' ? minute + ':' + second : '00:' + second;
};
/**
 * 手机格式化
 */
export const phoneFormat = (value, isNum) => {
	if (!value) return '--';
	if (isNum) {
		value = parseInt(value).toString();
	} else value = value.toString();

	let len = value.length;
	let w = value.split('');
	w.splice(3, 0, '-');
	w.splice(8, 0, '-');
	w = w.join('');
	return w;
};
/**
 * 去抖动函数
 */
export const debounce = function (wait, action) {
	let timeout;
	return function () {
		let ctx = this;
		let args = arguments;

		if (timeout) clearTimeout(timeout);

		let callNow = !timeout;
		timeout = setTimeout(() => {
			timeout = null;
		}, wait);

		if (callNow) action.apply(ctx, args);
	};
};

// 节流
export function throttle(fn, wait) {
	let lastTime = 0; // 上次执行时间戳

	return function (...args) {
		const now = new Date().getTime(); // 当前时间戳

		if (now - lastTime >= wait) {
			fn.apply(this, args); // 执行目标函数
			lastTime = now; // 更新上次执行时间戳
		}
	};
}

/* 文件流下载 */
export const BlobDownLoad = (res, name) => {
	let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
	const link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = name;
	link.click();
	document.body.appendChild(link);
};
/* 文件地址下载 */
export const locationDownLoad = (url) => {
	if (!url) {
		errorDeal('无下载地址');
		return false;
	}
	const link = document.createElement('a');
	link.href = url;
	link.click();
	document.body.appendChild(link);
};
/**
 * 正则验证函数
 */
export const regularValid = function (type, value) {
	let valid = false;

	switch (type) {
		case 'float': // 保留后两位校验
			valid = /^[-+]?[0-9]+\.?[0-9]{0,2}$/.test(value);
			break;
		case 'int+': // 正整数
			valid = /^[1-9]+$/.test(value);
			break;
		case 'phone': // 手机号码校验
			valid = /^1[3-9]\d{9}$/.test(value);
			break;
		case 'name': // 账户名，数字+字母+下划线组合
			valid = !/\W+/.test(value);
			break;
		case 'password': // 密码校验，非法字符
			valid = !/[`~()|{}':;',\[\].<>/?~！￥……&*（）——|{}【】‘；：”“'。，、？]/.test(value);
			break;
		case 'email': // 邮箱
			valid = /^\w+@[a-z0-9]+\.[a-z]+$/.test(value);
			break;
	}
	return valid;
};

/**
 * 数字格式化
 */
export const numberFormat = function (num, pro = 100) {
	return num
		? parseFloat((parseFloat(num) / pro).toFixed(2))
				.toString()
				.replace(/\d+/, function (n) {
					return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
						return $1 + ',';
					});
				})
		: 0.0;
};

// 价格保留2位小数，每3位，分隔
export function thousands(num) {
	if (num) {
		return (parseFloat(num) / 100)
			.toFixed(2)
			.toString()
			.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	} else {
		return '0.00';
	}
}

export const getNumberDateTime = function (value) {
	if (value) {
		var secondTime = parseInt(value); // 秒
		var minuteTime = 0; // 分
		var hourTime = 0; // 小时
		if (secondTime > 60) {
			//如果秒数大于60，将秒数转换成整数
			//获取分钟，除以60取整数，得到整数分钟
			minuteTime = parseInt(secondTime / 60);
			//获取秒数，秒数取佘，得到整数秒数
			secondTime = parseInt(secondTime % 60);
			//如果分钟大于60，将分钟转换成小时
			if (minuteTime > 60 || minuteTime == 60) {
				//获取小时，获取分钟除以60，得到整数小时
				hourTime = parseInt(minuteTime / 60);
				//获取小时后取佘的分，获取分钟除以60取佘的分
				minuteTime = parseInt(minuteTime % 60);
			}
		}
		var result = '';
		if (secondTime > 0) {
			result = '' + parseInt(secondTime) + '秒';
		}
		if (minuteTime > 0) {
			result = '' + parseInt(minuteTime) + '分' + result;
		}
		if (hourTime > 0) {
			result = '' + parseInt(hourTime) + '小时' + result;
		}
		return result;
	}
};

export const bytesToSize = function (bytes) {
	if (bytes === 0) return '0 B';
	var k = 1000, // or 1024
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));

	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

export const formatChatTime = function (timestamp, type = 1) {
	if (!timestamp) return '';
	// 将传入的时间字符串转换为 Date 对象
	const messageDate = new Date(timestamp);
	// 获取当前时间
	const now = new Date();

	// 计算时间差（单位：毫秒）
	const diffTime = now - messageDate;

	// 将时间差转换为小时
	const diffHours = diffTime / (1000 * 60 * 60);

	// 如果时间差小于3小时，返回空字符串

	if (type == 1 && diffHours < 1) {
		return '';
	}

	// 获取年、月、日、时、分
	const messageYear = messageDate.getFullYear();
	const messageMonth = messageDate.getMonth() + 1; // 月份从0开始，需要加1
	const messageDateDay = messageDate.getDate();
	const messageHours = messageDate.getHours().toString().padStart(2, '0');
	const messageMinutes = messageDate.getMinutes().toString().padStart(2, '0');

	// 获取当前年份
	const nowYear = now.getFullYear();

	if (messageYear < nowYear) {
		// 去年或更早
		return `${messageYear}-${messageMonth.toString().padStart(2, '0')}-${messageDateDay.toString().padStart(2, '0')}`;
	} else if (messageDateDay === now.getDate() && messageMonth === now.getMonth() + 1) {
		// 今天
		return `${messageHours}:${messageMinutes}`;
	} else if (messageDateDay === now.getDate() - 1 && messageMonth === now.getMonth() + 1) {
		// 昨天
		return '昨天';
	} else {
		// 今年
		return `${messageMonth.toString().padStart(2, '0')}-${messageDateDay.toString().padStart(2, '0')}`;
	}
};

// 秒转化
export const timeAgo = function (seconds) {
	if (seconds < 60) {
		return '刚刚';
	} else if (seconds < 60 * 60) {
		return Math.floor(seconds / 60) + '分钟前';
	} else if (seconds < 60 * 60 * 24) {
		return Math.floor(seconds / (60 * 60)) + '小时前';
	} else {
		return Math.floor(seconds / (60 * 60 * 24)) + '天前';
	}
};

// 图片压缩
export function compress(base64, maxW = 1920, maxH = 1080, type = 'image/jpeg', ratio = 0.8) {
	let img = new Image();
	img.src = base64;
	return new Promise((reslove, reject) => {
		img.onload = function () {
			let { width, height } = getCompressWH(img.width, img.height, maxW, maxH);
			let canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			canvas.getContext('2d').drawImage(img, 0, 0, width, height);
			reslove(canvas.toDataURL(type, ratio));
			canvas.remove();
			img = null;
		};
	});
}

// 获取压缩的宽高
function getCompressWH(w, h, maxW, maxH) {
	let width = w;
	let height = h;
	if (width > height) {
		if (width > maxW) {
			height = Math.round((height * maxW) / width);
			width = maxW;
		}
	} else {
		if (height > maxH) {
			width = Math.round((width * maxH) / height);
			height = maxH;
		}
	}
	return { width, height };
}

// 将 base64 转换为 Blob
export function base64ToFile(base64Data, filename) {
	// 将base64的数据部分提取出来
	const parts = base64Data.split(';base64,');
	const contentType = parts[0].split(':')[1];
	const raw = window.atob(parts[1]);

	// 将原始数据转换为Uint8Array
	const rawLength = raw.length;
	const uInt8Array = new Uint8Array(rawLength);
	for (let i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i);
	}

	// 使用Blob和提取出的数据内容创建一个新的Blob对象
	const blob = new Blob([uInt8Array], { type: contentType });

	// 创建一个File对象
	const file = new File([blob], filename, { type: contentType });

	return file;
}
