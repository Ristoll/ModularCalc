import * as operations from "./operations.js";

const backBtn = document.getElementById("back-btn");

const pInput = document.getElementById("dh-p");
const gInput = document.getElementById("dh-g");
const aInput = document.getElementById("dh-a");
const bInput = document.getElementById("dh-b");

const rAOutput = document.getElementById("dh-rA");
const rBOutput = document.getElementById("dh-rB");
const keyAOutput = document.getElementById("dh-keyA");
const keyBOutput = document.getElementById("dh-keyB");

const calculateBtn = document.getElementById("dh-calculate");
const clearBtn = document.getElementById("dh-clear");
const errorOutput = document.getElementById("dh-error");
const resultOutput = document.getElementById("dh-result");

calculateBtn.addEventListener("click", () => {
    errorOutput.textContent = "";
    resultOutput.textContent = "";

    const fields = [pInput, gInput, aInput, bInput];

    if (fields.some(input => input.value.trim() === "")) {
        errorOutput.textContent = "Заповніть усі поля.";
        return;
    }

    const p = Number(pInput.value);
    const g = Number(gInput.value);
    const A = Number(aInput.value);
    const B = Number(bInput.value);

    try {
        const result = operations.diffieHellman(p, g, A, B);

        rAOutput.textContent = result.rA;
        rBOutput.textContent = result.rB;
        keyAOutput.textContent = result.keyA;
        keyBOutput.textContent = result.keyB;

        resultOutput.textContent = result.keysMatch
            ? `Ключі збігаються. Спільний ключ K = ${result.keyA}.`
            : "Помилка: ключі не збігаються.";
    } catch (error) {
        errorOutput.textContent = error.message;
    }
});

clearBtn.addEventListener("click", () => {
    [pInput, gInput, aInput, bInput].forEach(input => {
        input.value = "";
    });

    [rAOutput, rBOutput, keyAOutput, keyBOutput].forEach(output => {
        output.textContent = "—";
    });

    errorOutput.textContent = "";
    resultOutput.textContent = "";
});

backBtn.addEventListener("click", () => {
    window.location.href = "./index.html";
});
