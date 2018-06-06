const R = require('ramda');

const boxes = [
    { x: 0, y: 0, width: 10, height: 10},
    { x: 10, y: 10, width: 10, height: 10},
    { x: 5, y: 5, width: 10, height: 10}
];

const enrichBoxes = R.memoizeWith(
    R.identity,
    R.map(function enrichBox(box) {

        return R.merge(box, {
            x1: box.x,
            y1: box.y,
            x2: box.x + box.width,
            y2: box.y + box.height
        });
    })
);

const pairBoxIndeces = function(length) {
    const created = R.map(function(index) {

        return R.map(function(secondIndex) {

            return {
                a: index,
                b: secondIndex
            }

        })(R.times(R.identity, length));

    }) (R.times(R.identity, length))

    const flatList = R.flatten(created);

    return R.filter(function(entry) {
        return entry.a != entry.b && entry.a < entry.b;
    })(
        flatList
    );
};

const createCollisionChecks = function(boxes) {

    return R.map(
            function(entry) {
                return {
                    a: enrichBoxes(boxes)[entry.a],
                    b: enrichBoxes(boxes)[entry.b]
                };
            }
        )
        (
            pairBoxIndeces(
                boxes.length
            )
        );
};

console.log(
    createCollisionChecks(boxes)
);
