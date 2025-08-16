// src/services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
	constructor(url) {
		this.socket = io(url);
		this.listeners = {};
	}

	connect() {
		this.socket.on('connect', () => {
			console.log('客户端socket连接成功');
			this.emitEvent('connect');
		});

		this.socket.on('disconnect', () => {
			console.log('客户端socket断开连接');
			this.emitEvent('disconnect');
		});
	}

	on(eventName, callback) {
		this.socket.on(eventName, (data) => {
			callback(data);
			this.emitEvent(eventName, data);
		});
	}

	emit(eventName, data) {
		this.socket.emit(eventName, data);
	}

	off(eventName, callback) {
		this.socket.off(eventName, callback);
	}

	addEventListener(eventName, callback) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(callback);
	}

	removeEventListener(eventName, callback) {
		if (this.listeners[eventName]) {
			this.listeners[eventName] = this.listeners[eventName].filter((cb) => cb !== callback);
		}
	}

	emitEvent(eventName, data) {
		if (this.listeners[eventName]) {
			this.listeners[eventName].forEach((callback) => callback(data));
		}
	}
	disconnect() {
		this.socket.disconnect();
	}
}

export default SocketService;
