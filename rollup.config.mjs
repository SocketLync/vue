import terser from '@rollup/plugin-terser';
import vue from 'rollup-plugin-vue';

function createEntry({ minify = false, format, file }) {
	const entry = {
		input: './src/index.js',
		external: ['vue'],
		output: {
			name: 'SocketLync',
			format,
			file,
		},
		plugins: [
			vue(),
		],
	};

	if (minify) {
		entry.plugins.push(terser());
	}

	return entry;
}

export default [
	createEntry({ format: 'esm', file: 'dist/socket-lync-vue.esm.js' }),
	createEntry({ format: 'iife', file: 'dist/socket-lync-vue.browser.js' }),
	createEntry({ format: 'cjs', file: 'dist/socket-lync-vue.cjs.js' }),
	createEntry({ minify: true, format: 'esm', file: 'dist/socket-lync-vue.esm.min.js' }),
	createEntry({ minify: true, format: 'iife', file: 'dist/socket-lync-vue.browser.min.js' }),
	createEntry({ minify: true, format: 'cjs', file: 'dist/socket-lync-vue.cjs.min.js' }),
];