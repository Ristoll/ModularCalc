import {
    getGenerators, generateElGamalKeys, elGamalEncryptMessage, elGamalDecryptMessage } from "./operations.js";

const pInput = document.getElementById("p");
const gInput = document.getElementById("g");
const xInput = document.getElementById("x");

const generatorsResult = document.getElementById("generatorsResult");
const keysResult = document.getElementById("keysResult");
const encryptionResult = document.getElementById("encryptionResult");
const decryptionResult = document.getElementById("decryptionResult");
const errorResult = document.getElementById("errorResult");

let publicKey = null;
let encryptedMessages = null;
let currentAlphabet = null;

const alphabets = {
    en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    uk: "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ"
};

function encodeWord(word) {
    const normalizedWord = word.toUpperCase();
    const characters = [...normalizedWord];

    if (characters.length !== 3) {
        throw new Error("Повідомлення повинно містити три літери.");
    }

    const alphabet = characters.every(letter => alphabets.uk.includes(letter))
        ? alphabets.uk
        : characters.every(letter => alphabets.en.includes(letter))
            ? alphabets.en
            : null;

    if (!alphabet) {
        throw new Error("Використовуйте літери одного алфавіту.");
    }

    if (new Set(characters).size !== 3) {
        throw new Error("Усі три літери повинні бути різними.");
    }

    currentAlphabet = alphabet;

    return characters.map(letter => alphabet.indexOf(letter) + 1);
}

function decodeWord(numbers) {
    return numbers.map(number => {
        if (!Number.isInteger(number) ||
            number < 1 ||
            number > currentAlphabet.length) {
            throw new Error("Некоректний код літери.");
        }

        return currentAlphabet[number - 1];
    }).join("");
}

document.getElementById("findGenerators").addEventListener("click", () => {
    try {
        errorResult.textContent = "";

        const p = Number(pInput.value);
        const result = getGenerators(p);

        generatorsResult.innerHTML = `
            <p>Порядок групи: ${result.order}</p>
            <p>Кількість генераторів: ${result.count}</p>
            <p>Перші три генератори: ${result.generators.slice(0, 3).join(", ")}</p>
        `;

    } catch (error) {
        errorResult.textContent = error.message;
    }
});

document.getElementById("generateKeys").addEventListener("click", () => {
    try {
        errorResult.textContent = "";

        const p = Number(pInput.value);
        const g = Number(gInput.value);
        const x = Number(xInput.value);

        const keys = generateElGamalKeys(p, g, x);

        publicKey = keys.publicKey;
        encryptedMessages = null;

        encryptionResult.innerHTML = "";
        decryptionResult.innerHTML = "";

        keysResult.innerHTML = `
            <h3>Результати генерації ключів</h3>
            <p>Відкриті параметри:</p>
            <p>p = ${p}</p>
            <p>g = ${g}</p>
            <p>y = ${keys.publicKey}</p>
            <p>Закритий ключ:</p>
            <p>x = ${keys.privateKey}</p>
        `;

    } catch (error) {
        errorResult.textContent = error.message;
    }
});

document.getElementById("encrypt").addEventListener("click", () => {
    try {
        errorResult.textContent = "";

        if (publicKey === null) {
            throw new Error("Спочатку потрібно згенерувати ключі.");
        }

        const p = Number(pInput.value);
        const g = Number(gInput.value);

        const numbers = encodeWord(
            document.getElementById("message").value
        );

        const sessionKeys = [
            Number(document.getElementById("k1").value),
            Number(document.getElementById("k2").value),
            Number(document.getElementById("k3").value)
        ];

        const encrypted = elGamalEncryptMessage(
            numbers, p, g, publicKey, sessionKeys
        );

        encryptedMessages = encrypted;

        encryptionResult.innerHTML = `
            <h3>Результати шифрування</h3>

            ${encrypted.map(item => `
                <p>
                    Сеанс ${item.session}:
                    M = ${item.message},
                    k = ${item.sessionKey}
                </p>
                <p>a = ${item.a}, b = ${item.b}</p>
                <p>Шифротекст: (${item.a}, ${item.b})</p>
                <hr>
            `).join("")}
        `;

        decryptionResult.innerHTML = "";

    } catch (error) {
        errorResult.textContent = error.message;
    }
});

document.getElementById("decrypt").addEventListener("click", () => {
    try {
        errorResult.textContent = "";

        if (!encryptedMessages) {
            throw new Error("Спочатку потрібно зашифрувати повідомлення.");
        }

        const p = Number(pInput.value);
        const x = Number(xInput.value);

        const decrypted = elGamalDecryptMessage(
            encryptedMessages, p, x
        );

        const numbers = decrypted.map(item => item.message);
        const word = decodeWord(numbers);

        decryptionResult.innerHTML = `
            <h3>Результати розшифрування</h3>

            ${decrypted.map(item => `
                <p>Сеанс ${item.session}: M = ${item.message}</p>
            `).join("")}

            <p>Відновлене повідомлення: ${word}</p>
        `;

    } catch (error) {
        errorResult.textContent = error.message;
    }
});