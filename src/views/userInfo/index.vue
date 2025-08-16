<template>
	<banner :url="bannerImg" v-if="bannerImg">
		<div class="baner-text">{{ bannerText }}</div>
	</banner>
	<div class="h-[400px]" v-else></div>
	<div class="small-main dark:text-white">
		<form @submit.prevent="submitHandle" class="bg-slate-50 dark:border-slate-700 dark:bg-slate-800 shadow-md rounded-md px-5 pb-10 pt-2 space-y-5 ">
			<div class="flex justify-center items-center">
				<div class="rounded-full bg-white w-[100px] h-[100px] cursor-pointer overflow-hidden shadow-md">
					<img class="w-full h-full hover:scale-125 duration-300" :src="form.avatar" alt="" />
				</div>
			</div>
			<input
				@change="uploadChange"
				type="file"
				class="m-auto block cursor-pointer text-size-zero text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200"
			/>

			<div>
				<div>用户姓名：</div>
				<input
					type="text"
					v-model="form.username"
					placeholder="请输入您的姓名"
					class="flex-1 border border-slate-300 dark:bg-slate-600 dark:text-white mt-2 h-10 w-full outline-none pl-3 rounded-sm"
				/>
			</div>

			<div>
				<div>邮箱：</div>
				<input disabled type="text" v-model="form.email" placeholder="请输入您的邮箱" class="flex-1 border border-slate-300 dark:bg-slate-600 mt-2 h-10 w-full outline-none pl-3 rounded-sm" />
			</div>

			<div>
				<div>密码：</div>
				<input
					type="password"
					v-model="form.password"
					placeholder="请输入您的密码，不传则不修改"
					class="flex-1 border border-slate-300 dark:bg-slate-600 mt-2 h-10 w-full outline-none pl-3 rounded-sm"
				/>
			</div>

			<div>
				<div>手机号码：</div>
				<input type="text" v-model="form.mobile" placeholder="请输入您的手机号码" class="flex-1 border border-slate-300 dark:bg-slate-600 mt-2 h-10 w-full outline-none pl-3 rounded-sm" />
			</div>

			<div>
				<div>性别：</div>
				<div class="flex items-center space-x-3 mt-2 text-gray-500">
					<div>
						<label for="man">男</label>
						<input type="radio" class="ml-2" id="man" value="1" name="gender" v-model="form.gender" />
					</div>
					<div>
						<label for="woman">女</label>
						<input type="radio" id="woman" class="ml-2" value="2" name="gender" v-model="form.gender" />
					</div>
				</div>
			</div>

			<div>
				<div>个人网站：</div>
				<input type="text" v-model="form.website" placeholder="例：zylwin.cn" class="flex-1 mt-2 border border-slate-300 dark:bg-slate-600 h-10 w-full outline-none pl-3 rounded-sm" />
			</div>

			<div>
				<div>微信号：</div>
				<input type="text" v-model="form.weixin" placeholder="例：zhao550001" class="flex-1 mt-2 border border-slate-300 dark:bg-slate-600 h-10 w-full outline-none pl-3 rounded-sm" />
			</div>

			<button class="btn-purple w-full h-[40px]">修 改</button>
		</form>
	</div>
</template>

<script setup>
import { errorDeal, getStore, successDeal, compress, base64ToFile } from '@/utils/utils';
import api from './api';
import { useUserStore } from '@/stores';
const userStore = useUserStore();
const $router = useRouter();
import hexMD5 from '@/utils/md5.min.js';
import config from '@/config';

onMounted(() => {
	settingList();
	getUserInfo();
});

const form = reactive({
	id: '',
	avatar: '',
	filename: '',
	username: '',
	email: '',
	gender: 1,
	mobile: '',
	website: '',
	weixin: '',
	password: ''
});

const getUserInfo = () => {
	api.userInfo().then((res) => {
		for (let key in form) {
			form[key] = res.data[key];
		}
            userStore.setUserInfo(res.data);
	});
	
};

// 上传图片
const uploadChange = (e) => {
	let file = e.target.files[0];
	const readFile = new FileReader();
	readFile.readAsDataURL(file);
	readFile.onload = async function (e) {
		let base64 = e.target.result;
		//   压缩图片
		let _base64 = await compress(base64, 300, 300);

		//   转换为file
		let _file = base64ToFile(_base64, file.name);

		//   Object url
		form.preUrl = URL.createObjectURL(_file);

		let formData = new FormData();

		formData.append('file', _file);

		api.upload(formData, true, { 'Content-Type': 'multipart/form-data' }).then((res) => {
			let { url, filename } = res.data;
			form.avatar = url;
			form.filename = filename;
		});
	};
};

// 提交

const submitHandle = () => {
	let json = JSON.parse(JSON.stringify(form));
	if (json.password) {
		if (json.password.length < 6 || json.password.length > 12) return errorDeal('密码长度不能小于6位且不能大于12位');
		json.password = hexMD5(json.password + config.pwd);
	}

	api.update(json).then((res) => {
		successDeal('修改成功');
		getUserInfo();
	});
};

const bannerText = ref('');
const bannerImg = ref('');
const settingList = () => {
	api.settingList({ id: 7 }).then((res) => {
		bannerImg.value = res.data.fullUrl;
		bannerText.value = res.data.title;
	});
};
</script>

<style lang="scss" scoped>
.text-size-zero {
	font-size: 0;
}
</style>
