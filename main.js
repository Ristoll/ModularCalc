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
const devisionBtn = document.getElementById("devision-btn");
const powBtn = document.getElementById("pow-btn");
const addInverseBtn = document.getElementById("add-inverse-btn");
const multInverseBtn = document.getElementById("mult-inverse-btn");

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
    if (!validateValues()) return;
    const result = operations.modularAddition(a, b, m);
    logger.log(a, b, "+", result);
})

subtractionBtn.addEventListener("click", () => {
    const {a, b, m} = getValues();
    if (!validateValues()) return;
    const result = operations.modularSubtraction(a, b, m);
    logger.log(a, b, "-", result);
})

multiplicationBtn.addEventListener("click", () => {
    const {a, b, m} = getValues();
    if (!validateValues()) return;
    const result = operations.modularMultiplication(a, b, m);
    logger.log(a, b, "*", result);
})

powBtn.addEventListener("click", () => {
    const {a, b, m} = getValues();
    if (!validateValues()) return;
    const result = operations.modularPow(a, b, m);
    logger.log(a, b, "^", result);
})

addInverseBtn.addEventListener("click", () => {
    const {a, m} = getValue();
    if (!validateValue()) return;
    const result = operations.additionInverse(a, m);
    logger.log(a, null, "-a", result);
})

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
    if (firstNum.value === "" || secondNum.value === "" || modulus.value === "") {
        errorMessage.textContent = "Заповніть всі поля.";
        return false;
    }

    if (Number(modulus.value) <= 0) {
        errorMessage.textContent = "Модуль повинен бути більшим за 0.";
        return false;
    }

    errorMessage.textContent = "";
    return true;
}

function validateValue() {
    if (firstNum.value === "" || modulus.value === "") {
        errorMessage.textContent = "Введіть A та модуль.";
        return false;
    }

    if (Number(modulus.value) <= 0) {
        errorMessage.textContent = "Модуль повинен бути більшим за 0.";
        return false;
    }

    errorMessage.textContent = "";
    return true;
}