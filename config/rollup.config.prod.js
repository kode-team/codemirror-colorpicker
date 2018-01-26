import packageJSON from '../package.json'
import scss from 'rollup-plugin-scss'
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import minify from 'rollup-plugin-minify'

// rollup.config.js
export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/' + packageJSON.name + '.min.js',
    format: 'iife',
    globals: {
      "codemirror" : "CodeMirror"
    }
  },
  name: 'CodemirrorColorpicker',  
  plugins : [
    scss({output : 'dist/' + packageJSON.name + '.css'}),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}, {
  input: 'src/index.js',
  output: {
    file: 'dist/' + packageJSON.name + '.js',
    format: 'umd'
  },
  name: 'codemirror-colorpicker',
  plugins : [
    scss({output : 'dist/' + packageJSON.name + '.css'}),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}];