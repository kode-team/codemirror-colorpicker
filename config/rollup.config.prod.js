import packageJSON from '../package.json'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import autoprefixer from 'autoprefixer'
import glslify from 'rollup-plugin-glslify';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';


// rollup.config.js
export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/' + packageJSON.name + '.min.js',
    format: 'iife',
    globals: {
      "codemirror" : "window.CodeMirror"
    },
    external: ['codemirror']
  },
  name: 'CodeMirrorColorPicker',  
  plugins : [
    peerDepsExternal(),
    glslify({ basedir: 'src/util/glsl/source' }),
    //scss({output : 'dist/' + packageJSON.name + '.css'}),
    postcss({
      extract: 'dist/' + packageJSON.name + '.css',
      plugins: [
        autoprefixer()
      ],
      extensions: ['.scss']
    }),     
    babel({
      exclude: ['node_modules/**', 'src/util/glsl/source/**']
    }),
    uglify()
  ]
}, {
  input: 'src/index.js',
  output: {
    file: 'dist/' + packageJSON.name + '.js',
    format: 'umd',
    globals: {
      "codemirror" : "CodeMirror"
    },
    external: ['codemirror']
  },
  name: 'codemirror-colorpicker',
  plugins : [
    postcss({
      extract: 'dist/' + packageJSON.name + '.css',
      plugins: [
        autoprefixer()
      ],
      extensions: ['.scss']
    }),         
    babel({
      exclude: 'node_modules/**'
    })
  ]
}];