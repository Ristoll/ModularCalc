const resultContainer = document.getElementById("result-container");

export function log(a, b, operation, result) {
    const tr = document.createElement("tr");

    const aCell = document.createElement("td");
    aCell.textContent = a;

    const bCell = document.createElement("td");
    bCell.textContent = b ?? "---";

    const operationCell = document.createElement("td");
    operationCell.textContent = operation;

    const resultCell = document.createElement("td");
    resultCell.textContent = result;

    tr.append(aCell, bCell, operationCell, resultCell);

    resultContainer.appendChild(tr);
}

export function clearLog(){
    resultContainer.innerHTML = "";
}