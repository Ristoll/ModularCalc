import { rsaEncodeWord, rsaEncryptNumbers, rsaDecryptNumbers, rsaDecodeWord } from "./operations.js";

const encryptBtn = document.getElementById("encrypt-btn");
const encryptError = document.getElementById("encrypt-error");

const encryptWord = document.getElementById("encrypt-word");
const encryptAlphabet = document.getElementById("encrypt-alphabet");
const encryptModulus = document.getElementById("encrypt-modulus");
const encryptKey = document.getElementById("encrypt-key");

const originalWord = document.getElementById("original-word");
const encodedWord = document.getElementById("encoded-word");
const encryptedCode = document.getElementById("encrypted-code");

const decryptBtn = document.getElementById("decrypt-btn");
const decryptError = document.getElementById("decrypt-error");

const decryptCode = document.getElementById("decrypt-code");
const decryptAlphabet = document.getElementById("decrypt-alphabet");
const decryptModulus = document.getElementById("decrypt-modulus");
const decryptKey = document.getElementById("decrypt-key");

const decodedCode = document.getElementById("decoded-code");
const decodedWord = document.getElementById("decoded-word");

encryptBtn.addEventListener("click", () => {
    try {
        encryptError.textContent = "";

        const word = encryptWord.value.trim();
        const alphabet = encryptAlphabet.value;
        const m = Number(encryptModulus.value);
        const y = Number(encryptKey.value);

        const numbers = rsaEncodeWord(word, alphabet);
        const encrypted = rsaEncryptNumbers(numbers, y, m);

        originalWord.textContent = word.toUpperCase();
        encodedWord.textContent = numbers.join(", ");
        encryptedCode.textContent = encrypted.join(", ");

    } catch (error) {
        encryptError.textContent = error.message;
    }
});

decryptBtn.addEventListener("click", () => {
    try {
        decryptError.textContent = "";

        const text = decryptCode.value.trim();

        if (!text) {
            throw new Error("Введіть зашифрований числовий код.");
        }

        const numbers = text.split(/[\s,;]+/).map(Number);

        if (numbers.some(number => !Number.isSafeInteger(number))) {
            throw new Error("Введіть цілі числа, розділені комами або пробілами.");
        }

        const alphabet = decryptAlphabet.value;
        const m = Number(decryptModulus.value);
        const x = Number(decryptKey.value);

        const decrypted = rsaDecryptNumbers(numbers, x, m);
        const word = rsaDecodeWord(decrypted, alphabet);

        decodedCode.textContent = decrypted.join(", ");
        decodedWord.textContent = word;

    } catch (error) {
        decryptError.textContent = error.message;
    }
});