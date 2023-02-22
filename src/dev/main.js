import {createApp} from 'vue';
import App from './App.vue';
import SocketLyncVue from './../index';
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