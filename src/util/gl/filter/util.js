export function parseParamNumber (param) {
    if (typeof param === 'string') {
        param = param.replace(/deg/, '')
        param = param.replace(/px/, '')
    }
    return +param 
} 

export function weight(arr, num = 1) {
    return arr.map(i => {
        return i * num;
    })
}

let SHADER_INDEX = 0 

function convolutionString (count) {

    var width = Math.sqrt(count)
    var half = Math.floor(width/2)


    return [...Array(count)].map((it, index) => {
        const y = Math.floor(index / width) - half
        const x = index % width - half

        return `texture(u_image, v_texCoord + onePixel * vec2(${x}, ${y})) * u_kernel${count}[${index}]`
    }).join(' + \n')
}

export function multi (str) {
    return [...arguments]; 
}

export function convolution(arr) {

    return {
        type: 'convolution',
        length: arr.length,
        content: arr
    }
}

function makeShader (str , index) {
    return `
        if (u_filterIndex == ${index}.0) {
            ${str}
        }
    `
}

export function shader(str, options) {
    return {
        type: 'shader',
        index: SHADER_INDEX,
        options, 
        content: makeShader(str, SHADER_INDEX++)
    }
}


export function makeVertexShaderSource () {
    return `#version 300 es 

        in vec2 a_position;
        in vec2 a_texCoord; 

        uniform vec2 u_resolution;
        uniform float u_flipY;

        out vec2 v_texCoord; 

        void main() {
            vec2 zeroToOne = a_position / u_resolution;

            vec2 zeroToTwo = zeroToOne * 2.0;

            vec2 clipSpace = zeroToTwo - 1.0;

            gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

            v_texCoord = a_texCoord;

        }
    `
}

function makeConvolution(count) {

    return `
    
    if (u_kernelSelect == ${count}.0) {
        vec4 colorSum = ${convolutionString(count)}; 

        outColor = vec4((colorSum / u_kernel${count}Weight).rgb, 1);
        
    }
    `
}

export function makeFragmentShaderSource (filterShaderList) {

    const filterContent = filterShaderList.filter(f => f.type == 'shader').map(f => f.content).join('\n\n')

    const weightTable = {'9': true} 

    filterShaderList.filter(f => f.type == 'convolution').forEach(f => {
        weightTable[f.length] = true 
    })

    const convolutionString = Object.keys(weightTable).map(len => {
        return makeConvolution(+len)
    }).join('\n')


    return `#version 300 es

    precision highp int;
    precision mediump float;
    
    uniform sampler2D u_image;

    // 3 is 3x3 matrix kernel 
    uniform float u_kernelSelect;
    uniform float u_filterIndex;

    uniform float u_kernel9[9];
    uniform float u_kernel9Weight;
    uniform float u_kernel25[25];
    uniform float u_kernel25Weight;
    uniform float u_kernel49[49];
    uniform float u_kernel49Weight;
    uniform float u_kernel81[81];
    uniform float u_kernel81Weight;    

    in vec2 v_texCoord;
    
    out vec4 outColor;

    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
    } 

    // 
    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
        vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
        vec4 pixelColor = texture(u_image, v_texCoord);
        vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));                

        ${filterContent}

        ${convolutionString}

    }`
}

export function colorToVec4(color) {
    color = [ color.r/255, color.g/255, color.b/255, color.a || 0].map(toFloatString)
    return 'vec4(' +  color  + ')'
}

export function toFloatString(number) {
    if (number == Math.floor(number)) {
        return number + '.0';
    }

    return number;
}