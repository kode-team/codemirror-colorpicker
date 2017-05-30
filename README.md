# CodeMirror Colorpicker Addon 

CodeMirror ColorPicker Addon like Chrome devtool style  
   
# How to use (for  html) 

```
<link rel="stylesheet" href="/codemirror-colorpicker/addon/colorpicker/colorpicker.css/>
<script src="/codemirror-colorpicker/addon/colorpicker/colorview.js"></script>
<script src="/codemirror-colorpicker/addon/colorpicker/colorpicker.js"></script>
```

# How to use (for require, browserify, nodejs) 

after npm install 

## script 

```
require( 'codemirror-colorpicker/addon/colorpicker/colorpicker' );
require( 'codemirror-colorpicker/addon/colorpicker/colorview' );
```

## style 

```
<link rel="stylesheet" href="/node_modules/codemirror-colorpicker/addon/colorpicker/colorpicker.css">
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

# Samples

## Sample demo - View mode 

<img src="http://i.giphy.com/l3q2SDCDRUCaTiEKs.gif" />

## Sample demo - Edit mode 

<img src="http://i.giphy.com/26xBI1fdHFsAjCwqQ.gif" />


## Sample Page 

https://store.jui.io/v2/view.php?id=58930a1a94976c9b562541a6

# Install 

## npm 

```npm
npm install codemirror-colorpicker
```

## bower 

```
bower install codemirror-colorpicker 
```

# License : MIT 
