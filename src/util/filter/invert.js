import Color from '../Color'

export default function (buffer, i = 0, opt = {scale : 1}) { 
  buffer[i] = 255 - buffer[i];     
  buffer[i+1] = 255 - buffer[i+1]; 
  buffer[i+2] = 255 - buffer[i+2]; 
  buffer[i+3] = 255; 
}