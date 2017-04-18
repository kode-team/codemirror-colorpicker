# CodeMirror Colorpicker Addon 

CodeMirror ColorPicker Addon like Chrome devtool style  

# How to use 

```
<link rel="stylesheet" href="addon/colorpicker/colorpicker.css/>
<script src="addon/colorpicker/colorview.js"></script>
<script src="addon/colorpicker/colorpicker.js"></script>
```

## Set option - View mode 

```javascript
{
  colorpicker : true
}
```

## Set option - Edit mode (open color picker)

```javascript
colorpicker {
    mode : 'edit'
}
```

## Support short cut (for popup color picker) 

```javascript
colorpicker {
    mode : 'edit'
},
extraKeys : {
      // when ctrl+k  keys pressed, color picker is able to open. 
      'Ctrl-K' : function (cm, event) {
          cm.state.colorpicker.popup_color_picker();
     }
}
```

# Sample demo - View mode 

<img src="http://i.giphy.com/l3q2SDCDRUCaTiEKs.gif" />

# Sample demo - Edit mode 

<img src="http://i.giphy.com/26xBI1fdHFsAjCwqQ.gif" />


# Sample Page 

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
