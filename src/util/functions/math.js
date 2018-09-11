export function round (n, k) {
    k = typeof k == 'undefined' ? 1 : k; 
    return Math.round(n * k) / k;
}

export default {
    round
}