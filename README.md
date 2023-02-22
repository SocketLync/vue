## Installation

```bash
$ npm install @socket-lync/vue
```

## Usage

`debug` exposes a function; simply pass this function the name of your module, and it will return a decorated version of `console.error` for you to pass debug statements to. This will allow you to toggle the debug output for different parts of your module as well as the module as a whole.

Example [_app.js_](./src/dev/main.js):

```js
import {createApp} from 'vue';
import App from './App.vue';
import SocketLyncVue from '@socket-lync/vue';
import io from 'socket.io-client';

const app = createApp(App);

app.use(SocketLyncVue, {
	host: 'https://ws.derpierre65.dev/app/APP-ID',
	client: io,
	autoConnect: false,
	autoLeave: true,
	debug: true,
});

app.mount('#app');
```

Example [_App.vue_](./src/dev/App.vue):

```vue
<script>
import {defineComponent, ref} from 'vue';
import {useSocketLync} from '@socket-lync/vue';

export default defineComponent({
	setup() {
		return {
			...useSocketLync(),
		};
	},
	created() {
		this.socketLync
			.subscribeChannel('Test.1234')
			.subscribed(() => {
				console.log(`channel subscribed`);
			})
			.listen('Test', (data) => {
				console.log('channel event', data);
			});

		this.socketLync
			.subscribePrivate('Test.1234') // will prefixed with private-
			.subscribed(() => {
				console.log(`private channel subscribed`);
			})
			.listen('Test', (data) => {
				console.log('Private channel event', data);
			});
	},
});
</script>
```