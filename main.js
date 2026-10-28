import * as operations from "./operations.js";
import * as logger from "./logger.js";

const modulus = document.getElementById("modulus");
const firstNum = document.getElementById("first-num");
const secondNum = document.getElementById("second-num");
const errorMessage = document.getElementById("error-message");

const clearBtn = document.getElementById("clear-btn");
const additionBtn = document.getElementById("addition-btn");
const subtractionBtn = document.getElementById("subtraction-btn");
const multiplicationBtn = document.getElementById("multiplication-btn");
const powBtn = document.getElementById("pow-btn");
const addInverseBtn = document.getElementById("add-inverse-btn");
const nsdBtn = document.getElementById("nsd-btn");
const primeBtn = document.getElementById("prime-btn");
const primeAmountBtn = document.getElementById("prime-amount-btn");
const multiplicationInverseBtn = document.getElementById("mult-inverse-btn");
const isPrimeBtn = document.getElementById("is-prime-btn");
const largestPrimeBtn = document.getElementById("largest-prime-btn");
const findGeneratorsBtn = document.getElementById("find-generators-btn");
const diffieHelmanBtn = document.getElementById("diffie-helman-btn");

clearBtn.addEventListener("click", () => {
    modulus.value = null;
    modulus.textContent = null;
    firstNum.value = null;
    firstNum.textContent = null;
    secondNum.value = null;
    secondNum.value = null;
    logger.clearLog();
});

additionBtn.addEventListener("click", () => {
    const {a, b, m} = getValues();
    if (!validateValues() || !validateValueForModulOp()) return;
    const result = operations.modularAddition(a, b, m);
    logger.log(a, b, "+", result);
})

subtractionBtn.addEventListener("click", () => {
    const {a, b, m} = getValues();
    if (!validateValues() || !validateValueForModulOp()) return;
    const result = operations.modularSubtraction(a, b, m);
    logger.log(a, b, "-", result);
})

multiplicationBtn.addEventListener("click", () => {
    const {a, b, m} = getValues();
    if (!validateValues() || !validateValueForModulOp()) return;
    const result = operations.modularMultiplication(a, b, m);
    logger.log(a, b, "*", result);
})

powBtn.addEventListener("click", () => {
    const {a, b, m} = getValues();
    if (!validateValues() || !validateValueForModulOp()) return;
    const result = operations.modularPow(a, b, m);
    logger.log(a, b, "^", result);
})

addInverseBtn.addEventListener("click", () => {
    const {a, m} = getValue();
    if (!validateValue() || !validateValueForModulOp()) return;
    const result = operations.additionInverse(a, m);
    logger.log(a, null, "-a", result);
})

nsdBtn.addEventListener("click", () => {
    const {a, b} = getValues();
    if (!validateValues()) return;
    const result = operations.getNSD(a, b);
    logger.log(a, b, "nsd", result);
})

primeBtn.addEventListener("click", () => {
    const a = Number(firstNum.value);
    if(!validateValue()) return;
    const result = operations.generatePrime(a);
    logger.log(a, null, "prime", result);
})

primeAmountBtn.addEventListener("click", () => {
    const a = Number(firstNum.value);
    if(!validateValue()) return;
    const result = operations.getPrimeNumAmount(a);
    logger.log(a, null, "primeAmount", result);
})

multiplicationInverseBtn.addEventListener("click", () => {
    const {a, m} = getValue();
    if (!validateValue() || !validateValueForModulOp()) return;
    const result = operations.multiplicationInverse(a, m);
    logger.log(a, null, "1/a", result);
})

isPrimeBtn.addEventListener("click", () => {
    const a = Number(firstNum.value);
    if(!validateValue()) return;
    const result = operations.isPrime(a);
    logger.log(a, null, "isPrime", result);
})

largestPrimeBtn.addEventListener("click", () => {
    const a = Number(firstNum.value);
    if(!validateValue()) return;
    const result = operations.generatePrime(a);
    logger.log(a, null, "largestPrime", result);
})

findGeneratorsBtn.addEventListener("click", () => {
    if (modulus.value.trim() === "") {
        errorMessage.textContent = "Введіть модуль p.";
        return;
    }

    const p = Number(modulus.value);

    if (!Number.isInteger(p) || p < 3) {
        errorMessage.textContent =
            "Модуль p має бути цілим числом не меншим за 3.";
        return;
    }

    try {
        const result = operations.getGenerators(p);

        errorMessage.textContent = "";

        logger.log(p, null, "Порядок групи", result.order);
        logger.log(
            p,
            null,
            "Генератори",
            result.generators.join(", ")
        );
        logger.log(
            p,
            null,
            "Кількість генераторів",
            result.count
        );
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

diffieHelmanBtn.addEventListener("click", () => {
    window.location.href = "./diffie-hellman.html";
});

function getValues() {
    return {
        a: Number(firstNum.value),
        b: Number(secondNum.value),
        m: Number(modulus.value)
    };
}

function getValue() {
    return {
        a: Number(firstNum.value),
        m: Number(modulus.value)
    };
}

function validateValues() {
    if (firstNum.value === "" || secondNum.value === "") {
        errorMessage.textContent = "Заповніть всі поля.";
        return false;
    }

    errorMessage.textContent = "";
    return true;
}

function validateValue() {
    if (firstNum.value === "") {
        errorMessage.textContent = "Введіть A та модуль.";
        return false;
    }

    errorMessage.textContent = "";
    return true;
}

function validateValueForModulOp() {
    if (Number(modulus.value) <= 0) {
        errorMessage.textContent = "Модуль повинен бути більшим за 0.";
        return false;
    }

    return true;
}
