import matrix from './matrix'

export default function shift () {

    return matrix(
        1.438,-0.062,-0.062,0,
        -0.122,1.378,-0.122,0,
        -0.016,-0.016,1.483,0,
        0,0,0,1
    );
}