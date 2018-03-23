import Filter from '../src/util/Filter'
import Color from '../src/util/Color'

test('gray filter', () => {
    const colorCode = Color.parse('#255050');

    var rgb = Filter.gray([colorCode.r, colorCode.g, colorCode.b]);

    expect(rgb).toEqual([ 73, 73, 73 ]);
});
