import packageJSON from '../package.json'
import scss from 'rollup-plugin-scss'
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import minify from 'rollup-plugin-minify'

// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'addon/' + packageJSON.name + '.js',
    format: 'umd'
  },
  plugins : [
    scss({output : 'addon/' + packageJSON.name + '.css'}),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify(),
    minify({ iife : 'addon/' + packageJSON.name + '.min.js'})
  ]
};