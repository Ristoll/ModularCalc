export function modularAddition(a, b, m) {
    return mod(a + b, m);
}

export function modularSubtraction(a, b, m) {
    return mod(a - b, m);
}

export function modularMultiplication(a, b, m) {
    return mod(a * b, m);
}

export function modularPow(a, b, m) {
    let result = 1;

    for (let i = 0; i < b; i++) {
        result = mod(result * a, m);
    }

    return result;
}

export function additionInverse(a, m) {
    return mod(-a, m);
}

function mod(a, m) {
    return ((a % m) + m) % m;
}