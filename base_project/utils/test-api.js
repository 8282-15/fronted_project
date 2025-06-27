// API测试文件
import { authAPI } from './api.js';

// 测试登录API
export const testLoginAPI = async () => {
	try {
		console.log('测试登录API...');
		const result = await authAPI.login({
			username: 'farmer001',
			password: 'SecurePass123!'
		});
		console.log('登录成功:', result);
		return result;
	} catch (error) {
		console.error('登录失败:', error.message);
		throw error;
	}
};

// 测试注册API
export const testRegisterAPI = async () => {
	try {
		console.log('测试注册API...');
		const result = await authAPI.register({
			username: 'testuser001',
			password: 'TestPass123!',
			confirmPassword: 'TestPass123!'
		});
		console.log('注册成功:', result);
		return result;
	} catch (error) {
		console.error('注册失败:', error.message);
		throw error;
	}
};

// 测试网络连接
export const testNetworkConnection = () => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'http://192.168.20.144:8080',
			method: 'GET',
			timeout: 5000,
			success: (res) => {
				console.log('网络连接正常');
				resolve(true);
			},
			fail: (err) => {
				console.error('网络连接失败:', err);
				reject(err);
			}
		});
	});
};

export default {
	testLoginAPI,
	testRegisterAPI,
	testNetworkConnection
}; 