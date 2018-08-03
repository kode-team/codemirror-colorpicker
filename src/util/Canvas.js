import Color from './Color'

function each(len, callback) {
    for (var i = 0; i < len; i += 4) {
        callback(i);
    }
}

function pack(bitmap, callback) {

    each(bitmap.pixels.length, (i) => {
        callback(bitmap.pixels, i)
    })
}

const Canvas = {

    create (width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width || 0;
        canvas.height = height || 0;

        return canvas; 
    },

    drawPixels(bitmap) {
        var canvas = this.create(bitmap.width, bitmap.height);

        var context = canvas.getContext('2d');
        var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

        imagedata.data.set(bitmap.pixels);

        context.putImageData(imagedata, 0, 0);

        return canvas;
    },

    createHistogram (width, height, histogram, callback, opt = { black: true, red: false, green : false, blue: false}) {
        var canvas = this.create(width, height)
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, width, height)
        context.fillStyle = "white"
        context.fillRect(0, 0, width, height)
        context.globalAlpha = 0.7

        var omit = { black: false }
        if (opt.black) {omit.black = false  } else {omit.black = true}
        if (opt.red) {omit.red = false  } else {omit.red = true}
        if (opt.green) {omit.green = false  } else {omit.green = true}
        if (opt.blue) {omit.blue = false  } else {omit.blue = true} 


        Object.keys(histogram).forEach(color => {

            if (!omit[color]) {

                var array = histogram[color]
                const ymax = Math.max.apply(Math, array)
                const unitWith = width / array.length 
    
                context.fillStyle = color
                array.forEach((it, index) => {
                    const currentHeight = height * (it / ymax) 
                    const x = index * unitWith 
        
                    context.fillRect(x, height - currentHeight, unitWith, currentHeight);
                });
            }

        })


        if (typeof callback == 'function') callback(canvas)

    },

    getHistogram (bitmap) {
        let black = new Array(256)
        let red = new Array(256)
        let green = new Array(256)
        let blue = new Array(256)
        for(var i = 0; i < 256; i++) {
            black[i] = 0
            red[i] = 0
            green[i] = 0
            blue[i] = 0
        }

        pack(bitmap, (pixels, i) => {
            // gray scale 
            const grayIndex = Math.round(Color.brightness(pixels[i], pixels[i+1], pixels[i+2]))
            black[grayIndex]++

            red[pixels[i]]++
            green[pixels[i+1]]++
            blue[pixels[i+2]]++

        })

        return {black, red, green, blue } 
    },

    getBitmap(bitmap, area) {
        var canvas = this.drawPixels(bitmap);

        var context = canvas.getContext('2d');
        var pixels = context.getImageData(area.x || 0, area.y || 0, area.width || canvas.width, area.height || canvas.height).data;

        return { pixels, width: area.width, height: area.height };
    },

    putBitmap(bitmap, subBitmap, area) {

        var canvas = this.drawPixels(bitmap);
        var subCanvas = this.drawPixels(subBitmap);

        var context = canvas.getContext('2d');
        context.drawImage(subCanvas, area.x, area.y);

        bitmap.pixels = context.getImageData(0, 0, bitmap.width, bitmap.height).data;

        return bitmap;
    },

    controlPointsFromPoints (points) {
        let count = points.length - 1
        let firstControlPoints = [] 
        let secondControlPoints = [] 

        if (count == 1) {
            let P0 = points[0]
            let P3 = points[1] 

            let P1x = (2 * P0.x + P3.x) / 3 
            let P1y = (2 * P0.y + P3.y) / 3 

            firstControlPoints.push({ x : P1x, y : P1y })

            let P2x = (2 * P1x - P0.x) 
            let P2y = (2 * P1y - P0.y) 

            secondControlPoints.push({ x : P2x, y : P2y } )
        } else {
            firstControlPoints = new Array(count)

            var rhsArray = [] 

            var a = []
            var b = []
            var c = [] 

            for (var i = 0; i < count; i++) {

                var rhsValueX = 0 
                var rhsValueY = 0 

                let P0 = points[i]
                let P3 = points[i+1]

                if (i == 0) {
                    a.push(0)
                    b.push(2)
                    c.push(1)

                    rhsValueX = P0.x + 2 * P3.x; 
                    rhsValueY = P0.y + 2 * P3.y; 
                } else if (i == count - 1) {
                    a.push(2)
                    b.push(7)
                    c.push(0)

                    rhsValueX = 8 * P0.x + P3.x 
                    rhsValueY = 8 * P0.y + P3.y
                } else {
                    a.push(1)
                    b.push(4)
                    c.push(1)

                    rhsValueX = 4 * P0.x + P3.x 
                    rhsValueY = 4 * P0.y + P3.y 
                }

                rhsArray.push({ x : rhsValueX, y : rhsValueY })
            }


            for (var i = 1; i < count; i++) {
                let rhsValueX = rhsArray[i].x 
                let rhsValueY = rhsArray[i].y
                
                let prevRhsValueX = rhsArray[i-1].x 
                let prevRhsValueY = rhsArray[i-1].y 

                let m = a[i] / b[i-1] 

                let b1 = b[1] - m * c[i-1]; 
                b[i] = b1 

                let r2x = rhsValueX - m * prevRhsValueX
                let r2y = rhsValueY - m * prevRhsValueY

                rhsArray[i] = { x : r2x, y : r2y }
            }


            let lastControlPointX = rhsArray[count-1].x / b[count-1]
            let lastControlPointY = rhsArray[count-1].y / b[count-1]

            firstControlPoints[count-1] = {x : lastControlPointX, y : lastControlPointY }

            for( var i = count - 2 ; i >= 0; --i ) {
                let nextControlPoint = firstControlPoints[i+1]
                if (nextControlPoint) {
                    let controlPointX = (rhsArray[i].x - c[i] * nextControlPoint.x) / b[i]
                    let controlPointY = (rhsArray[i].y - c[i] * nextControlPoint.y) / b[i]

                    firstControlPoints[i] = { x : controlPointX, y : controlPointY }
                }
            }

            for (var i = 0; i < count ; i++ )  {
                if (i == count - 1 ) {
                    let P3 = points[i+1] 
                    let P1 = firstControlPoints[i] 

                    if (!P1) {
                        continue; 
                    }

                    let controlPointX = (P3.x + P1.y) / 2 
                    let controlPointY = (P3.y + P1.y) / 2 

                    secondControlPoints.push( { x: controlPointX, y : controlPointY })

                } else {
                    let P3 = points[i+1]
                    let nextP1 = firstControlPoints[i+1]

                    if (!nextP1) {
                        continue;
                    }

                    let controlPointX = 2 * P3.x - nextP1.x 
                    let controlPointY = 2 * P3.y - nextP1.y 

                    secondControlPoints.push( { x : controlPointX, y : controlPointY })
                }
            }

        }


        var controlPoints = [] 

        for (var i = 0; i < count; i++ ) {
            let firstControlPoint = firstControlPoints[i]
            let secondControlPoint = secondControlPoints[i]

            if (firstControlPoint && secondControlPoint) {
                let segment = { controlPoint1: firstControlPoint, controlPoint2: secondControlPoint }
                controlPoints.push(segment) 
            }
        }

        return controlPoints        
    },

    drawCurve (width, height, points = [], canvasOption = {}) {


        var canvas = this.create(width, height)
        const context = canvas.getContext('2d')

        if (!points.length) return canvas;        

        let controlPoints = this.controlPointsFromPoints(points)
        let lines = [] 
        Object.assign(context, {
            lineWidth: 1,
            strokeStyle: 'black'
        }, canvasOption)
        context.clearRect(0, 0, width, height) 
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height)
        context.beginPath()
        for (var i = 0, len = points.length; i < len; i++) {
            let point = points[i]

            if (i == 0) {
                context.moveTo(point.x, point.y)
            } else {
                let segment = controlPoints[i-1]
                context.bezierCurveTo(
                    segment.controlPoint1.x, segment.controlPoint1.y, 
                    segment.controlPoint2.x, segment.controlPoint2.y, 
                    point.x, point.y 
                );

                lines.push( [1, points[i-1] , segment.controlPoint1 ]  )
                lines.push( [2, point , segment.controlPoint2 ]  )
            }
        }

        context.stroke()

        return canvas 

        lines.forEach(line => {
            if (line[0] == 1) { // first 
                context.strokeStyle = 'blue'
                context.beginPath()
                context.moveTo(line[1].x, line[1].y)
                context.lineTo(line[2].x, line[2].y)
                context.closePath()
                context.stroke()

                context.beginPath()
                context.arc(line[2].x, line[2].y, 5, Math.PI * 2, false) 
                context.closePath()
                context.stroke()                
            }else {     // second
                context.strokeStyle = 'red'
                context.beginPath()
                context.moveTo(line[1].x, line[1].y)
                context.lineTo(line[2].x, line[2].y)
                context.closePath()
                context.stroke()

                context.beginPath()
                context.arc(line[2].x, line[2].y, 5, Math.PI * 2, false) 
                context.closePath()
                context.stroke()                
            }
        })
 

        return canvas;
    }

}

export default Canvas;