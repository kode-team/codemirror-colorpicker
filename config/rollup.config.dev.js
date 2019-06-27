import packageJSON from '../package.json'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import autoprefixer from 'autoprefixer'
import glslify from 'rollup-plugin-glslify';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'addon/' + packageJSON.name + '.js',
    format: 'iife',
    globals: {
      "codemirror" : "window.CodeMirror"
    },
    external: ['codemirror']
  },
  name: 'CodeMirrorColorPicker',  
  plugins : [
    peerDepsExternal(),
    serve(),
    livereload({watch: 'addon'}),
    glslify({ basedir: 'src/util/glsl/source' }),
    //scss({output : 'addon/' + packageJSON.name + '.css'}),
    postcss({
      extract: 'addon/' + packageJSON.name + '.css',
      plugins: [
        autoprefixer()
      ],
      extensions: ['.scss']
    }), 
    babel({
      exclude: ['node_modules/**', 'src/util/glsl/source/**'],
      presets: [
        [ 'es2015', { modules : false } ] 
      ]
    })
  ],
  watch: {
    chokidar: {
      // if the chokidar option is given, rollup-watch will
      // use it instead of fs.watch. You will need to install
      // chokidar separately.
      //
      // this options object is passed to chokidar. if you
      // don't have any options, just pass `chokidar: true`
    },

    // include and exclude govern which files to watch. by
    // default, all dependencies will be watched
    exclude: ['node_modules/**']
  }
};