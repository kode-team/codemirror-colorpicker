export default function (src, sw, sh, weights, opaque = true) {
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side/2);

  const w = sw;
  const h = sh;
  let dst = new Uint8ClampedArray(src.length);
  const alphaFac = opaque ? 1 : 0;

  for(var y = 0; y < h; y++ ) {
    for (var x = 0; x < w; x++) {
      const sy = y;
      const sx = x;
      const dstIndex = (y * w + x ) * 4;

      var r = 0, g = 0, b = 0, a = 0;
      for (var cy = 0; cy < side; cy++) {
        for (var cx = 0; cx < side; cx++) {

          const scy = sy + cy - halfSide;
          const scx = sx + cx - halfSide;

          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcIndex = ( scy * sw + scx ) * 4;
            var wt = weights[ cy * side + cx];
            r += src[srcIndex] * wt;
            g += src[srcIndex+1] * wt;
            b += src[srcIndex+2] * wt;
            a += src[srcIndex+3] * wt;   // weight 를 곱한 값을 계속 더한다. 
          }
        }
      }

      dst[dstIndex] = r;
      dst[dstIndex+1] = g;
      dst[dstIndex+2] = b;
      dst[dstIndex+3] = a + alphaFac*(255-a);
    }
  }

  return dst;

}