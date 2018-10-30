import BasePropertyItem from "./BasePropertyItem";
import Dom from "../../../../../util/Dom";
import { parseParamNumber } from "../../../../../util/filter/functions";

export default class ClipPathImageResource extends BasePropertyItem {
    template () {
        return `
            <div class='property-item image-resource show'>
                <div class='items' ref="$imageList">

                </div>
            </div>
        `
    }

    'load $imageList' () {
        return this.read('/svg/list').map((svg, index) => {
            if (typeof svg == 'object') {
                return `<div class='svg-item' data-key="${svg.key}">${svg.svg}</div>`
            }  else {
                return `<div class='svg-item' data-index="${index}">${svg}</div>`
            }
            
        })
    }

    refresh () {
        this.load();
    }

    '@changeSvgList' () {
        this.refresh()
    }

    '@toggleClipPathImageResource' () {
        this.$el.toggleClass('show')
    }

    setClipPathSvg (layer, svg, callback) {

        layer.clipPathSvg = svg; 

        var $temp = new Dom('div')
        $temp.html(svg);

        var $svg = $temp.$("svg");

        var width = 0;
        var height = 0; 
        if ($svg.attr('width')) {
            width = parseParamNumber($svg.attr('width'))
        } 

        if ($svg.attr('height')) {
            height = parseParamNumber($svg.attr('height'))
        }         

        if ($svg.attr('viewBox')) {
            var box = $svg.attr('viewBox').split(' ');

            width = parseParamNumber(box[2])
            height = parseParamNumber(box[3])
        }

        layer.clipPathSvgWidth = width; 
        layer.clipPathSvgHeight = height; 

        $temp.remove();

        callback && callback ();
    }

    'click $imageList .svg-item' (e) {
        var index = e.$delegateTarget.attr('data-index')
        var key = e.$delegateTarget.attr('data-key')

        if (index) {
            this.read('/item/current/layer', (layer) => {
                var svg = this.read('/svg/get', +index);

                this.setClipPathSvg(layer, svg, () => {
                    this.dispatch('/item/set', layer);
                });


            })
        } else if (key) {

            this.read('/item/current/layer', (layer) => {
                var svg = this.read('/svg/get', Number.MAX_SAFE_INTEGER, key);

                this.setClipPathSvg(layer, svg, () => {
                    this.dispatch('/item/set', layer);
                });

            })
        } 

    }

}