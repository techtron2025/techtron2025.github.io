<template>
	<div class="relative w-screen h-screen bg-gray-700">
		<div class="flex rounded-md bg-white w-[90%] md:w-[700px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<div class="flex-1 py-10 px-3">
				<h3 class="text-black text-center text-xl">用户注册</h3>

				<el-form ref="formRef" :model="form" :rules="rules" size="large" class="mt-5 el-form-box" @submit.prevent="register">
					<el-form-item prop="email">
						<el-input v-model="form.email" placeholder="请输入您的邮箱" />
					</el-form-item>
					<el-form-item prop="nickname">
						<el-input v-model="form.nickname" placeholder="请输入您的昵称" />
					</el-form-item>
					<el-form-item prop="userPassword">
						<el-input v-model="form.userPassword" placeholder="请输入密码" type="userPassword" show-password maxlength="12" />
					</el-form-item>
					<el-form-item prop="restPassword">
						<el-input v-model="form.restPassword" placeholder="请再次输入密码" type="userPassword" show-password maxlength="12" />
					</el-form-item>
					<el-form-item prop="code">
						<el-input v-model="form.code" placeholder="请输入邮箱验证码">
							<template #append>
								<button class="w-[120px] h-[40px] btn-purple" v-if="!off.isSend" @click="getEmailCode">获取验证码</button>
								<button disabled class="w-[120px] h-[40px] btn-purple-disabled" v-else>{{ time }} 秒</button>
							</template>
						</el-input>
					</el-form-item>
					<button type="submit" class="btn-green w-full h-10">注 册</button>
				</el-form>

				<div class="text-center link-box mt-5 space-x-2">
					<router-link to="/login">用户登录</router-link>
					<router-link to="/register" class="f-ml-10">用户注册</router-link>
					<router-link to="/forget" class="f-ml-10">找回密码</router-link>
					<router-link to="/home" class="f-ml-10">网站首页</router-link>
				</div>
			</div>
			<div class="right rounded-r-md flex-1 hidden md:block"></div>
		</div>
	</div>
</template>

<script setup>
import { successDeal } from '@/utils/utils';
import hexMD5 from '@/utils/md5.min.js';
import api from './api';
import config from '@/config';

const $router = useRouter();

const formRef = ref(null);
const form = reactive({
	email: '',
	nickname: '',
	userPassword: '',
	restPassword: '',
	code: '',
	captchaKey: ''
});

const off = reactive({
	isSend: false
});

// 获取验证码

function getEmailCode(e) {
	e.preventDefault();
	formRef.value.validateField('email').then((valid) => {
		if (valid) {
			api.getEmailCode({ email: form.email, scene: 1 }).then((res) => {
				form.captchaKey = res.data;
				successDeal('验证码发送成功');
				timer();
			});
		}
	});
}

// 定时器
let time = ref(120);
const timer = () => {
	off.isSend = true;
	let timer = setInterval(() => {
		time.value--;
		if (time.value < 0) {
			off.isSend = false;
			time.value = 120;
			clearInterval(timer);
		}
	}, 1000);
};

const register = () => {
	formRef.value &&
		formRef.value.validate((valid, fields) => {
			if (valid) {
				let json = {
					email: form.email,
					nickname: form.nickname,
					password: form.userPassword,
					code: form.code,
					captchaKey: form.captchaKey
				};
				api.register(json).then((res) => {
					successDeal('注册成功');
					$router.push('/login');
				});
			}
		});
};

const validatePass = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请再次输入密码'));
	} else {
		if (value != form.userPassword) {
			callback(new Error('两次密码不一致'));
		}
		callback();
	}
};

const rules = reactive({
	email: [
		{ required: true, message: '请输入您的邮箱', trigger: 'blur' },
		{
			pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
			message: '邮箱格式错误',
			trigger: 'blur'
		}
	],

	userPassword: [
		{ required: true, message: '请输入登录密码', trigger: 'blur' },
		{ min: 6, max: 12, message: '请输入6-12位密码', trigger: 'blur' }
	],
	restPassword: [{ validator: validatePass, trigger: 'blur' }],
	// code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
	nickname: [{ required: true, message: '请输入您的昵称', trigger: 'blur' }]
});
</script>

<style lang="scss" scoped>
.right {
	background: url('../../assets/imgs/register.jpg') no-repeat;
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
