# CodeMirror Colorpicker Addon 

CodeMirror ColorPicker Addon like Chrome devtool style  

[![](https://data.jsdelivr.com/v1/package/npm/codemirror-colorpicker/badge)](https://www.jsdelivr.com/package/npm/codemirror-colorpicker)
   

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

## Support custom color sets (since v1.5)

You can set custom color sets (ex : material, ...).

```javascript
{
  colorpicker : {
      mode : 'edit',
      colorSets: [
        { name : 'Material', colors : [ '#ffff', 'rgba(255, 255, 0, 0.5)' ] },
        { name : 'My Colors', colors : [ 'red', 'blue', 'white' ] },
        { name : 'Input Colors', edit: true  },
      ]
  }
}
```


# Samples

## Sample demo - View mode 

<img src="http://i.giphy.com/l3q2SDCDRUCaTiEKs.gif" />

## Sample demo - Edit mode 

<img src="http://i.giphy.com/26xBI1fdHFsAjCwqQ.gif" />


## Sample Page 

https://store.jui.io/v2/view.php?id=58930a1a94976c9b562541a6


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
