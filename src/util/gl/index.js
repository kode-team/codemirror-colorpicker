import GLFilter from './filter/index'
import {makeFragmentShaderSource, makeVertexShaderSource} from './filter/util'



let TEXTURE_INDEX = 0 

class GLCanvas {

    constructor (opt = {
        width : '400px',
        height: '300px'
    }) {
        this.img = opt.img; 
        this.width = parseFloat(this.img.width || opt.width || '400px');
        this.height = parseFloat(this.img.height || opt.height || '300px');
        this.init()


    }

    resize () {
        this.canvas.width = this.width; 
        this.canvas.height = this.height; 
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';

        this.viewport()
    }

    /* Canvas 비우기, 비울 때 색 지정하기  */ 
    clear (r = 0, g = 0, b = 0, a = 0) {
        const gl = this.gl 

        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);        
    }

    /* viewport 설정, 기본적으로 canvas 의 크기로 고정  */
    viewport (x, y, width, height) {
        const gl = this.gl 

        gl.viewport(x || 0, y || 0, width || gl.canvas.width,  height || gl.canvas.height);
    }

    // canvas 초기화 
    // gl context 구하기 

    initCanvas (vertexSource, fragmentSource) {
        this.canvas = document.createElement('canvas')

        this.gl = this.canvas.getContext('webgl2');

        if (!this.gl) {
            throw new Error("you need webgl2 support")
        }

        // program 생성 
        this.program = this.createProgram (vertexSource, fragmentSource) 
   

        // this.clear()
        this.resize()

        // buffer 설정 
        this.initBuffer()
    }

    draw (primitiveType = 'TRIANGLES', offset = 0, count = 6) {
        const gl = this.gl 

        gl.drawArrays(gl[primitiveType], offset, count)
    }

    triangles (offset = 0, count = 6) {
        this.draw('TRIANGLES', offset, count)
    }

    uniform2f(...args) {

        var key = args.shift()

        this.gl.uniform2f(...[this.locations[key], ...args])
    }

    uniform1f(...args) {

        var key = args.shift()

        this.gl.uniform1f(...[this.locations[key], ...args])
    }    

    uniform1fv(...args) {

        var key = args.shift()

        this.gl.uniform1fv(...[this.locations[key], ...args])
    }        

    uniform1i(...args) {

        var key = args.shift()

        this.gl.uniform1i(...[this.locations[key], ...args])
    }    

    useProgram () {
        const gl = this.gl 

        gl.useProgram(this.program);

    } 

    bindBuffer(key, data, drawType = 'STATIC_DRAW') {
        const gl = this.gl 

        if (!this.buffers[key]) {
            this.buffers[key] = gl.createBuffer()
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[key])     
        
        if (data) {
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl[drawType]); 
        }
    }

    enable (key) {
        const gl = this.gl 

        // array attribute 를 활성화 시킴 
        gl.enableVertexAttribArray(this.locations[key])
    }

    location (key, type = "attribute") { 
        if (type === 'attribute') {
            this.locations[key] = this.gl.getAttribLocation(this.program, key)
        } else if (type === 'uniform') {
            this.locations[key] = this.gl.getUniformLocation(this.program, key)
        }
    }

    a (key) {
        return this.location(key)
    }

    u (key) { 
        return this.location(key, "uniform")
    }

    pointer (key, type = 'FLOAT', size = 2, normalize = false, stride = 0, offset = 0) {
        const gl = this.gl 

        gl.vertexAttribPointer(this.locations[key], size, gl[type], normalize, stride, offset);
    }

    bufferData (data = []) {
        const gl = this.gl ; 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);        
    }

    isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }


    bindTexture (key, img = undefined, mipLevel = 0, internalFormat = 'RGBA', srcFormat = 'RGBA', srcType = 'UNSIGNED_BYTE') {
        const gl = this.gl 

        if (arguments.length == 1) {
            gl.bindTexture(gl.TEXTURE_2D, this.textures[key])
            return; 
        }

        if ( !this.textures[key] ) {
            this.textures[key] = gl.createTexture()
        }

        this.textureIndex[key] = TEXTURE_INDEX++;
        // this.activeTexture(key)
        gl.bindTexture(gl.TEXTURE_2D, this.textures[key]);

        this.setTextureParameter()

        gl.texImage2D(gl.TEXTURE_2D, mipLevel, gl[internalFormat], gl[srcFormat], gl[srcType], img.newImage || img);
    }

    bindColorTexture (key, data, width = 256, height = 1, mipLevel = 0, internalFormat = 'RGBA', srcFormat = 'RGBA', srcType = 'UNSIGNED_BYTE') {
        const gl = this.gl 

        if ( !this.textures[key] ) {
            this.textures[key] = gl.createTexture()
        }

        this.textureIndex[key] = TEXTURE_INDEX++;
        gl.bindTexture(gl.TEXTURE_2D, this.textures[key]);

        this.setTextureParameter()

        gl.texImage2D(gl.TEXTURE_2D, mipLevel, gl[internalFormat], width, height, 0, gl[srcFormat], gl[srcType], new Uint8Array(data));

    }

    bindEmptyTexture (key, width, height, mipLevel = 0, internalFormat = 'RGBA', srcFormat = 'RGBA', srcType = 'UNSIGNED_BYTE') {
        const gl = this.gl 

        if ( !this.textures[key] ) {
            this.textures[key] = gl.createTexture()
        }

        this.textureIndex[key] = TEXTURE_INDEX++;
        gl.bindTexture(gl.TEXTURE_2D, this.textures[key]);

        this.setTextureParameter()

        var border = 0; 
        var data = null;

        gl.texImage2D(gl.TEXTURE_2D, mipLevel, gl[internalFormat], width, height, border, gl[srcFormat], gl[srcType], data);

    }

    setTextureParameter() {
        const gl = this.gl

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    bindFrameBufferWithTexture(key, textureKey, width, height) {
        this.bindEmptyTexture(textureKey, width, height);
        this.bindFrameBuffer(key, textureKey)
    }

    enumToString(value) {
        const gl = this.gl 

        if (value === 0) { 
            return "NONE";
        }
        for (let key in gl) {
            if (gl[key] === value) {
            return key;
            }
        }
        return "0x" + value.toString(16);
    }

    bindFrameBuffer (key, textureKey = null) {
        const gl = this.gl 

        if (arguments.length === 1) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, key == null ? null : this.framebuffers[key]);
            return; 
        }

        if (!this.framebuffers[key]) {
            // 프레임버퍼 생성하기 
            this.framebuffers[key] = gl.createFramebuffer()
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[key]);
    
        // framebuffer 에 texture2d 연결 
        const mipLevel = 0
        var attachmentPoint = gl.COLOR_ATTACHMENT0;   // framebuffer 를 attachmentPoint 에 연결한다. 
        // framebuffer 는 데이타를 가지고 있지 않고 연결 고리만 가지고 있다. 
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.textures[textureKey], mipLevel);

        // framebuffer 상태 체크 하기 
        // framebuffer 를 더 이상 할당 못할 수도 있음. 
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        // console.log(this.enumToString(attachmentPoint), this.enumToString(status), key, this.textures[textureKey]);
        
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
          return;
        }        
    
    }

    bindVA () {
        const gl = this.gl 

        if(!this.vao) {
            this.vao = gl.createVertexArray();
        }

        gl.bindVertexArray(this.vao);
    }

    bindAttr (key, data, drawType = 'STATIC_DRAW', size = 2) {
        // 버퍼를 만들고 데이타를 연결한다. 
        this.bindBuffer(key, data, drawType)

        //array 변수를 사용할 수 있도록 활성화 시킨다. 
        this.enable(key)        

        // 포인터를 지정한다. 
        // array 변수가 어떻게 iteration 될지 지정한다. size 는 한번에 연산될 요소 개수 
        // size 가 2 라고 했을 때 2개씩 하나의 iteration 에 들어간다. 
        // 즉, (x, y) 가 한번에 들어감 
        this.pointer(key, 'FLOAT', size)
    }

    /* 
        shader 에서 사용하는 Attribute, Uniform 변수 설정 
        변수 설정을 간소화 할 필요도 있을 듯 하다. 
    */
    initBuffer () {
        
        const { width, height } = this.canvas 

        // console.log(width, height)

        // 선언된 변수 location 지정 하기 
        // location 을 지정해야 GLSL 에서 해당 변수와 연결할 수 있다. 언제? 
        this.a("a_position");
        this.a("a_texCoord")
        this.u("u_resolution")
        this.u("u_image")    
        this.u("u_flipY") 

        this.u("u_kernelSelect");
        this.u("u_filterIndex");
    
        this.u("u_kernel9[0]");
        this.u("u_kernel9Weight");
        this.u("u_kernel25[0]");
        this.u("u_kernel25Weight");
        this.u("u_kernel49[0]");
        this.u("u_kernel49Weight");        
        this.u("u_kernel81[0]");
        this.u("u_kernel81Weight");

        this.bindVA()         

        // 단순 변수를 초기화 하고 
        this.bindAttr("a_position", [
            0, 0,
            width, 0,
            0, height,
            0, height,
            width, 0,
            width, height,
        ], 'STATIC_DRAW', 2 /* components for iteration */);

        // 변수에 데이타를 연결할다. 
        this.bindAttr("a_texCoord", [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,

            0.0, 1.0, 
            1.0, 0.0,
            1.0, 1.0 
        ], 'STATIC_DRAW', 2 /* components for iteration */);


        // texture 는 img 로 할 수도 있고 
        this.bindTexture("u_image", this.img); 

        // 비어있는 texture 도 만들 수 있다. 
        // 객체로 제어할까? 
        // texture 를 framebuffer 로 바로 대응시킨다. 
        // 이후 framebuffer 가 변경되면 img_texture 가 바뀐다. 
        this.bindFrameBufferWithTexture("frame_buffer_0", "img_texture_0", width, height)
        this.bindFrameBufferWithTexture("frame_buffer_1", "img_texture_1", width, height)
    }

    activeTexture(index = 0) {
        const gl = this.gl 

        gl.activeTexture(gl.TEXTURE0 + index);
    }

    drawFilter () {
        const gl = this.gl 

        this.resize()
        this.clear() 

        this.useProgram()

        this.bindVA()


        this.activeTexture(0)
        this.bindTexture('u_image')

        this.uniform1i("u_image", 0)
        this.uniform1f("u_flipY", 1);

        const { width, height } = gl.canvas 

        this.eachFilter((f, index) => {

            this.bindFrameBuffer(`frame_buffer_${index % 2}`);
            this.uniform2f("u_resolution", width, height);        
            this.viewport(0, 0, width, height);

            this.effectFilter(f);
    
            // 다음 드로잉을 위해 방금 렌더링 한 텍스처를 사용합니다.
            this.bindTexture(`img_texture_${index % 2}`)
        })

        this.uniform1f("u_flipY", -1);  
        this.bindFrameBuffer(null);
        this.uniform2f("u_resolution", width, height);        
        this.viewport(0, 0, width, height);

        // clear 가 있는 이유는? 
        this.clear()

        this.effectFilter("normal");        
    }

    effectFilter (filterFunction) {

        if (typeof filterFunction == 'string') {
            filterFunction = (GLFilter[filterFunction] || GLFilter.normal).call(GLFilter)
        }

        if (filterFunction.type == 'convolution') {
            this.uniform1f("u_kernelSelect", filterFunction.length)
            this.uniform1f("u_filterIndex", -1.0)
            this.uniform1fv(`u_kernel${filterFunction.length}[0]`, filterFunction.content) 
            this.uniform1f(`u_kernel${filterFunction.length}Weight`, this.computeKernelWeight(filterFunction.content))
        } else {
             
            this.uniform1f("u_kernelSelect", -1.0)
            this.uniform1f("u_filterIndex", filterFunction.index)
        }


        this.triangles(0 /* 시작 지점 */, 6 /* 좌표(vertex, 꼭지점) 개수 */) ; // 총 6개를 도는데 , triangles 니깐 3개씩 묶어서 2번 돈다. 
    }

    computeKernelWeight(kernel) {
        var weight = kernel.reduce(function(prev, curr) {
            return prev + curr;
        });
        return weight <= 0 ? 1 : weight;
    }

    createProgram (vertexSource, fragmentSource) {

        const gl = this.gl 

        var program = gl.createProgram()

        this.vertexShader = this.createVertexShader (vertexSource) 
        this.fragmentShader = this.createFragmentShader(fragmentSource) 

        // console.log(fragmentSource)      


        gl.attachShader(program, this.vertexShader )
        gl.attachShader(program, this.fragmentShader)

        gl.linkProgram(program)

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {

            return program 
        }

        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program)
    }

    createShader (type, source) {
        const gl = this.gl 

        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (success) {
            return shader; 
        }

        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader) 
    }

    createVertexShader (vertexSource) {
        const gl = this.gl 

        return this.createShader(gl.VERTEX_SHADER, vertexSource);
    }

    createFragmentShader (fragmentSource) {
        const gl = this.gl 

        return this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
    }

    eachFilter (callback) {
        this.filterList.forEach(callback)
    }

    init () {
        this.locations = {} 
        this.buffers = {} 
        this.framebuffers = {}
        this.textures = {}
        this.textureIndex = {}
        this.hasTexParameter = {}
    }

    destroy () {
        const gl = this.gl 

        this.init()

        gl.deleteProgram(this.program)
    }

    filter(filterList, doneCallback) {

        this.filterList = filterList

        this.initCanvas(makeVertexShaderSource(), makeFragmentShaderSource(this.filterList))

        this.drawFilter()

        if (typeof doneCallback == 'function') {

            doneCallback(this)
        }
    }
}

export default {
    GLCanvas 
}