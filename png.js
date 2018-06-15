var fs = require('fs'),
    PNG = require('pngjs').PNG;

function mix(idx, imageData1, imageData2, targetData) {
    targetData[idx] = (imageData1[idx] + imageData2[idx]) / 2;
    targetData[idx+1] = (imageData1[idx+1] + imageData2[idx+1]) / 2;
    targetData[idx+2] = (imageData1[idx+2] + imageData2[idx+2]) / 2;
    targetData[idx+3] = (imageData1[idx+3] + imageData2[idx+3]) / 2;
}

function guardValue(value) {
    if (value < 0) {
        return 0;
    }
    else if (value > 255) {
        return 255;
    }

    return value;
}

function add(idx, imageData1, imageData2, targetData) {
    targetData[idx] = guardValue(imageData1[idx] + imageData2[idx]);
    targetData[idx+1] = guardValue(imageData1[idx+1] + imageData2[idx+1]);
    targetData[idx+2] = guardValue(imageData1[idx+2] + imageData2[idx+2]);
    targetData[idx+3] = imageData1[idx+3];
}

function sub(idx, imageData1, imageData2, targetData) {
    targetData[idx] = guardValue(imageData1[idx] - imageData2[idx]);
    targetData[idx+1] = guardValue(imageData1[idx+1] - imageData2[idx+1]);
    targetData[idx+2] = guardValue(imageData1[idx+2] - imageData2[idx+2]);
    targetData[idx+3] = imageData1[idx+3];
}

fs.createReadStream('test.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function(imageData1) {

        fs.createReadStream('test2.png')
        .pipe(new PNG({
            filterType: 4
        }))
        .on('parsed', function(imageData2) {

            var newfile = new PNG({width: this.width, height: this.height});

            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    add(idx, imageData1, imageData2, newfile.data);
                }
            }

            newfile.pack()
              .pipe(fs.createWriteStream('out.png'))
              .on('finish', function() {
                console.log('Written!');
            });

        });
    });
