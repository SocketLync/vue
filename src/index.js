import {default as SocketLync} from '@socket-lync/js-client';
import {inject, onBeforeUnmount, ref} from 'vue';

const SocketLyncVue = {
	install(app, options) {
		app.provide('socketLync', new SocketLync(options));
	},
};

function useSocketLync() {
	const socketLync = inject('socketLync');
	const callbacks = ref({});

	const debug = (...args) => {
		if (!socketLync.options.debug) {
			return;
		}

		console.debug('%c[socket-lync-vue]', 'color: #0066FF', ...args);
	};

	function channelWrapper(channel) {
		return new Proxy(channel, {
			get(target, name, receiver) {
				if (!Reflect.has(target, name)) {
					return void 0;
				}

				const original = Reflect.get(target, name, receiver);
				if (name === 'on') {
					return (function (event, callback) {
						if (typeof callbacks.value[this.name] === 'undefined') {
							callbacks.value[this.name] = {};
						}
						if (typeof callbacks.value[this.name][event] === 'undefined') {
							callbacks.value[this.name][event] = [];
						}
						callbacks.value[this.name][event].push(callback);

						debug(`new callback for ${this.name}, event: ${event}`, callback);

						return original.bind(this)(...arguments);
					}).bind(target);
				}

				return original;
			},
		});
	}

	function subscribeChannel(name) {
		if (!socketLync.channels[name]) {
			debug(`new channel ${name}`);
		}

		return channelWrapper(socketLync.channel(name));
	}

	function subscribePrivate(name) {
		if (!socketLync.channels['private-' + name]) {
			debug(`new channel private-${name}`);
		}

		return channelWrapper(socketLync.privateChannel(name));
	}

	function subscribePresence(name) {
		if (!socketLync.channels['presence-' + name]) {
			debug(`new channel presence-${name}`);
		}

		return channelWrapper(socketLync.presenceChannel(name));
	}

	function unbindAll() {
		debug('Unbinding all events');

		Object.keys(callbacks.value).forEach((channel) => {
			if (!socketLync.channels[channel]) {
				debug(`channel ${channel} not found, maybe already leaved`);
				return;
			}

			Object.keys(callbacks.value[channel]).forEach((event) => {
				callbacks.value[channel][event].forEach((callback) => socketLync.channels[channel].unbindEvent(event, callback));
			});
		});

		callbacks.value = {};
	}

	onBeforeUnmount(() => unbindAll());

	return {
		socketLync: {
			socketId: () => socketLync.socketId(),
			leave: (...args) => socketLync.leave(...args),
			leaveChannel: (...args) => socketLync.leaveChannel(...args),
			subscribeChannel,
			subscribePrivate,
			subscribePresence,
			unbindAll,
		},
	};
}

export {
	SocketLyncVue as default,
	useSocketLync,
};