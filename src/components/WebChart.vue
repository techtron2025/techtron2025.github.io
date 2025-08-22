<template>
	<div class="fixed w-full h-full left-0 top-0 bg-06-black z-50 flex justify-center items-center text-sm" v-if="off.show">
		<div class="relative w-full h-full sm:w-[900px] sm:h-[600px] shadow-md sm:rounded-md bg-slate-50 flex overflow-hidden">
			<ul class="left w-0 sm:w-[300px] bg-slate-100 cursor-pointer border-r border-r-slate-200 overflow-y-auto">
				<div class="h-16 flex items-center px-2 space-x-2">
					<img :src="userStore.userInfo.avatar" alt="" class="w-10 h-10" />
					<input type="text" v-model="title" placeholder="搜索" class="w-full outline-none pl-2 h-8 text-black rounded-sm" />
				</div>

				<li v-for="(p, i) in newUserList" :key="i" :class="i == currentUserId ? 'bg-slate-300' : 'bg-slate-100'" class="p-4 flex justify-between hover:bg-slate-200" @click="changeChat(p, i)">
					<div class="flex items-center space-x-2">
						<img :src="p.avatar" alt="" class="w-10 h-10" />
						<div class="flex-1">
							<div>
								<span>{{ p.name }}</span>
								<span v-if="p.mode == 1" :class="p.online ? 'text-green-400' : 'text-red-400'">【{{ p.online ? '在线' : '离线' }}】</span>
							</div>
							<div class="text-gray-500 line-clamp-1 w-[160px]">{{ p.msg }}</div>
						</div>
					</div>
					<span class="text-gray-500">{{ formatChatTime(p.time, 2) }}</span>
				</li>
			</ul>

			<div class="right flex-1 flex flex-col">
				<div class="top h-16 text-lg leading-[64px] border-b border-b-slate-200 px-5 flex items-center justify-between">
					<span>{{ currentUser.name }}</span>
					<svg-icon name="closed" class="w-5 h-5 cursor-pointer" @click="closed"></svg-icon>
				</div>
				<div ref="chartRef" class="content flex-1 p-4 overflow-y-auto">
					<!-- 聊天记录 -->
					<div v-for="(p, i) in msglist" :key="i">
						<p class="text-sm text-slate-400 text-center py-2">{{ formatChatTime(p.createTime) }}</p>
						<section class="flex mb-5" :class="p.fromId != userStore.userInfo.id ? 'items-start' : 'flex-row-reverse'">
							<img :src="p.avatar" class="w-10 h-10" />
							<div v-if="p.msgType == 1" class="ml-2 max-w-[300px]" :class="p.fromId != userStore.userInfo.id ? 'ml-2 text-left' : 'mr-2 text-right'">
								<div class="text-slate-500">{{ p.name }}</div>
								<div class="bg-green-400 text-black p-2 rounded-md break-words">
									{{ p.msg }}
								</div>
							</div>
							<div v-else class="text-black rounded-md max-w-[300px] ml-2" :class="p.fromId != userStore.userInfo.id ? 'ml-2 text-left' : 'mr-2 text-right'">
								<div class="text-slate-500">{{ p.name }}</div>
								<img :src="p.msg" class="block" @load="onImageLoad" />
							</div>
						</section>
					</div>
				</div>
				<div class="bottom h-[160px] border-t border-t-slate-200 px-5 py-2 flex flex-col">
					<div class="tab flex space-x-3 cursor-pointer h-7">
						<div class="w-5 h-5">
							<V3Emoji @click-emoji="appendText" ref="emojiRef">
								<svg-icon name="face" class="w-5 h-5"></svg-icon>
							</V3Emoji>
						</div>

						<div>
							<label for="file">
								<svg-icon name="file" class="w-5 h-5"></svg-icon>
							</label>
							<input type="file" id="file" class="hidden" ref="fileInput" @change="uploadChange" />
						</div>
					</div>

					<textarea v-model="msg" class="flex-1 resize-none outline-none bg-slate-50"></textarea>
					<div class="text-right h-7">
						<button class="btn-green" @click="messageHandle(1)">发送</button>
					</div>
				</div>
			</div>

			<div v-if="upload.preUrl" class="absolute flex flex-col items-center left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[280px] bg-white rounded-md shadow-md p-5">
				<div>发送给：{{ currentUser.name }}</div>

				<img :src="upload.preUrl" alt="" class="py-4" />
				<div class="space-x-3">
					<button class="btn-purple" @click="cancleImg">取消</button>
					<button class="btn-green ml-2" @click="sendImg">发送</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { errorDeal, formatChatTime, debounce } from '@/utils/utils';

import SocketService from '@/utils/socketServer';
const io = ref(null);
const msglist = ref([]);
const chartRef = ref(null);
const emojiRef = ref(null);

const off = reactive({
	show: false
});

const msg = ref('');

// 用户模块
import { useUserStore } from '@/stores';
const userStore = useUserStore();

// 表情
import V3Emoji from 'vue3-emoji';
import 'vue3-emoji/dist/style.css';
const appendText = (val) => {
	msg.value += val;
	emojiRef.value.closePop();
};

// 图片上传
import { compress, base64ToFile } from '@/utils/utils';
import api from './api';

const upload = reactive({
	fullUrl: '',
	preUrl: '',
	filename: ''
});
const uploadChange = (e) => {
	let file = e.target.files[0];
	const readFile = new FileReader();
	readFile.readAsDataURL(file);
	readFile.onload = async function (e) {
		let base64 = e.target.result;
		//   压缩图片
		let _base64 = await compress(base64, 150, 150);

		//   转换为file
		let _file = base64ToFile(_base64, file.name);
		//   Object url
		upload.preUrl = URL.createObjectURL(_file);

		let formData = new FormData();

		formData.append('file', _file);

		api.upload(formData, true, { 'Content-Type': 'multipart/form-data' }).then((res) => {
			let { filename } = res.data;
			// 发送给soketio
			upload.filename = filename;
		});
	};
};
const cancleImg = () => {
	upload.preUrl = '';
};

const sendImg = () => {
	api.chatUploadImg(upload).then((res) => {
		upload.fullUrl = res.data.fullUrl;
		upload.preUrl = '';

		messageHandle(2);
	});
};

// 关键字过滤用户
const title = ref('');
const newUserList = computed(() => userList.value.filter((item) => item.name?.includes(title.value) || item.mode == 2));

// 切换聊天对象
const userList = ref([]);
const currentUser = ref({});
const currentUserId = ref(0);

const changeChat = (p, i) => {
	msg.value = '';
	currentUserId.value = i;
	currentUser.value = p;

	// 获取聊天记录
	let json = {
		mode: currentUser.value.mode,
		fromId: userStore.userInfo.id,
		toId: currentUser.value.id
	};

	getChatByIdList(json);
};

// 用户列表
const getChatUserList = () => {
	return new Promise((resolve, reject) => {
		api.chatUserList().then(({ data }) => {
			userList.value = data.map((item) => {
				return {
					...item,
					msg: item.msgType == 1 ? item.msg : '[图片]'
				};
			});

			currentUser.value = data[0];
			resolve(true);

			// 获取聊天记录
			let json = {
				mode: currentUser.value.mode,
				fromId: userStore.userInfo.id,
				toId: currentUser.value.id
			};
			getChatByIdList(json);
		});
	});
};

// 聊天列表
const getChatByIdList = (json) => {
	api.chatByIdList(json).then(({ data }) => {
		msglist.value = data.map((p) => {
			return { ...p, msg: decodeURIComponent(p.msg) };
		});

		scrollToBottom();
	});
};

// 关闭连接
const closed = () => {
	io.value.disconnect();
	io.value = null;
	off.show = false;
	currentUserId.value = 0;
	document.body.style.overflow = 'auto';
};

// 创建连接
const open = async () => {
	await getChatUserList();
	io.value = new SocketService(import.meta.env.VITE_SOCKET_URL);
	io.value.connect();
	io.value.emit('login', { userId: userStore.userInfo.id });

	// 接收消息(一对一)
	io.value.on('receiveSingleMsg', ({ fromId, toId, msg, msgType }) => {
		updateSingleChat(fromId, toId, decodeURIComponent(msg), msgType, userStore.userInfo.avatar, new Date().getTime(), false);
	});

	// 接收消息(群消息)
	io.value.on('receiveGrounpMsg', ({ fromId, grounpId, msg, msgType, avatar, name }) => {
		// 如果是自己发的消息，不更新
		if (fromId == userStore.userInfo.id) return;

		// 更新群聊记录
		updateGrounpChat(fromId, grounpId, decodeURIComponent(msg), msgType, avatar, name, new Date().getTime(), false);
	});

	// 实时在线人数
	io.value.on('onLineUserList', (data) => {
		userList.value.forEach((p) => {
			if (p.mode == 1 && data.includes(p.id)) {
				p.online = true;
			} else {
				p.online = false;
			}
		});
	});

	off.show = true;
	document.body.style.overflow = 'hidden';
};

// 发送消息
// msgType 1 文字 2 图片
const messageHandle = (msgType) => {
	if (msgType == 1) {
		if (msg.value == '') return errorDeal('消息不能为空');
	} else {
		if (upload.fullUrl == '') return errorDeal('图片不能为空');
	}

	let message = msgType == 1 ? msg.value : upload.fullUrl;

	if (currentUser.value.mode == 1) {
		// 一对一聊天
		io.value.emit('sendSingleMsg', {
			fromId: userStore.userInfo.id,
			toId: currentUser.value.id,
			msg: msgType == 1 ? encodeURIComponent(msg.value) : upload.fullUrl,
			msgType
		});

		// 跟新聊天列表
		updateSingleChat(userStore.userInfo.id, currentUser.value.id, message, msgType, userStore.userInfo.avatar, new Date().getTime());
	} else {
		// 群聊
		io.value.emit('sendGrounpMsg', {
			fromId: userStore.userInfo.id,
			grounpId: currentUser.value.id,
			msg: msgType == 1 ? encodeURIComponent(msg.value) : upload.fullUrl,
			msgType,
			avatar: userStore.userInfo.avatar,
			name: userStore.userInfo.username
		});

		// 更新群聊记录
		updateGrounpChat(userStore.userInfo.id, userStore.userInfo.id, message, msgType, userStore.userInfo.avatar, userStore.userInfo.username, new Date().getTime());
	}
};

// 更新 一对一 聊天记录
const updateSingleChat = (fromId, toId, msg, msgType, avatar, createTime, isSend = true) => {
	if (isSend) {
		userList.value.forEach((p) => {
			if (p.mode == 1 && p.id == toId) {
				p.msg = msgType == 1 ? msg : '[图片]';
				p.time = createTime;
			}
		});
	} else {
		userList.value.forEach((p) => {
			if (p.mode == 1 && p.id == fromId) {
				p.msg = msgType == 1 ? msg : '[图片]';
				p.time = createTime;
			}
		});
	}

	// 在接收消息的时候，接收人必须在当前聊天对象
	if (currentUser.value.mode == 2) return;
	if (!isSend && currentUser.value.mode == 1 && currentUser.value.id != fromId) return;

	msglist.value.push({
		fromId,
		toId,
		msg,
		msgType,
		avatar,
		createTime
	});

	scrollToBottom('smooth');
	clearChat();
};

// 更新 群聊 记录
const updateGrounpChat = (fromId, grounpId, msg, msgType, avatar, name, createTime, isSend = true) => {
	userList.value.forEach((p) => {
		if (p.mode == 2 && p.id == grounpId) {
			p.msg = msgType == 1 ? msg : '[图片]';
			p.time = createTime;
		}
	});

	// 在接收消息的时候，接收人必须在群聊房间

	if (!isSend && currentUser.value.mode == 1) return;
	if (!isSend && currentUser.value.mode == 2 && grounpId != currentUser.value.id) return;
	msglist.value.push({
		fromId,
		msg,
		msgType,
		avatar,
		createTime,
		name
	});

	scrollToBottom('smooth');
	clearChat();
};

// 清空聊天消息
const clearChat = () => {
	msg.value = '';
};

// 滚动到底部
const scrollToBottom = async (type = 'auto') => {
	await nextTick();

	chartRef.value?.lastElementChild && chartRef.value?.lastElementChild.scrollIntoView({ behavior: type });
};

// 监听图片是否加载完毕

defineExpose({
	open,
	closed
});
</script>

<style lang="scss" scoped></style>
