class ImageLoader {
    constructor(url) {
        this.isLoaded = false; 
        this.imageUrl = url; 
        this.initialize();
    }

    initialize () {
        this.canvas = this.createCanvas();
        this.context = this.canvas.getContext('2d');
    }

    createCanvas () {
        return document.createElement('canvas');
    }

    load (callback) {
        this.loadImage(callback);
    }

    loadImage (callback) {
        var ctx = this.context; 
        var img = new Image();
        img.onload = () => {
            var ratio = img.height / img.height;
            this.canvas.width = 100;
            this.canvas.height = 100 * ratio; 
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.canvas.width, this.canvas.height);
            this.isLoaded = true; 
            callback && callback();
        };

        this.getImageUrl(function (url) {
            img.src = url;
        });
    }

    getImageUrl (callback) {
        if (typeof this.imageUrl == 'string') {
            return callback(this.imageUrl);
        } else if (this.imageUrl instanceof Blob) {
            var reader = new FileReader();

            reader.onload = function (ev) {
                callback (ev.target.result);
            }

            reader.readAsDataURL(this.imageUrl);
        }
    }

    getRGBA (r, g, b, a) {
        return [r, g, b, a];
    }

    toArray(filter) {
        var imagedata = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        filter = filter || this.getRGBA;
        var rgba = imagedata.data ;
        var results = [];
        for (var i = 0, len = rgba.length; i < len; i += 4){
            var item = filter(rgba[i + 0],rgba[i + 1],rgba[i + 2],rgba[i + 3]);
            if (item) {
                results[results.length] = item;
            }
        }

        return results; 
    } 

    toRGB () {
        return this.toArray(function (r, g, b, a) {
            return [r, g, b];
        })
    }

}

export default ImageLoader;