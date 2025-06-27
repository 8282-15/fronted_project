<template>
	<view class="login-container">
		<!-- 粒子背景 -->
		<canvas class="particles-canvas" canvas-id="particlesCanvas" @touchstart="onTouchStart"></canvas>
		
		<!-- 装饰性背景元素 -->
		<view class="bg-decoration">
			<view class="floating-circle circle-1"></view>
			<view class="floating-circle circle-2"></view>
			<view class="floating-circle circle-3"></view>
			<view class="floating-circle circle-4"></view>
		</view>
		
		<!-- 主要内容区域 -->
		<view class="content-wrapper">
			<!-- 标题区域 -->
			<view class="title-section">
				<text class="main-title">欢迎回来</text>
				<text class="sub-title">{{ isLogin ? '登录您的账户' : '创建新账户' }}</text>
			</view>
			
			<!-- 表单区域 -->
			<view class="form-container">
				<view class="form-group" :class="{ 'focused': focusedField === 'username' }">
					<view class="input-wrapper">
						<text class="input-icon">👤</text>
						<input 
							class="form-input" 
							type="text" 
							placeholder="用户名/邮箱" 
							v-model="formData.username"
							@focus="onFocus('username')"
							@blur="onBlur"
							@input="validateField('username')"
						/>
					</view>
					<text v-if="errors.username" class="error-text">{{ errors.username }}</text>
				</view>
				
				<view class="form-group" :class="{ 'focused': focusedField === 'password' }">
					<view class="input-wrapper">
						<text class="input-icon">🔒</text>
						<input 
							class="form-input" 
							:type="showPassword ? 'text' : 'password'" 
							placeholder="密码" 
							v-model="formData.password"
							@focus="onFocus('password')"
							@blur="onBlur"
							@input="validateField('password')"
						/>
						<text class="password-toggle" @click="togglePassword">
							{{ showPassword ? '🙈' : '👁️' }}
						</text>
					</view>
					<text v-if="errors.password" class="error-text">{{ errors.password }}</text>
				</view>
				
				<view v-if="!isLogin" class="form-group" :class="{ 'focused': focusedField === 'confirmPassword' }">
					<view class="input-wrapper">
						<text class="input-icon">🔐</text>
						<input 
							class="form-input" 
							:type="showConfirmPassword ? 'text' : 'password'" 
							placeholder="确认密码" 
							v-model="formData.confirmPassword"
							@focus="onFocus('confirmPassword')"
							@blur="onBlur"
							@input="validateField('confirmPassword')"
						/>
						<text class="password-toggle" @click="toggleConfirmPassword">
							{{ showConfirmPassword ? '🙈' : '👁️' }}
						</text>
					</view>
					<text v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</text>
				</view>
				
				<!-- 记住我选项 -->
				<view v-if="isLogin" class="remember-section">
					<view class="checkbox-wrapper" @click="toggleRemember">
						<view class="checkbox" :class="{ 'checked': rememberMe }">
							<text v-if="rememberMe" class="checkmark">✓</text>
						</view>
						<text class="remember-text">记住我</text>
					</view>
					<text class="forgot-password" @click="forgotPassword">忘记密码？</text>
				</view>
				
				<!-- 提交按钮 -->
				<button 
					class="submit-btn" 
					:class="{ 'loading': isLoading }"
					:disabled="isLoading || !isFormValid"
					@click="handleSubmit"
				>
					<text v-if="isLoading" class="loading-text">处理中...</text>
					<text v-else>{{ isLogin ? '登录' : '注册' }}</text>
				</button>
				
				<!-- 切换模式 -->
				<view class="switch-mode">
					<text class="switch-text">
						{{ isLogin ? '还没有账户？' : '已有账户？' }}
					</text>
					<text class="switch-link" @click="switchMode">
						{{ isLogin ? '立即注册' : '立即登录' }}
					</text>
				</view>
			</view>
			
			<!-- 社交登录 -->
			<view class="social-login">
				<view class="divider">
					<view class="divider-line"></view>
					<text class="divider-text">或</text>
					<view class="divider-line"></view>
				</view>
				<view class="social-buttons">
					<view class="social-btn wechat" @click="socialLogin('wechat')">
						<text class="social-icon">💬</text>
						<text class="social-text">微信</text>
					</view>
					<view class="social-btn qq" @click="socialLogin('qq')">
						<text class="social-icon">🐧</text>
						<text class="social-text">QQ</text>
					</view>
					<view class="social-btn weibo" @click="socialLogin('weibo')">
						<text class="social-icon">📱</text>
						<text class="social-text">微博</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 成功提示 -->
		<view v-if="showSuccess" class="success-toast" :class="{ 'show': showSuccess }">
			<text class="success-text">{{ successMessage }}</text>
		</view>
	</view>
</template>

<script>
import { authAPI } from '../../utils/api.js';
import { STORAGE_KEYS } from '../../config/config.js';

export default {
	data() {
		return {
			isLogin: true,
			isLoading: false,
			showPassword: false,
			showConfirmPassword: false,
			rememberMe: false,
			focusedField: '',
			showSuccess: false,
			successMessage: '',
			formData: {
				username: '',
				password: '',
				confirmPassword: ''
			},
			errors: {
				username: '',
				password: '',
				confirmPassword: ''
			},
			particles: [],
			animationId: null
		}
	},
	computed: {
		isFormValid() {
			if (this.isLogin) {
				return this.formData.username && this.formData.password && 
					   !this.errors.username && !this.errors.password;
			} else {
				return this.formData.username && this.formData.password && this.formData.confirmPassword &&
					   !this.errors.username && !this.errors.password && !this.errors.confirmPassword;
			}
		}
	},
	onLoad() {
		this.initParticles();
		this.startParticleAnimation();
	},
	onUnload() {
		if (this.animationId) {
			clearTimeout(this.animationId);
		}
	},
	methods: {
		// 粒子系统
		initParticles() {
			const systemInfo = uni.getSystemInfoSync();
			const particleCount = 50;
			for (let i = 0; i < particleCount; i++) {
				this.particles.push({
					x: Math.random() * systemInfo.windowWidth,
					y: Math.random() * systemInfo.windowHeight,
					vx: (Math.random() - 0.5) * 2,
					vy: (Math.random() - 0.5) * 2,
					size: Math.random() * 3 + 1,
					opacity: Math.random() * 0.5 + 0.3
				});
			}
		},
		
		startParticleAnimation() {
			const systemInfo = uni.getSystemInfoSync();
			const ctx = uni.createCanvasContext('particlesCanvas', this);
			
			const animate = () => {
				ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
				
				this.particles.forEach(particle => {
					// 更新位置
					particle.x += particle.vx;
					particle.y += particle.vy;
					
					// 边界检测
					if (particle.x < 0 || particle.x > systemInfo.windowWidth) {
						particle.vx *= -1;
					}
					if (particle.y < 0 || particle.y > systemInfo.windowHeight) {
						particle.vy *= -1;
					}
					
					// 绘制粒子
					ctx.setFillStyle(`rgba(255, 255, 255, ${particle.opacity})`);
					ctx.beginPath();
					ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
					ctx.fill();
				});
				
				ctx.draw();
				this.animationId = setTimeout(animate, 16); // 约60fps
			};
			animate();
		},
		
		onTouchStart(e) {
			// 触摸时添加新粒子
			const touch = e.touches[0];
			this.particles.push({
				x: touch.x,
				y: touch.y,
				vx: (Math.random() - 0.5) * 4,
				vy: (Math.random() - 0.5) * 4,
				size: Math.random() * 4 + 2,
				opacity: 0.8
			});
			
			// 限制粒子数量
			if (this.particles.length > 100) {
				this.particles.shift();
			}
		},
		
		// 表单处理
		onFocus(field) {
			this.focusedField = field;
		},
		
		onBlur() {
			this.focusedField = '';
		},
		
		togglePassword() {
			this.showPassword = !this.showPassword;
		},
		
		toggleConfirmPassword() {
			this.showConfirmPassword = !this.showConfirmPassword;
		},
		
		toggleRemember() {
			this.rememberMe = !this.rememberMe;
		},
		
		validateField(field) {
			this.errors[field] = '';
			
			switch (field) {
				case 'username':
					if (!this.formData.username) {
						this.errors.username = '请输入用户名';
					} else if (this.formData.username.length < 3) {
						this.errors.username = '用户名至少3个字符';
					}
					break;
				case 'password':
					if (!this.formData.password) {
						this.errors.password = '请输入密码';
					} else if (this.formData.password.length < 8) {
						this.errors.password = '密码至少8个字符';
					}
					break;
				case 'confirmPassword':
					if (!this.formData.confirmPassword) {
						this.errors.confirmPassword = '请确认密码';
					} else if (this.formData.password !== this.formData.confirmPassword) {
						this.errors.confirmPassword = '两次密码不一致';
					}
					break;
			}
		},
		
		async handleSubmit() {
			if (!this.isFormValid) return;
			
			this.isLoading = true;
			
			try {
				if (this.isLogin) {
					// 登录接口
					const loginResult = await authAPI.login({
						username: this.formData.username,
						password: this.formData.password
					});
					
					this.successMessage = '登录成功！';
					// 可以在这里保存token等信息
					if (loginResult && loginResult.token) {
						uni.setStorageSync(STORAGE_KEYS.TOKEN, loginResult.token);
					}
					// 保存用户名
					uni.setStorageSync(STORAGE_KEYS.USERNAME, this.formData.username);
				} else {
					// 注册接口
					await authAPI.register({
						username: this.formData.username,
						password: this.formData.password,
						confirmPassword: this.formData.confirmPassword
					});
					
					this.successMessage = '注册成功！';
				}
				
				this.showSuccess = true;
				setTimeout(() => {
					this.showSuccess = false;
					// 跳转到环境监测页面
					uni.reLaunch({
						url: '/pages/monitor/monitor'
					});
				}, 2000);
				
			} catch (error) {
				console.error('API调用错误:', error);
				
				// 解析错误信息
				let errorMessage = '操作失败，请重试';
				
				if (error.message) {
					// 根据错误信息判断具体错误类型
					const errorMsg = error.message.toLowerCase();
					
					if (errorMsg.includes('用户名不存在') || errorMsg.includes('user not found')) {
						errorMessage = '用户名不存在，请检查后重试';
					} else if (errorMsg.includes('密码错误') || errorMsg.includes('password incorrect')) {
						errorMessage = '密码错误，请重新输入';
					} else if (errorMsg.includes('用户名重复') || errorMsg.includes('username exists') || errorMsg.includes('already exists')) {
						errorMessage = '用户名已存在，请选择其他用户名';
					} else if (errorMsg.includes('网络') || errorMsg.includes('network')) {
						errorMessage = '网络连接失败，请检查网络后重试';
					} else if (errorMsg.includes('超时') || errorMsg.includes('timeout')) {
						errorMessage = '请求超时，请稍后重试';
					} else if (errorMsg.includes('服务器') || errorMsg.includes('server')) {
						errorMessage = '服务器错误，请稍后重试';
					} else {
						// 如果后端返回了具体的错误信息，直接使用
						errorMessage = error.message;
					}
				}
				
				uni.showToast({
					title: errorMessage,
					icon: 'none',
					duration: 3000
				});
			} finally {
				this.isLoading = false;
			}
		},
		
		switchMode() {
			this.isLogin = !this.isLogin;
			this.formData = {
				username: '',
				password: '',
				confirmPassword: ''
			};
			this.errors = {
				username: '',
				password: '',
				confirmPassword: ''
			};
		},
		
		forgotPassword() {
			uni.showModal({
				title: '忘记密码',
				content: '请联系客服重置密码',
				showCancel: false
			});
		},
		
		socialLogin(platform) {
			uni.showToast({
				title: `${platform}登录功能开发中`,
				icon: 'none'
			});
		}
	}
}
</script>

<style scoped>
.login-container {
	position: relative;
	width: 100vw;
	height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	overflow: hidden;
}

.particles-canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
}

.bg-decoration {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	pointer-events: none;
}

.floating-circle {
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
	animation: float 6s ease-in-out infinite;
}

.circle-1 {
	width: 200rpx;
	height: 200rpx;
	top: 10%;
	left: 10%;
	animation-delay: 0s;
}

.circle-2 {
	width: 150rpx;
	height: 150rpx;
	top: 20%;
	right: 15%;
	animation-delay: 1.5s;
}

.circle-3 {
	width: 100rpx;
	height: 100rpx;
	bottom: 30%;
	left: 20%;
	animation-delay: 3s;
}

.circle-4 {
	width: 120rpx;
	height: 120rpx;
	bottom: 20%;
	right: 10%;
	animation-delay: 4.5s;
}

@keyframes float {
	0%, 100% {
		transform: translateY(0px) rotate(0deg);
		opacity: 0.3;
	}
	50% {
		transform: translateY(-30rpx) rotate(180deg);
		opacity: 0.6;
	}
}

.content-wrapper {
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	padding: 40rpx;
	box-sizing: border-box;
}

.title-section {
	text-align: center;
	margin-bottom: 80rpx;
	animation: fadeInDown 1s ease-out;
}

.main-title {
	display: block;
	font-size: 60rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 20rpx;
	text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
}

.sub-title {
	display: block;
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.form-container {
	width: 100%;
	max-width: 600rpx;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(20rpx);
	border-radius: 30rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
	animation: fadeInUp 1s ease-out 0.3s both;
	position: relative;
	overflow: hidden;
}

.form-container::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
	animation: shimmer 3s infinite;
}

@keyframes shimmer {
	0% {
		left: -100%;
	}
	100% {
		left: 100%;
	}
}

.form-group {
	margin-bottom: 40rpx;
	transition: all 0.3s ease;
}

.form-group.focused {
	transform: translateY(-5rpx);
}

.input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 25rpx;
	padding: 0 30rpx;
	transition: all 0.3s ease;
	border: 2rpx solid transparent;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.form-group.focused .input-wrapper {
	border-color: #667eea;
	box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.3), 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	transform: scale(1.02);
	background: rgba(255, 255, 255, 0.95);
}

.input-wrapper::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 2rpx;
	background: linear-gradient(90deg, #667eea, #764ba2);
	transition: all 0.3s ease;
	transform: translateX(-50%);
}

.form-group.focused .input-wrapper::after {
	width: 80%;
}

.input-icon {
	font-size: 32rpx;
	margin-right: 20rpx;
}

.form-input {
	flex: 1;
	height: 80rpx;
	font-size: 28rpx;
	color: #333;
	background: transparent;
	border: none;
	outline: none;
}

.password-toggle {
	font-size: 32rpx;
	padding: 10rpx;
	cursor: pointer;
	transition: opacity 0.3s ease;
}

.password-toggle:hover {
	opacity: 0.7;
}

.error-text {
	color: #ff4757;
	font-size: 24rpx;
	margin-top: 10rpx;
	margin-left: 30rpx;
	animation: shake 0.5s ease-in-out;
}

.remember-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.checkbox-wrapper {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.checkbox {
	width: 32rpx;
	height: 32rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.8);
	border-radius: 6rpx;
	margin-right: 15rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.checkbox.checked {
	background: #667eea;
	border-color: #667eea;
}

.checkmark {
	color: white;
	font-size: 20rpx;
	font-weight: bold;
}

.remember-text {
	color: rgba(255, 255, 255, 0.8);
	font-size: 26rpx;
}

.forgot-password {
	color: #667eea;
	font-size: 26rpx;
	text-decoration: underline;
	cursor: pointer;
	transition: opacity 0.3s ease;
}

.forgot-password:hover {
	opacity: 0.7;
}

.submit-btn {
	width: 100%;
	height: 90rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border: none;
	border-radius: 45rpx;
	color: white;
	font-size: 32rpx;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	margin-bottom: 40rpx;
	box-shadow: 0 8rpx 16rpx rgba(102, 126, 234, 0.3);
}

.submit-btn::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
	transition: left 0.5s ease;
}

.submit-btn:not(:disabled):hover::before {
	left: 100%;
}

.submit-btn:not(:disabled):hover {
	transform: translateY(-3rpx);
	box-shadow: 0 15rpx 30rpx rgba(102, 126, 234, 0.4);
}

.submit-btn:not(:disabled):active {
	transform: translateY(-1rpx);
	box-shadow: 0 5rpx 15rpx rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	transform: none;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}

.submit-btn.loading {
	background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
}

.submit-btn.loading::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 20rpx;
	height: 20rpx;
	border: 2rpx solid transparent;
	border-top: 2rpx solid white;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	transform: translate(-50%, -50%);
}

@keyframes spin {
	0% { transform: translate(-50%, -50%) rotate(0deg); }
	100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.loading-text {
	display: flex;
	align-items: center;
	justify-content: center;
}

.switch-mode {
	text-align: center;
}

.switch-text {
	color: rgba(255, 255, 255, 0.8);
	font-size: 26rpx;
}

.switch-link {
	color: #667eea;
	font-size: 26rpx;
	font-weight: bold;
	cursor: pointer;
	margin-left: 10rpx;
	transition: opacity 0.3s ease;
}

.switch-link:hover {
	opacity: 0.7;
}

.social-login {
	margin-top: 60rpx;
	width: 100%;
	max-width: 600rpx;
}

.divider {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.divider-line {
	flex: 1;
	height: 1rpx;
	background: rgba(255, 255, 255, 0.3);
}

.divider-text {
	color: rgba(255, 255, 255, 0.6);
	font-size: 24rpx;
	margin: 0 30rpx;
}

.social-buttons {
	display: flex;
	justify-content: space-around;
	gap: 20rpx;
}

.social-btn {
	flex: 1;
	height: 80rpx;
	background: rgba(255, 255, 255, 0.1);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.social-btn::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.social-btn:hover::before {
	opacity: 1;
}

.social-btn:hover {
	background: rgba(255, 255, 255, 0.2);
	transform: translateY(-3rpx);
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
}

.social-btn.wechat:hover {
	border-color: #07c160;
	box-shadow: 0 8rpx 16rpx rgba(7, 193, 96, 0.3);
}

.social-btn.qq:hover {
	border-color: #12b7f5;
	box-shadow: 0 8rpx 16rpx rgba(18, 183, 245, 0.3);
}

.social-btn.weibo:hover {
	border-color: #e6162d;
	box-shadow: 0 8rpx 16rpx rgba(230, 22, 45, 0.3);
}

.social-btn:active {
	transform: translateY(-1rpx);
}

.social-icon {
	font-size: 24rpx;
	margin-bottom: 5rpx;
}

.social-text {
	font-size: 20rpx;
	color: rgba(255, 255, 255, 0.8);
}

.success-toast {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: rgba(46, 204, 113, 0.9);
	color: white;
	padding: 30rpx 60rpx;
	border-radius: 20rpx;
	z-index: 1000;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.success-toast.show {
	opacity: 1;
}

.success-text {
	font-size: 28rpx;
	font-weight: bold;
}

/* 动画 */
@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-50rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(50rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes shake {
	0%, 100% { transform: translateX(0); }
	25% { transform: translateX(-10rpx); }
	75% { transform: translateX(10rpx); }
}

/* 响应式设计 */
@media (max-width: 750rpx) {
	.content-wrapper {
		padding: 20rpx;
	}
	
	.form-container {
		padding: 40rpx 30rpx;
	}
	
	.main-title {
		font-size: 50rpx;
	}
	
	.social-buttons {
		flex-direction: column;
		gap: 15rpx;
	}
	
	.social-btn {
		flex-direction: row;
		height: 60rpx;
	}
	
	.social-icon {
		margin-bottom: 0;
		margin-right: 10rpx;
	}
}
</style> 