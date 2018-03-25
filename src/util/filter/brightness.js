import Color from '../Color'

export default function (buffer, i = 0, opt = {scale : 3}) { 
  buffer[i] += opt.scale/3;
  buffer[i+1] += opt.scale/3;
  buffer[i+2] += opt.scale/3;

}