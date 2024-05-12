const calculator = {
    expression: '',
    result: '',
    equalDisplayed: false, 
    customButtonClicked: false, 
    history: [], 

    init() {
        this.displayExpression = $('.expression');
        this.displayResult = $('.result');
        this.keys = $('.key');

        this.keys.on('click', (event) => {
            const value = $(event.target).data('value');
            this.handleKeyClick(value);
        });

        this.updateDisplay();
    },

    handleKeyClick(value) {
        switch (value) {
            case '=':
                if (!this.equalDisplayed && this.expression !== '') {
                    this.calculate();
                    this.equalDisplayed = true;
                }
                break;
            case 'C':
                this.clear();
                break;
            case '+/-':
                this.negate();
                break;
            case '%':
                if (this.expression !== '') {
                    this.percent();
                    this.equalDisplayed = false;
                }
                break;
            case '/':
            case '*':
            case '+':
            case '-':
                if (this.expression !== '') {
                    this.appendValue(value);
                    this.equalDisplayed = false;
                }
                break;
            case 'geçmiş işlemler':
                this.showHistory();
                break;
            default:
                this.appendValue(value);
                this.equalDisplayed = false;
        }
    },

    percent() {
        this.expression = '(' + this.expression + ') / 100';
        this.addToHistory();
        this.updateDisplay();
    },

    negate() {
        if (this.expression !== '' && this.expression[0] !== '-') {
            this.expression = '-' + this.expression;
        } else if (this.expression[0] === '-') {
            this.expression = this.expression.slice(1);
        }
        this.updateDisplay();
    },

    appendValue(value) {
        if (value === 'x') {
            value = '*'; 
        }
        this.expression += value;
        const expressionText = this.expression.replace(/\//g, '÷');
        this.displayExpression.text(expressionText);
        this.updateDisplay();
    },

    calculate() {
        try {
            this.result = eval(this.expression);
            this.addToHistory();
            this.expression = '';
            this.equalDisplayed = false;
            this.customButtonClicked = false;
            this.updateDisplay();
        } catch (error) {
            this.result = 'Error';
            this.updateDisplay();
        }
    },

    clear() {
        this.expression = '';
        this.result = '';
        this.equalDisplayed = false;
        this.customButtonClicked = false;
        this.updateDisplay();
    },

    updateDisplay() {
        if (this.result !== '') {
            if (!this.equalDisplayed) {
                this.displayResult.html('= ' + this.result);
                this.equalDisplayed = true;
            } else {
                this.displayResult.text('=                ' + this.result);
            }
            this.displayResult.css({
                paddingRight: '20px'
            });
        } else if (this.expression !== '') {
            const expressionText = this.expression.replace(/\//g, '÷').replace(/\*/g, 'x'); 
            this.displayExpression.text(expressionText);
        } else {
            this.displayResult.text('');
            this.displayExpression.text('');
        }
    },
    

    addToHistory() {
        const historyItem = {
            expression: this.expression,
            result: this.result
        };

        this.history.push(historyItem);

        if (this.history.length > 3) {
            this.history.shift();
        }
    },

    showHistory() {
        this.displayResult.text('');
        let historyText = '';
        this.history.forEach((item, index) => {
            historyText += `${item.expression} = ${item.result}<br>`;
        });
        this.displayExpression.html(historyText);
    }
};

$(document).ready(function () {
    const $calculator = $('.calculator');
    const calculatorInstance = Object.create(calculator);
    calculatorInstance.init();

    const themeToggleBtn = document.querySelector(".theme-toggler");
    themeToggleBtn.onclick = () => {
        $calculator.toggleClass("dark");
        themeToggleBtn.classList.toggle("active");
    }

    $(".calculator").on("click", ".key[data-value='geçmiş işlemler']", function () {
        calculatorInstance.showHistory();
    });
});
