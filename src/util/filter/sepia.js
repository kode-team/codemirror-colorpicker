import Color from '../Color'

export default function (buffer, i = 0) { 
    var r = buffer[i], g = buffer[i+1], b = buffer[i+2];

    buffer[i] = r * 0.3588 + g * 0.7044 + b * 0.1368;
    buffer[i+1] = r * 0.2990 + g * 0.5870 + b * 0.1140;
    buffer[i+2] = r * 0.2392 + g * 0.4696 + b * 0.0912;
  
}