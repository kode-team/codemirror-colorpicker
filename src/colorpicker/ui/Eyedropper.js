
import UIElement from '../UIElement';
import './Eyedropper.scss';
import { enableEyeDropper } from '../../util/functions/support';

export default class Eyedropper extends UIElement {

  template() {
    return /*html*/`
      <nav class="el-cp-color-eyedropper">
        <button type="button" ref="$button" title="Eyedropper">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.797 18.344c-.019.001-.074-.009-.24-.065-.277-.094-.745-.25-1.137.141l-1.542 1.543a.595.595 0 0 1-.84-.84L5.58 17.58c.391-.39.235-.859.141-1.14-.045-.134-.06-.195-.072-.206-.002-.003-.005-.003-.007-.001l1.06-1.06.703.705a.432.432 0 1 0 .611-.611l-.703-.705.557-.557.703.703a.434.434 0 0 0 .611 0 .434.434 0 0 0 0-.61l-.703-.703.571-.572.703.704a.435.435 0 0 0 .612 0 .434.434 0 0 0 0-.61l-.705-.706L14 7.875l2.126 2.127-8.33 8.342zM19.29 9.37l-.654-.655 1.669-1.668a2.372 2.372 0 0 0-3.353-3.354l-1.669 1.669-.655-.654a1.341 1.341 0 0 0-1.898 1.897l.658.658-8.358 8.359c-.373.373-.214.841-.13 1.094.061.18.069.24.069.253l-1.543 1.542a1.458 1.458 0 1 0 2.062 2.061l1.536-1.54c.019-.003.08.006.259.066.252.085.72.243 1.093-.13l8.359-8.358.658.658a1.341 1.341 0 1 0 1.897-1.898z" fill="currentColor"/>
          </svg>
        </button>
      </nav>
    `;
  }

  ['click $button']() {
    if (enableEyeDropper) {
      const eyeDropper = new EyeDropper();
      eyeDropper.open().then(result => {
        this.$store.dispatch('/changeColor', result.sRGBHex);
        this.$store.emit('lastUpdateColor');        
      })


    }
  }

}