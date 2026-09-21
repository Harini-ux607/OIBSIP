const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");
const equalsButton = document.getElementById("equals");
const decimalButton = document.getElementById("decimal");

let expression = "";
let result = "";


/* =========================
   NUMBER BUTTONS
========================= */

numberButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        expression = expression + button.dataset.number;

        expressionDisplay.textContent = expression;

    });

});


/* =========================
   OPERATOR BUTTONS
========================= */

operatorButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        let operator = button.dataset.operator;

        if (expression === "") {
            return;
        }

        let lastCharacter = expression[expression.length - 1];

        // Prevent two operators continuously
        if (
            lastCharacter === "+" ||
            lastCharacter === "-" ||
            lastCharacter === "*" ||
            lastCharacter === "/"
        ) {
            expression = expression.slice(0, -1);
        }

        expression = expression + operator;

        expressionDisplay.textContent = expression;

    });

});


/* =========================
   DECIMAL BUTTON
========================= */

decimalButton.addEventListener("click", function () {

    if (expression === "") {
        expression = "0.";
        expressionDisplay.textContent = expression;
        return;
    }

    let parts = expression.split(/[+\-*/]/);

    let currentNumber = parts[parts.length - 1];

    // Don't allow two decimal points
    if (currentNumber.includes(".")) {
        return;
    }

    expression = expression + ".";

    expressionDisplay.textContent = expression;

});


/* =========================
   EQUALS BUTTON
========================= */

equalsButton.addEventListener("click", function () {

    if (expression === "") {
        return;
    }

    let lastCharacter = expression[expression.length - 1];

    // Expression should not end with operator
    if (
        lastCharacter === "+" ||
        lastCharacter === "-" ||
        lastCharacter === "*" ||
        lastCharacter === "/"
    ) {
        showError("Invalid Expression");
        return;
    }

    let numbers = expression.split(/[+\-*/]/);
    let operators = expression.match(/[+\-*/]/g);

    let values = [];

    for (let i = 0; i < numbers.length; i++) {

        values.push(parseFloat(numbers[i]));

    }


    /* =========================
       DIVISION BY ZERO CHECK
    ========================= */

    for (let i = 0; i < operators.length; i++) {

        if (operators[i] === "/" && values[i + 1] === 0) {

            showError("Cannot divide by zero");

            return;
        }

    }


    /* =========================
       CALCULATION
    ========================= */

    // First perform multiplication and division

    for (let i = 0; i < operators.length; i++) {

        if (operators[i] === "*" || operators[i] === "/") {

            let calculation;

            if (operators[i] === "*") {

                calculation = values[i] * values[i + 1];

            } else {

                calculation = values[i] / values[i + 1];

            }

            values[i] = calculation;

            values.splice(i + 1, 1);

            operators.splice(i, 1);

            i--;

        }

    }


    // Then perform addition and subtraction

    let finalResult = values[0];

    for (let i = 0; i < operators.length; i++) {

        if (operators[i] === "+") {

            finalResult = finalResult + values[i + 1];

        } else if (operators[i] === "-") {

            finalResult = finalResult - values[i + 1];

        }

    }


    result = finalResult;

    resultDisplay.textContent = "= " + result;

});


/* =========================
   CLEAR BUTTON
========================= */

clearButton.addEventListener("click", function () {

    expression = "";

    result = "";

    expressionDisplay.textContent = "0";

    resultDisplay.textContent = "";

    resultDisplay.classList.remove("error");

});


/* =========================
   DELETE BUTTON
========================= */

deleteButton.addEventListener("click", function () {

    expression = expression.slice(0, -1);

    if (expression === "") {

        expressionDisplay.textContent = "0";

    } else {

        expressionDisplay.textContent = expression;

    }

    resultDisplay.textContent = "";

});


/* =========================
   ERROR FUNCTION
========================= */

function showError(message) {

    resultDisplay.textContent = message;

    resultDisplay.classList.add("error");

}


/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", function (event) {

    let key = event.key;


    // Numbers
    if (key >= "0" && key <= "9") {

        expression = expression + key;

        expressionDisplay.textContent = expression;

    }


    // Operators
    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        if (expression === "") {
            return;
        }

        let lastCharacter = expression[expression.length - 1];

        if (
            lastCharacter === "+" ||
            lastCharacter === "-" ||
            lastCharacter === "*" ||
            lastCharacter === "/"
        ) {
            expression = expression.slice(0, -1);
        }

        expression = expression + key;

        expressionDisplay.textContent = expression;

    }


    // Decimal
    else if (key === ".") {

        decimalButton.click();

    }


    // Equals
    else if (key === "Enter" || key === "=") {

        equalsButton.click();
    }
    // Backspace
    else if (key === "Backspace") {

        deleteButton.click();

    }

    // Escape = Clear
    else if (key === "Escape") {

        clearButton.click();

    }

});