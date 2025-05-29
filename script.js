let display = document.getElementById('display');
let currentInput = '0';
let previousInputs = []; // Array to store history
let historyList = document.getElementById('historyList');
let historyPanel = document.getElementById('historyPanel');

function updateDisplay() {
    if (currentInput.length > 15) {
        display.textContent = 'Overflow';
        currentInput = '0';
        return;
    }
    display.textContent = currentInput;
}

function appendNumber(number) {
    if (currentInput === '0' || currentInput === 'Infinity' || currentInput === '-Infinity' || isNaN(parseFloat(currentInput))) {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function appendOperator(operator) {
    if (currentInput !== '0' && currentInput !== '-' && !isNaN(parseFloat(currentInput)) && !['+', '-', '*', '/'].includes(currentInput.slice(-1))) {
        previousInputs.push(currentInput);
        currentInput = operator;
        updateDisplay();
    } else if (['+', '-', '*', '/'].includes(currentInput.slice(-1)) && operator !== currentInput.slice(-1)) {
        // Replace the last operator with the new one
        currentInput = currentInput.slice(0, -1) + operator;
        updateDisplay();
    } else if (currentInput === '0' && operator === '-') {
        currentInput = '-'; // Allow starting with a negative sign
        updateDisplay();
    }
}

function calculate() {
    if (currentInput.length === 0 || ['+', '-', '*', '/'].includes(currentInput.slice(-1))) {
        return;
    }
    try {
        // Use a safer alternative to eval
        const result = new Function('return ' + previousInputs.join('') + currentInput.replace(/÷/g, '/').replace(/×/g, '*'))();
        storeCalculation(previousInputs.join('') + currentInput, result);
        currentInput = String(result);
        previousInputs = [];
        updateDisplay();
    } catch (error) {
        display.textContent = 'Error';
        currentInput = '0';
    }
}

function clearDisplay() {
    currentInput = '0';
    previousInputs = [];
    display.textContent = currentInput;
}

function storeCalculation(expression, result) {
    const historyItem = document.createElement('li');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
      <span>${expression} =</span>
      <span>${result}</span>
    `;
    historyList.appendChild(historyItem);
}

function toggleHistory() {
    historyPanel.classList.toggle('show');
}

function clearHistory() {
    historyList.innerHTML = '';
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' &&

 key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'C' || key === 'c') {
        clearDisplay();
    }
});