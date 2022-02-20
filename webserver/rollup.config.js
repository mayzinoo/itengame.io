import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-resolve'

const dist = 'dist'

export default {
	input: 'server/index.js',
	output: [
		{
			file: `${dist}/bundle.cjs.js`,
			format: 'cjs'
		},
		{
			file: `${dist}/bundle.esm.js`,
			format: 'esm'
		},
		{
			name: 'Itengame',
			file: `${dist}/bundle.umd.js`,
			format: 'umd'
		}
	],
	plugins:
		resolve(),
		babel({
			exclude: 'node_modules/**'
		})
}