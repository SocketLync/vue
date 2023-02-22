<template>
	<div>
		<button @click="unbindAll">unbind all events (unmounted)</button>

		<div v-for="[method, type] in [[socketLync.subscribeChannel, 'channel'], [socketLync.subscribePresence, 'presence'], [socketLync.subscribePrivate, 'private']]"
			style="margin-top: 25px;margin-bottom: 25px;">
			<button @click="addEvents(method('Test'))">subscribe {{type}} Test</button>
			<button @click="addEvents(method('Test2'))">subscribe {{type}} Test2</button>
			<button @click="addEvents(method('Test3'))">subscribe {{type}} Test3</button>
			<button @click="addEvents(method('Test4'))">subscribe {{type}} Test4</button>
		</div>

		<div>
		<button @click="showComponent = !showComponent">toggle component</button>

		<test v-if="showComponent" />
		</div>
	</div>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {useSocketLync} from './../index';
import Test from './Test.vue';

export default defineComponent({
	components: { Test },
	setup() {
		return {
			showComponent: ref(false),
			...useSocketLync(),
		};
	},
	created() {
		// this.addEvents(this.socketLync.subscribeChannel('Test.1234'));
	},
	methods: {
		addEvents(channel) {
			channel
				.subscribed(() => {
					   console.log(`channel ${channel.name} subscribed`);
				   })
				   .listen('Test', (data) => {
					   console.log(`${channel.name}:`, 'event Test:', data);
				   });
		}
	}
});
</script>