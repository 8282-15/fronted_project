<template>
	<view class="monitor-container">
		<!-- 顶部状态栏 -->
		<view class="status-bar">
			<view class="status-item">
				<text class="status-icon">🌡️</text>
				<text class="status-label">温度</text>
				<text class="status-value">{{ temperature }}°C</text>
			</view>
			<view class="status-item">
				<text class="status-icon">💧</text>
				<text class="status-label">湿度</text>
				<text class="status-value">{{ humidity }}%</text>
			</view>
			<view class="status-item">
				<text class="status-icon">🌬️</text>
				<text class="status-label">风速</text>
				<text class="status-value">{{ windSpeed }}m/s</text>
			</view>
		</view>

		<!-- 主要内容区域 -->
		<view class="content-area">
			<!-- 标题区域 -->
			<view class="header-section">
				<text class="main-title">环境监测系统</text>
				<text class="sub-title">实时数据监控</text>
				<view class="time-display">
					<text class="time-text">{{ currentTime }}</text>
				</view>
			</view>

			<!-- 数据卡片区域 -->
			<view class="data-cards">
				<!-- 空气质量卡片 -->
				<view class="data-card air-quality" :class="{ 'warning': airQuality > 100 }">
					<view class="card-header">
						<text class="card-icon">🌤️</text>
						<text class="card-title">空气质量指数</text>
						<view class="quality-indicator" :class="getAirQualityClass()">
							<text class="quality-text">{{ getAirQualityText() }}</text>
						</view>
					</view>
					<view class="card-value">
						<text class="value-number">{{ airQuality }}</text>
						<text class="value-unit">AQI</text>
					</view>
					<view class="card-chart">
						<view class="chart-bar" :style="{ width: getAirQualityPercentage() + '%' }"></view>
					</view>
				</view>

				<!-- PM2.5卡片 -->
				<view class="data-card pm25" :class="{ 'warning': pm25 > 35 }">
					<view class="card-header">
						<text class="card-icon">🌫️</text>
						<text class="card-title">PM2.5浓度</text>
						<view class="status-dot" :class="pm25 > 35 ? 'danger' : 'normal'"></view>
					</view>
					<view class="card-value">
						<text class="value-number">{{ pm25 }}</text>
						<text class="value-unit">μg/m³</text>
					</view>
					<view class="trend-indicator">
						<text class="trend-icon">{{ pm25 > 35 ? '📈' : '📉' }}</text>
						<text class="trend-text">{{ pm25 > 35 ? '偏高' : '正常' }}</text>
					</view>
				</view>

				<!-- 噪音水平卡片 -->
				<view class="data-card noise-level" :class="{ 'warning': noiseLevel > 70 }">
					<view class="card-header">
						<text class="card-icon">🔊</text>
						<text class="card-title">噪音水平</text>
						<view class="noise-indicator">
							<view class="noise-bars">
								<view class="noise-bar" v-for="i in 5" :key="i" 
									  :class="{ 'active': i <= getNoiseLevel() }"></view>
							</view>
						</view>
					</view>
					<view class="card-value">
						<text class="value-number">{{ noiseLevel }}</text>
						<text class="value-unit">dB</text>
					</view>
				</view>

				<!-- 光照强度卡片 -->
				<view class="data-card light-intensity">
					<view class="card-header">
						<text class="card-icon">☀️</text>
						<text class="card-title">光照强度</text>
						<view class="light-indicator">
							<view class="light-circle" :style="{ opacity: getLightIntensity() }"></view>
						</view>
					</view>
					<view class="card-value">
						<text class="value-number">{{ lightIntensity }}</text>
						<text class="value-unit">lux</text>
					</view>
				</view>
			</view>

			<!-- 实时图表区域 -->
			<view class="chart-section">
				<view class="chart-header">
					<text class="chart-title">24小时趋势图</text>
					<view class="chart-controls">
						<text class="chart-tab" :class="{ 'active': activeChart === 'temperature' }" 
							  @click="switchChart('temperature')">温度</text>
						<text class="chart-tab" :class="{ 'active': activeChart === 'humidity' }" 
							  @click="switchChart('humidity')">湿度</text>
						<text class="chart-tab" :class="{ 'active': activeChart === 'airQuality' }" 
							  @click="switchChart('airQuality')">空气质量</text>
					</view>
				</view>
				<view class="chart-container">
					<canvas class="trend-chart" canvas-id="trendChart" @touchstart="onChartTouch"></canvas>
				</view>
			</view>

			<!-- 设备状态区域 -->
			<view class="device-status">
				<view class="status-header">
					<text class="status-title">设备状态</text>
					<text class="refresh-btn" @click="refreshData">🔄 刷新</text>
				</view>
				<view class="device-grid">
					<view class="device-item" v-for="device in devices" :key="device.id">
						<view class="device-icon" :class="device.status">
							<text>{{ device.icon }}</text>
						</view>
						<text class="device-name">{{ device.name }}</text>
						<text class="device-status-text">{{ device.statusText }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部导航 -->
		<view class="bottom-nav">
			<view class="nav-item active">
				<text class="nav-icon">📊</text>
				<text class="nav-text">监测</text>
			</view>
			<view class="nav-item" @click="goToHistory">
				<text class="nav-icon">📈</text>
				<text class="nav-text">历史</text>
			</view>
			<view class="nav-item" @click="goToSettings">
				<text class="nav-icon">⚙️</text>
				<text class="nav-text">设置</text>
			</view>
			<view class="nav-item" @click="logout">
				<text class="nav-icon">🚪</text>
				<text class="nav-text">退出</text>
			</view>
		</view>
	</view>
</template>

<script>
import { STORAGE_KEYS } from '../../config/config.js';

export default {
	data() {
		return {
			// 实时数据
			temperature: 24.5,
			humidity: 65,
			windSpeed: 2.3,
			airQuality: 85,
			pm25: 28,
			noiseLevel: 45,
			lightIntensity: 850,
			
			// 图表相关
			activeChart: 'temperature',
			chartData: {
				temperature: [22, 23, 24, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
				humidity: [60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 88, 85, 82, 80, 78, 75, 72, 70, 68, 65, 62],
				airQuality: [75, 78, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 110, 108, 105, 102, 100, 98, 95, 92, 90, 88, 85]
			},
			
			// 设备状态
			devices: [
				{ id: 1, name: '温度传感器', icon: '🌡️', status: 'online', statusText: '正常' },
				{ id: 2, name: '湿度传感器', icon: '💧', status: 'online', statusText: '正常' },
				{ id: 3, name: '空气质量监测仪', icon: '🌤️', status: 'online', statusText: '正常' },
				{ id: 4, name: '噪音监测器', icon: '🔊', status: 'warning', statusText: '需要校准' },
				{ id: 5, name: '光照传感器', icon: '☀️', status: 'online', statusText: '正常' },
				{ id: 6, name: '风速仪', icon: '🌬️', status: 'offline', statusText: '离线' }
			],
			
			// 时间显示
			currentTime: '',
			timer: null
		}
	},
	
	onLoad() {
		this.updateTime();
		this.startTimer();
		this.initChart();
		this.startDataUpdate();
	},
	
	onUnload() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},
	
	methods: {
		// 更新时间显示
		updateTime() {
			const now = new Date();
			this.currentTime = now.toLocaleString('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
		},
		
		// 启动定时器
		startTimer() {
			this.timer = setInterval(() => {
				this.updateTime();
			}, 1000);
		},
		
		// 开始数据更新
		startDataUpdate() {
			setInterval(() => {
				this.updateSensorData();
			}, 5000); // 每5秒更新一次
		},
		
		// 更新传感器数据
		updateSensorData() {
			// 模拟数据变化
			this.temperature = (this.temperature + (Math.random() - 0.5) * 2).toFixed(1);
			this.humidity = Math.max(30, Math.min(95, this.humidity + (Math.random() - 0.5) * 5));
			this.windSpeed = Math.max(0, this.windSpeed + (Math.random() - 0.5) * 1).toFixed(1);
			this.airQuality = Math.max(20, Math.min(150, this.airQuality + (Math.random() - 0.5) * 10));
			this.pm25 = Math.max(5, Math.min(80, this.pm25 + (Math.random() - 0.5) * 8));
			this.noiseLevel = Math.max(30, Math.min(90, this.noiseLevel + (Math.random() - 0.5) * 5));
			this.lightIntensity = Math.max(100, Math.min(1200, this.lightIntensity + (Math.random() - 0.5) * 100));
		},
		
		// 获取空气质量等级
		getAirQualityClass() {
			if (this.airQuality <= 50) return 'excellent';
			if (this.airQuality <= 100) return 'good';
			if (this.airQuality <= 150) return 'moderate';
			if (this.airQuality <= 200) return 'poor';
			return 'very-poor';
		},
		
		// 获取空气质量文本
		getAirQualityText() {
			if (this.airQuality <= 50) return '优';
			if (this.airQuality <= 100) return '良';
			if (this.airQuality <= 150) return '轻度污染';
			if (this.airQuality <= 200) return '中度污染';
			return '重度污染';
		},
		
		// 获取空气质量百分比
		getAirQualityPercentage() {
			return Math.min(100, (this.airQuality / 200) * 100);
		},
		
		// 获取噪音等级
		getNoiseLevel() {
			if (this.noiseLevel < 40) return 1;
			if (this.noiseLevel < 50) return 2;
			if (this.noiseLevel < 60) return 3;
			if (this.noiseLevel < 70) return 4;
			return 5;
		},
		
		// 获取光照强度
		getLightIntensity() {
			return Math.min(1, this.lightIntensity / 1000);
		},
		
		// 切换图表
		switchChart(type) {
			this.activeChart = type;
			this.drawChart();
		},
		
		// 初始化图表
		initChart() {
			this.drawChart();
		},
		
		// 绘制图表
		drawChart() {
			const ctx = uni.createCanvasContext('trendChart', this);
			const data = this.chartData[this.activeChart];
			const width = 300;
			const height = 150;
			
			// 清空画布
			ctx.clearRect(0, 0, width, height);
			
			// 绘制背景
			ctx.setFillStyle('#f5f5f5');
			ctx.fillRect(0, 0, width, height);
			
			// 绘制数据线
			ctx.setStrokeStyle('#667eea');
			ctx.setLineWidth(2);
			ctx.beginPath();
			
			const stepX = width / (data.length - 1);
			const maxValue = Math.max(...data);
			const minValue = Math.min(...data);
			const range = maxValue - minValue;
			
			data.forEach((value, index) => {
				const x = index * stepX;
				const y = height - ((value - minValue) / range) * height;
				
				if (index === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			});
			
			ctx.stroke();
			ctx.draw();
		},
		
		// 图表触摸事件
		onChartTouch(e) {
			// 可以添加图表交互功能
		},
		
		// 刷新数据
		refreshData() {
			uni.showToast({
				title: '数据已刷新',
				icon: 'success',
				duration: 1500
			});
			this.updateSensorData();
		},
		
		// 跳转到历史页面
		goToHistory() {
			uni.showToast({
				title: '历史数据功能开发中',
				icon: 'none'
			});
		},
		
		// 跳转到设置页面
		goToSettings() {
			uni.showToast({
				title: '设置功能开发中',
				icon: 'none'
			});
		},
		
		// 退出登录
		logout() {
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

<style scoped>
.monitor-container {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	min-height: 100vh;
	position: relative;
}

.status-bar {
	display: flex;
	justify-content: space-around;
	padding: 20rpx 40rpx;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10rpx);
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
}

.status-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
}

.status-icon {
	font-size: 32rpx;
	margin-bottom: 8rpx;
}

.status-label {
	font-size: 20rpx;
	opacity: 0.8;
	margin-bottom: 4rpx;
}

.status-value {
	font-size: 24rpx;
	font-weight: bold;
}

.content-area {
	padding: 40rpx;
}

.header-section {
	text-align: center;
	margin-bottom: 60rpx;
}

.main-title {
	display: block;
	font-size: 48rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 10rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.sub-title {
	display: block;
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 20rpx;
}

.time-display {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	padding: 15rpx 30rpx;
	display: inline-block;
}

.time-text {
	color: white;
	font-size: 22rpx;
}

.data-cards {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30rpx;
	margin-bottom: 60rpx;
}

.data-card {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 25rpx;
	padding: 30rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.data-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 6rpx;
	background: linear-gradient(90deg, #667eea, #764ba2);
}

.data-card.warning::before {
	background: linear-gradient(90deg, #ff6b6b, #ee5a24);
}

.card-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.card-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
}

.card-title {
	font-size: 24rpx;
	color: #333;
	font-weight: 500;
	flex: 1;
}

.quality-indicator {
	padding: 8rpx 16rpx;
	border-radius: 15rpx;
	font-size: 20rpx;
	color: white;
}

.quality-indicator.excellent {
	background: #00b894;
}

.quality-indicator.good {
	background: #00cec9;
}

.quality-indicator.moderate {
	background: #fdcb6e;
}

.quality-indicator.poor {
	background: #e17055;
}

.quality-indicator.very-poor {
	background: #d63031;
}

.card-value {
	display: flex;
	align-items: baseline;
	margin-bottom: 20rpx;
}

.value-number {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-right: 10rpx;
}

.value-unit {
	font-size: 20rpx;
	color: #666;
}

.card-chart {
	height: 8rpx;
	background: #f0f0f0;
	border-radius: 4rpx;
	overflow: hidden;
}

.chart-bar {
	height: 100%;
	background: linear-gradient(90deg, #667eea, #764ba2);
	transition: width 0.3s ease;
}

.status-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
}

.status-dot.normal {
	background: #00b894;
}

.status-dot.danger {
	background: #d63031;
}

.trend-indicator {
	display: flex;
	align-items: center;
}

.trend-icon {
	font-size: 24rpx;
	margin-right: 8rpx;
}

.trend-text {
	font-size: 20rpx;
	color: #666;
}

.noise-indicator {
	display: flex;
	align-items: center;
}

.noise-bars {
	display: flex;
	gap: 4rpx;
}

.noise-bar {
	width: 8rpx;
	height: 20rpx;
	background: #ddd;
	border-radius: 2rpx;
	transition: all 0.3s ease;
}

.noise-bar.active {
	background: #667eea;
}

.light-indicator {
	display: flex;
	align-items: center;
}

.light-circle {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	background: #fdcb6e;
	box-shadow: 0 0 10rpx rgba(253, 203, 110, 0.5);
}

.chart-section {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 25rpx;
	padding: 30rpx;
	margin-bottom: 60rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.chart-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.chart-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.chart-controls {
	display: flex;
	gap: 20rpx;
}

.chart-tab {
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	color: #666;
	background: #f0f0f0;
	transition: all 0.3s ease;
}

.chart-tab.active {
	background: #667eea;
	color: white;
}

.chart-container {
	height: 200rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.trend-chart {
	width: 300rpx;
	height: 150rpx;
}

.device-status {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 25rpx;
	padding: 30rpx;
	margin-bottom: 120rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.status-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.status-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.refresh-btn {
	font-size: 22rpx;
	color: #667eea;
	cursor: pointer;
}

.device-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30rpx;
}

.device-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
	background: #f8f9fa;
	border-radius: 20rpx;
	transition: all 0.3s ease;
}

.device-item:hover {
	transform: translateY(-5rpx);
	box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
}

.device-icon {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin-bottom: 15rpx;
	background: #e8f5e8;
}

.device-icon.online {
	background: #e8f5e8;
}

.device-icon.warning {
	background: #fff3cd;
}

.device-icon.offline {
	background: #f8d7da;
}

.device-name {
	font-size: 22rpx;
	color: #333;
	margin-bottom: 8rpx;
	text-align: center;
}

.device-status-text {
	font-size: 18rpx;
	color: #666;
}

.bottom-nav {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20rpx);
	border-top: 1rpx solid rgba(0, 0, 0, 0.1);
	display: flex;
	padding: 20rpx 0;
}

.nav-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx;
	cursor: pointer;
	transition: all 0.3s ease;
}

.nav-item.active {
	color: #667eea;
}

.nav-item:not(.active) {
	color: #666;
}

.nav-icon {
	font-size: 32rpx;
	margin-bottom: 8rpx;
}

.nav-text {
	font-size: 20rpx;
}

/* 响应式设计 */
@media (max-width: 750rpx) {
	.data-cards {
		grid-template-columns: 1fr;
	}
	
	.device-grid {
		grid-template-columns: 1fr;
	}
	
	.chart-controls {
		flex-direction: column;
		gap: 10rpx;
	}
}
</style> 