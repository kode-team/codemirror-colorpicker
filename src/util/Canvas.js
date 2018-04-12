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
    }

}

export default Canvas;