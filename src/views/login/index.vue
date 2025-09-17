<template>
	<div class="relative w-screen h-screen bg-gray-700">
		<div class="flex rounded-md bg-white w-[90%] md:w-[700px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<div class="flex-1 py-10 px-3">
				<h3 class="text-black text-center text-xl">用户登录</h3>

				<el-form ref="formRef" :model="form" :rules="rules" size="large" class="mt-5 el-form-box" @submit.prevent="getCode">
					<el-form-item prop="userAccount">
						<el-input v-model="form.userAccount" placeholder="请输入您的邮箱" />
					</el-form-item>
					<el-form-item prop="userPassword">
						<el-input v-model="form.userPassword" placeholder="请输入密码" type="userPassword" show-password maxlength="12" />
					</el-form-item>
					<button type="submit" class="btn-green w-full h-10">登 录</button>
				</el-form>

				<div class="text-center link-box mt-5 space-x-2">
					<router-link to="/login">用户登录</router-link>
					<router-link to="/register">用户注册</router-link>
					<router-link to="/forget">找回密码</router-link>
					<router-link to="/home">网站首页</router-link>
				</div>
			</div>
			<div class="right rounded-r-md flex-1 hidden md:block"></div>
		</div>
		<Verify
			ref="verify"
			:captchaType="captchaType"
			:imgSize="{ width: '400px', height: '200px' }"
			mode="pop"
			@success="login"
		/>
	</div>
</template>

<script setup>
import { successDeal } from '@/utils/utils';
import hexMD5 from '@/utils/md5.min.js';
import config from '@/config';
import { useUserStore } from '@/stores';
import Verify from '@/components/Verifition/Verify.vue';
const userStore = useUserStore();

import api from './api';

const $router = useRouter();

const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字 pictureWord 文字验证码

const formRef = ref(null);
const form = reactive({
	userAccount: '',
	userPassword: '',
	code: '',
	captchaKey: ''
});


function getCode() {
	verify.value.show()
}

const login = () => {
	formRef.value &&
		formRef.value.validate((valid, fields) => {
			if (valid) {
				let json = JSON.parse(JSON.stringify(form));
				api.login(json)
					.then((res) => {
						userStore.setUserInfo(res.data);
						$router.push('/home');
						successDeal('登录成功');
					})
					.catch((err) => {
						getCode();
					});
			}
		});
};

const rules = reactive({
	userAccount: [{ required: true, message: '请输入您的邮箱', trigger: 'blur' }],
	userPassword: [
		{ required: true, message: '请输入登录密码', trigger: 'blur' },
		{ min: 6, max: 12, message: '请输入6-12位密码', trigger: 'blur' }
	],
	code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});
</script>

<style lang="scss" scoped>
.right {
	background: url('../../assets/imgs/login.jpg') no-repeat;
	background-position: center;
	background-size: cover;
}

.link-box a {
	color: gray;
}
.link-box a:hover {
	color: rgb(109 40 217);
}
.link-box .router-link-active {
	color: rgb(109 40 217);
}
</style>

<style>
.el-form-box .el-form-item {
	margin-bottom: 23px !important;
}

.el-form-box .el-input-group__append {
	padding: 0;
}
</style>
