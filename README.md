# Colorpicker With CodeMirror


This project was created to implement a color picker. It implemented basic functions for color and implemented image filters.

https://easylogic.github.com/codemirror-colorpicker/


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![](https://data.jsdelivr.com/v1/package/npm/codemirror-colorpicker/badge)](https://www.jsdelivr.com/package/npm/codemirror-colorpicker)

[![NPM](https://nodei.co/npm/codemirror-colorpicker.png)](https://npmjs.org/package/codemirror-colorpicker)



# Sample Image 

<img width="500px" src="https://easylogic.github.com/codemirror-colorpicker/resources/image/screen-shot.png" />



# Install 

## npm 

```npm
npm install codemirror-colorpicker
```

## bower 

```
bower install codemirror-colorpicker 
```   
   
# How to use (for  browser) 

```
<link rel="stylesheet" href="/codemirror-colorpicker/dist/codemirror-colorpciker.css/>
<script src="/codemirror-colorpicker/dist/codemirror-colorpicker.min.js"></script>
```

# How to use (for require, nodejs) 

after npm install 

## script 

```
require( 'codemirror-colorpicker' );

or 

// es6
import 'codemirror-colorpicker/dist/codemirror-colorpicker.css'
import 'codemirror-colorpicker' 
```

## style 

```
<link rel="stylesheet" href="/node_modules/codemirror-colorpicker/dist/codemirror-colorpicker.css">
```

# ColorPicker Options for CodeMirror

## Set option - View mode 

```javascript
{
  colorpicker : true
}
```

## Set option - Edit mode (open color picker)

```javascript
{
  colorpicker : {
      mode : 'edit'
  }
}
```

## Support short cut (for popup color picker) 

It can open color picker on current cursor.

```javascript
{
  colorpicker : {
      mode : 'edit'
  },
  extraKeys : {
        // when ctrl+k  keys pressed, color picker is able to open. 
        'Ctrl-K' : function (cm, event) {
            cm.state.colorpicker.popup_color_picker();
       }
  }
}
```

## Support custom color paletts (since v1.5)

You can set custom color paletts (ex : material, ...).

```javascript
{
  colorpicker : {
      mode : 'edit',
      colorSets: [
        { name : 'Material', colors : [ '#ffff', 'rgba(255, 255, 0, 0.5)' ] },
        { name : 'My Colors', colors : [ 'red', 'blue', 'white' ] },
        { name : 'Input Colors', edit: true  },   // editable 
      ]
  }
}
```

<img width="235px"   src="https://easylogic.github.com/codemirror-colorpicker/resources/image/colorpicker.png" align="absmiddle" />

<img width="235px"  src="https://easylogic.github.com/codemirror-colorpicker/resources/image/colorpaletts.png" align="absmiddle" />

## Support color scale  for palette 

```javascript
{
  colorpicker : {
      mode : 'edit',
      colorSets: [
        { name : 'Scale Colors', scale: ['red', 'yellow', 'black'], count : 5  }, 
      ]
  }
}

```

<img width="235px"   src="https://easylogic.github.com/codemirror-colorpicker/resources/image/scalecolors-title.png" align="absmiddle" />

<img width="235px"  src="https://easylogic.github.com/codemirror-colorpicker/resources/image/scalecolors.png" align="absmiddle" />

## Support Sketch Style 

```javascript
{
  colorpicker : {
      mode : 'edit',
      type: 'sketch'
  }
}

```

<img width="235px"  src="https://easylogic.github.com/codemirror-colorpicker/resources/image/sketch-type.png" align="absmiddle" />

## Support only Palette Style 

```javascript
{
  colorpicker : {
      mode : 'edit',
      type: 'palette'
  }
}

```

<img width="235px"  src="https://easylogic.github.com/codemirror-colorpicker/resources/image/palette-type.png" align="absmiddle" />

# Developments 

## local dev 

```
git clone https://github.com/easylogic/codemirror-colorpicker
cd codemirror-colorpicker
npm install 
npm run dev 
open localhost:10001 
```

## build 

```
npm run build 
```

# License : MIT 
