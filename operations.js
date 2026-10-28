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

export function getGenerators(p) {
    if (!Number.isInteger(p) || p < 3) {
        throw new Error("Модуль має бути цілим числом p >= 3");
    }

    if (!isPrime(p)) {
        throw new Error("Модуль p повинен бути простим числом");
    }

    const order = p - 1;

    const primeFactors = [...primeFactorization(order).keys()];

    const generators = [];

    for (let g = 2; g < p; g++) {
        const isGenerator = primeFactors.every(q =>
            modPow(g, order / q, p) !== 1
        );

        if (isGenerator) {
            generators.push(g);
        }
    }

    return {
        order,
        generators,
        count: getPrimeNumAmount(order),
        primeFactors
    };
}

export function diffieHellman(p, g, A, B) {
    if (![p, g, A, B].every(Number.isSafeInteger)) {
        throw new Error("Усі значення мають бути цілими числами.");
    }

    if (!isPrime(p)) {
        throw new Error("Число p повинно бути простим.");
    }

    if (g < 2 || g >= p) {
        throw new Error("Генератор g повинен бути в межах від 2 до p - 1.");
    }

    if (A < 1 || B < 1) {
        throw new Error("Секретні числа A і B повинні бути додатними.");
    }

    const generatorData = getGenerators(p);

    if (!generatorData.generators.includes(g)) {
        throw new Error("Число g не є генератором для заданого p.");
    }

    const rA = modPow(g, A, p);
    const rB = modPow(g, B, p);

    const keyA = modPow(rB, A, p);
    const keyB = modPow(rA, B, p);

    return {
        rA,
        rB,
        keyA,
        keyB,
        keysMatch: keyA === keyB
    };
}

export function getRsaKeyPairs(n) {
    if (!Number.isInteger(n) || n < 2) {
        throw new Error("Модуль n має бути цілим числом >= 2");
    }

    const pairs = [];

    for (let x = 2; x < n; x++) {
        if (getNSD(x, n) !== 1) {
            continue;
        }

        const y = multiplicationInverse(x, n);

        if (x < y) {
            pairs.push({
                privateKey: x,
                publicKey: y
            });
        }
    }

    return {
        pairs,
        count: pairs.length
    };
}

const alphabets = {
    en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    uk: "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ"
};

export function rsaEncodeWord(word, alphabet = "en") {
    const letters = alphabets[alphabet];

    if (!letters) {
        throw new Error("Оберіть англійський або український алфавіт.");
    }

    const normalizedWord = word.toUpperCase();
    const characters = [...normalizedWord];

    if (characters.length !== 3) {
        throw new Error("Слово повинно містити рівно 3 літери.");
    }

    if (characters.some(letter => !letters.includes(letter))) {
        throw new Error("Слово містить недопустимі літери.");
    }

    if (new Set(characters).size !== 3) {
        throw new Error("Усі три літери повинні бути різними.");
    }

    return characters.map(letter => letters.indexOf(letter) + 1);
}

export function rsaEncryptNumbers(numbers, y, m) {
    validateRsaParameters(y, m);

    return numbers.map(number => {
        if (!Number.isSafeInteger(number) || number < 1 || number >= m) {
            throw new Error("Некоректний числовий код для шифрування.");
        }

        return modularPow(number, y, m);
    });
}

export function rsaDecryptNumbers(numbers, x, m) {
    validateRsaParameters(x, m);

    return numbers.map(number => {
        if (!Number.isSafeInteger(number) || number < 0 || number >= m) {
            throw new Error("Некоректне число шифротексту.");
        }

        return modularPow(number, x, m);
    });
}

export function rsaDecodeWord(numbers, alphabet = "en") {
    const letters = alphabets[alphabet];

    if (!letters) {
        throw new Error("Оберіть англійський або український алфавіт.");
    }

    return numbers.map(number => {
        if (!Number.isInteger(number) || number < 1 || number > letters.length) {
            throw new Error("Число не відповідає жодній літері алфавіту.");
        }

        return letters[number - 1];
    }).join("");
}

function validateRsaParameters(exponent, m) {
    if (!Number.isSafeInteger(exponent) || exponent < 1) {
        throw new Error("Ключ повинен бути додатним цілим числом.");
    }

    if (!Number.isSafeInteger(m) || m < 2) {
        throw new Error("Модуль шифрування повинен бути цілим числом не менше 2.");
    }
}

function mod(a, m) {
    return ((a % m) + m) % m;
}