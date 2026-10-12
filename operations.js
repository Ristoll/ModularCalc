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

export function getNSD(a,b) {
    console.log("youre in getNSD");
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
        throw new TypeError("Аргументи мають бути цілими числами");
    }
    a = Math.abs(a);
    b = Math.abs(b);

    if (a === 0 && b === 0) {
        throw new Error("НСД(0, 0) не визначений");
    }

    if (a === 0) return Math.abs(b);
    if (b === 0) return Math.abs(a);

    if(a < b) {
        let temp = a;
        a = b;
        b = temp;
    }
    
    while(mod(a,b) !== 0) {
        const r = mod(a, b);
        a = b;
        b = r;
    }

    return b;
}

export function generatePrime(a) {
    if (!Number.isInteger(a)) {
        throw new TypeError("Верхня межа має бути цілим числом");
    }

    if (a < 2) {
        throw new Error("Верхня межа має бути не меншою за 2");
    }

    if (a === 2) return 2;

    let p = a;

    if (p % 2 === 0) {
        p--;
    }

    while (p >= 3) {
        if (isPrime(p)) {
            return p;
        }

        p -= 2;
    }

    return 2;
}

export function getPrimeNumAmount(number) {
    if (!Number.isInteger(number) || number < 1) { 
        throw new Error("Число має бути натуральним"); 
    } 
    if (number === 1) { 
        return 1; 
    }

    const factors = primeFactorization(number);
    let result = 1;

    factors.forEach((power, base) => {
        result *= (base - 1) * Math.pow(base, power - 1);
    });

    return result;
}

/*export function getPrimeNumAmount(number) {
    if (!Number.isInteger(number) || number < 1) { 
        throw new Error("Число має бути натуральним"); 
    }
    if (number === 1) { 
        return 1; 
    }

    if(isPrime(number)) {
        return number-1;
    }
    const a = generatePrime(number);
    const b = number/a;
    if(Number.isInteger(b) && isPrime(b)){
        if(getNSD(a,b) == 1) {
            return (a-1)*(b-1);
        }
    }
    const power = findPower(number);
    if(power != null){
        if(isPrime(power.base)) {
            return (power.base - 1) * Math.pow(power.base,power.exponent - 1);
        }
    }

    const factors = primeFactorization(number);

    let result = 1;

    factors.forEach((power, base) => {
        result *= (base - 1) * Math.pow(base, power - 1);
    });

    return result;
}*/

export function multiplicationInverse(a, p) {
    if (!Number.isInteger(a) || !Number.isInteger(p) || p < 2) {
        throw new Error("Аргументи мають бути цілими числами, p >= 2");
    }

    if (getNSD(a, p) !== 1) {
        throw new Error("Оберненого елемента не існує");
    }

    const phi = getPrimeNumAmount(p);
    const exponent = phi - 1;

    let result = 1;
    let base = mod(a, p);
    let power = exponent;

    while (power > 0) {
        if (power % 2 === 1) {
            result = mod(result * base, p);
        }

        base = mod(base * base, p);
        power = Math.floor(power / 2);
    }

    return result;
}

function primeFactorization(n) {
    const primeFactors = new Map();

    for (let divisor = 2; divisor * divisor <= n; divisor++) {
        while (n % divisor === 0) {
            const currentPower = primeFactors.get(divisor) || 0;
            primeFactors.set(divisor, currentPower + 1);

            n /= divisor;
        }
    }

    if (n > 1) {
        primeFactors.set(n, (primeFactors.get(n) || 0) + 1);
    }

    return primeFactors;
}

/*function findPower(n) {
    if (!Number.isInteger(n) || n < 2) {
        return null;
    }

    for (let k = 2; k <= Math.log2(n); k++) {
        const p = Math.round(n ** (1 / k));

        if (p ** k === n) {
            return { base: p, exponent: k };
        }
    }

    return null;
}*/

function modPow(base, exponent, modulus) {
    let result = 1;
    base = mod(base, modulus);

    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = mod(result * base, modulus);
        }

        base = mod(base * base, modulus);
        exponent = Math.floor(exponent / 2);
    }

    return result;
}

export function isPrime(p) {
    if (!Number.isInteger(p)) {
        throw new TypeError("Аргумент має бути цілим числом");
    }

    if (p < 2) return false;
    if (p === 2 || p === 3) return true;

    const bases = [2, 3, 5];

    for (const a of bases) {
        if (a >= p) continue;

        if (getNSD(a, p) !== 1) {
            return false;
        }

        if (modPow(a, p - 1, p) !== 1) {
            return false;
        }
    }

    return true;
}

function mod(a, m) {
    return ((a % m) + m) % m;
}