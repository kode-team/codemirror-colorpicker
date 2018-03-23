import ImageFilter from '../src/util/ImageFilter'
import Color from '../src/util/Color'

test('image gray filter', () => {
    const colorCode = Color.parse('#255050');

    const buffer = [
        colorCode.r, colorCode.g, colorCode.b, 255,
        colorCode.r, colorCode.g, colorCode.b, 255
    ]

    const filter = ImageFilter.gray();

    var rgb = filter(buffer);

    expect(rgb).toEqual([ 73, 73, 73,  255,73, 73, 73,  255]);
});
