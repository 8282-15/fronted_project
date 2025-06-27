<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		
		<!-- 用户信息区域 -->
		<view class="user-info" v-if="userInfo">
			<view class="user-card">
				<view class="user-avatar">
					<text class="avatar-text">{{userInfo.username.charAt(0).toUpperCase()}}</text>
				</view>
				<view class="user-details">
					<text class="username">{{userInfo.username}}</text>
					<text class="welcome-text">欢迎回来！</text>
				</view>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="action-buttons">
			<button class="action-btn logout-btn" @click="handleLogout">
				<text class="btn-text">退出登录</text>
			</button>
		</view>
	</view>
</template>

<script>
import { STORAGE_KEYS } from '../../config/config.js';

export default {
	data() {
		return {
			title: 'Hello',
			userInfo: null
		}
	},
	onLoad() {
		this.loadUserInfo();
	},
	methods: {
		loadUserInfo() {
			// 从本地存储获取用户信息
			const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);
			const username = uni.getStorageSync(STORAGE_KEYS.USERNAME);
			
			if (token && username) {
				this.userInfo = {
					username: username
				};
			} else {
				// 如果没有登录信息，跳转到登录页
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		},
		
		handleLogout() {
			uni.showModal({
				title: '确认退出',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除本地存储
						uni.removeStorageSync(STORAGE_KEYS.TOKEN);
						uni.removeStorageSync(STORAGE_KEYS.USERNAME);
						
						// 跳转到登录页
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				}
			});
		}
	}
}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 40rpx;
		box-sizing: border-box;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-bottom: 50rpx;
		border-radius: 20rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
	}

	.text-area {
		display: flex;
		justify-content: center;
		margin-bottom: 60rpx;
	}

	.title {
		font-size: 48rpx;
		color: #ffffff;
		font-weight: bold;
		text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
	}

	.user-info {
		width: 100%;
		max-width: 600rpx;
		margin-bottom: 40rpx;
	}

	.user-card {
		display: flex;
		align-items: center;
		padding: 40rpx;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20rpx);
		border-radius: 20rpx;
		box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
		border: 1rpx solid rgba(255, 255, 255, 0.2);
	}

	.user-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #ff6b6b, #ee5a24);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.avatar-text {
		font-size: 48rpx;
		font-weight: bold;
		color: #ffffff;
	}

	.user-details {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.username {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 10rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.welcome-text {
		font-size: 32rpx;
		color: rgba(255, 255, 255, 0.8);
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.action-buttons {
		width: 100%;
		max-width: 600rpx;
		display: flex;
		justify-content: center;
	}

	.action-btn {
		padding: 30rpx 60rpx;
		background: linear-gradient(135deg, #ff6b6b, #ee5a24);
		border-radius: 50rpx;
		border: none;
		outline: none;
		box-shadow: 0 10rpx 30rpx rgba(255, 107, 107, 0.3);
		transition: all 0.3s ease;
	}

	.action-btn:active {
		transform: translateY(2rpx);
		box-shadow: 0 5rpx 15rpx rgba(255, 107, 107, 0.3);
	}

	.btn-text {
		font-size: 36rpx;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}
</style>
