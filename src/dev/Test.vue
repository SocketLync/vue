<template>
	<div>
		hallo :)
	</div>
</template>

<script>
import {defineComponent} from 'vue';
import {useSocketLync} from '../index';

export default defineComponent({
	name: 'Test',
	inject: {
		test: 'socketLync',
	},
	setup() {
		return {
			...useSocketLync(),
		};
	},
	created() {
		console.log(this.test);
		this.socketLync.subscribeChannel('Test2')
			.subscribed(() => {
				console.log('Test2 subscribed from component');
			})
			.listen('Test', () => {
				console.log('My Test Event');
			})
	}
});
</script>