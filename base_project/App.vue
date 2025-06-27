<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 设置状态栏样式
			uni.setStatusBarStyle({
				style: 'light'
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #000000;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}
	
	/* 全局按钮样式重置 */
	button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		line-height: 1;
	}
	
	button::after {
		border: none;
	}
	
	/* 全局输入框样式重置 */
	input {
		border: none;
		outline: none;
		background: transparent;
	}
	
	/* 全局动画 */
	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.3s ease;
	}
	
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
	
	/* 全局滚动条样式 */
	::-webkit-scrollbar {
		width: 6rpx;
		background-color: transparent;
	}
	
	::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 3rpx;
	}
	
	::-webkit-scrollbar-track {
		background-color: transparent;
	}
</style>
