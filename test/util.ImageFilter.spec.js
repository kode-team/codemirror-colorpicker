import ImageFilter from '../src/util/ImageFilter'
import Color from '../src/util/Color'

test('image gray filter', () => {
    const colorCode = Color.parse('#255050');

    const buffer = [
        colorCode.r, colorCode.g, colorCode.b, 255
    ]

    const filter = ImageFilter.grayscale();

    var rgb = filter(buffer);

    expect(rgb).toEqual([ 71, 71, 71,  255]);
});
