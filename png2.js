var fs = require('fs'),
    PNG = require('pngjs').PNG;


function guardValue(value) {
    if (value < 0) {
        return 0;
    }
    else if (value > 255) {
        return 255;
    }

    return value;
}

const Pixel = function(r, g, b, a) {

    return {
        r: guardValue(r),
        g: guardValue(g),
        b: guardValue(b),
        a: guardValue(a)
    }
}

const Image = function(width, height, sourceImage, sourceX, sourceY) {
    this.width = width;
    this.height = height;
    this.selections = {};
    this.file = new PNG({width: this.width, height: this.height});

    this.colorEachPixel(function(x, y, data) {
        return Pixel(x * 5, y * 5, 255 ,255)
    });

    if (sourceImage) {
        if (sourceX && sourceY) {
            this.colorEachPixel(function(x, y, data) {
                return sourceImage.get(x - sourceX, y - sourceY) || data;
            });
        }
        else {
            this.colorEachPixel(function(x, y, data) {
                return sourceImage.get(x, y) || data;
            });
        }
    }
}

Image.prototype.eachPixelPosition  = function(cb) {
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            cb(x, y);
        }
    }
}

Image.prototype.eachBorderPixelPosition  = function(cb) {
    const that = this;
    this.eachPixelPosition(function(x, y) {
        if (x == 0 || x == that.width-1 || y == 0 || y == that.height-1) {
            cb(x, y);
        }
    });
}

Image.prototype.colorEachPixel = function(cb) {
    const that = this;

    this.eachPixelPosition(function(x, y) {
        const newPixel = cb(x, y, that.get(x, y));
        if (newPixel) {
            that.set(x, y, newPixel);
        }
    });
}

Image.prototype.colorEachPixelInSelection = function(selectionName, cb) {
    const that = this;

    if (this.selections[selectionName]) {
        this.selections[selectionName].forEach(function(entry) {
            const newPixel = cb(entry.x, entry.y, that.get(entry.x, entry.y));
            if (newPixel) {
                that.set(entry.x, entry.y, newPixel);
            }
        });
    }
}

Image.prototype.colorEachBorderPixel = function(cb) {
    const that = this;

    this.eachBorderPixelPosition(function(x, y) {
        const newPixel = cb(x, y, that.get(x, y));
        if (newPixel) {
            that.set(x, y, newPixel);
        }
    });
}

Image.prototype.get = function(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
        return null
    }

    var idx = (this.width * y + x) << 2;
    return {
        r: this.file.data[idx],
        g: this.file.data[idx + 1],
        b: this.file.data[idx + 2],
        a: this.file.data[idx + 3]
    }
}

Image.prototype.set = function(x, y, pixel) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
        return null
    }

    var idx = (this.width * y + x) << 2;
    this.file.data[idx] = pixel.r;
    this.file.data[idx + 1] = pixel.g;
    this.file.data[idx + 2] = pixel.b;
    this.file.data[idx + 3] = pixel.a;
}

Image.prototype.invert = function() {
    this.colorEachPixel(function(x, y, data) {
        return Pixel(255 - data.r, 255 - data.g, 255 - data.b, 255);
    });
}

Image.prototype.invertBorder = function() {
    this.colorEachBorderPixel(function(x, y, data) {
        return Pixel(255 - data.r, 255 - data.g, 255 - data.b, 255);
    });
}

Image.prototype.grayscale = function() {
    this.colorEachPixel(function(x, y, data) {
        const value = (data.r + data.g + data.b) / 3;
        return Pixel(value, value, value, data.a);
    });
}

Image.prototype.tint = function(r, g, b) {
    this.colorEachPixel(function(x, y, data) {
        const value = (data.r + data.g + data.b) / 3;
        return Pixel(value / 255 * r, value / 255 * g, value / 255 * b, data.a);
    });
}

Image.prototype.tintPixels = function(r, g, b, selector) {
    this.colorEachPixel(function(x, y, data) {
        if (selector && !selector(x, y, data)) {
            return null;
        }
        const value = (data.r + data.g + data.b) / 3;
        return Pixel(value / 255 * r, value / 255 * g, value / 255 * b, data.a);
    });
}

Image.prototype.tintSelection = function(r, g, b, selectionName) {
    const that = this;

    this.colorEachPixelInSelection(selectionName, function(x, y, data) {
        const value = (data.r + data.g + data.b) / 3;
        return Pixel(value / 255 * r, value / 255 * g, value / 255 * b, data.a);
    });
}

Image.prototype.createSelection = function(selectionName, cb) {
    const that = this;

    const selectedPixels = [];

    this.eachPixelPosition(function(x, y) {
        if (cb(x, y, that.get(x, y), that.width, that.height)) {
            selectedPixels.push({
                x: x,
                y: y
            });
        }
    });

    this.selections[selectionName] = selectedPixels;
};

Image.prototype.pipe = function(stream) {
    return this.file.pack().pipe(stream)
}

image1 = new Image(32, 32);
image1.invert();
image2 = new Image(48, 48, image1, 8, 8);
image2.invertBorder();
image2.grayscale();
image2.createSelection('left', function(x, y, data, width, height) {
    return x < 24;
});

image2.tintPixels(255, 0, 0, function(x, y, data) {
    const value = (data.r + data.g + data.b) / 3;
    return value > 128;
});

image2.tintSelection(0, 255, 0, 'left');

image2.pipe(fs.createWriteStream('out2.png'))
  .on('finish', function() {
    console.log('Written!');
});


