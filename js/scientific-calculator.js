// ================================================
// 🧮 CALCULADORA CIENTÍFICA - AI STUDY GENIUS
// 👨‍💻 Desarrollado por: Vicentegg4212  
// 📱 Calculadora visual integrada con MathJax
// ================================================

class ScientificCalculator {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
        this.currentExpression = '';
        this.result = null;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createCalculatorButton();
        this.bindEvents();
    }
    
    createCalculatorButton() {
        // Agregar botón flotante de calculadora
        const calcBtn = document.createElement('button');
        calcBtn.className = 'calc-floating-btn';
        calcBtn.innerHTML = '🧮';
        calcBtn.title = 'Calculadora Científica';
        calcBtn.onclick = () => this.toggle();
        
        document.body.appendChild(calcBtn);
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        const modal = this.createCalculatorModal();
        document.body.appendChild(modal);
        this.isOpen = true;
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.calc-content').style.transform = 'translateY(0)';
        }, 10);
        
        this.bindCalculatorEvents();
    }
    
    close() {
        const modal = document.querySelector('.calc-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.querySelector('.calc-content').style.transform = 'translateY(100%)';
            setTimeout(() => {
                modal.remove();
                this.isOpen = false;
            }, 300);
        }
    }
    
    createCalculatorModal() {
        const modal = document.createElement('div');
        modal.className = 'calc-modal';
        modal.innerHTML = `
            <div class="calc-overlay" onclick="scientificCalculator.close()"></div>
            <div class="calc-content">
                <div class="calc-header">
                    <h3>🧮 Calculadora Científica</h3>
                    <div class="calc-header-actions">
                        <button class="calc-history-btn" onclick="scientificCalculator.showHistory()">📜</button>
                        <button class="calc-close-btn" onclick="scientificCalculator.close()">✕</button>
                    </div>
                </div>
                
                <div class="calc-display">
                    <div class="calc-expression" id="calc-expression">${this.currentExpression || '0'}</div>
                    <div class="calc-result" id="calc-result">${this.result !== null ? '= ' + this.result : ''}</div>
                </div>
                
                <div class="calc-buttons">
                    <!-- Fila 1: Funciones científicas -->
                    <button class="calc-btn function" data-action="clear">C</button>
                    <button class="calc-btn function" data-action="clearEntry">CE</button>
                    <button class="calc-btn function" data-action="backspace">⌫</button>
                    <button class="calc-btn operator" data-value="/">/</button>
                    
                    <!-- Fila 2: Funciones trigonométricas -->
                    <button class="calc-btn function" data-action="sin">sin</button>
                    <button class="calc-btn function" data-action="cos">cos</button>
                    <button class="calc-btn function" data-action="tan">tan</button>
                    <button class="calc-btn operator" data-value="*">×</button>
                    
                    <!-- Fila 3: Logaritmos y raíces -->
                    <button class="calc-btn function" data-action="ln">ln</button>
                    <button class="calc-btn function" data-action="log">log</button>
                    <button class="calc-btn function" data-action="sqrt">√</button>
                    <button class="calc-btn operator" data-value="-">−</button>
                    
                    <!-- Fila 4: Potencias y constantes -->
                    <button class="calc-btn function" data-action="power">x²</button>
                    <button class="calc-btn function" data-action="powerY">xʸ</button>
                    <button class="calc-btn function" data-action="factorial">x!</button>
                    <button class="calc-btn operator" data-value="+">+</button>
                    
                    <!-- Fila 5: Números 7-9 -->
                    <button class="calc-btn number" data-value="7">7</button>
                    <button class="calc-btn number" data-value="8">8</button>
                    <button class="calc-btn number" data-value="9">9</button>
                    <button class="calc-btn function" data-action="pi">π</button>
                    
                    <!-- Fila 6: Números 4-6 -->
                    <button class="calc-btn number" data-value="4">4</button>
                    <button class="calc-btn number" data-value="5">5</button>
                    <button class="calc-btn number" data-value="6">6</button>
                    <button class="calc-btn function" data-action="e">e</button>
                    
                    <!-- Fila 7: Números 1-3 -->
                    <button class="calc-btn number" data-value="1">1</button>
                    <button class="calc-btn number" data-value="2">2</button>
                    <button class="calc-btn number" data-value="3">3</button>
                    <button class="calc-btn function" data-value="(">(</button>
                    
                    <!-- Fila 8: 0 y operadores -->
                    <button class="calc-btn number zero" data-value="0">0</button>
                    <button class="calc-btn number" data-value=".">.</button>
                    <button class="calc-btn function" data-value=")">)</button>
                    <button class="calc-btn equals" data-action="equals">=</button>
                </div>
                
                <div class="calc-math-display" id="calc-math-display"></div>
            </div>
        `;
        
        return modal;
    }
    
    bindCalculatorEvents() {
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButtonClick(e));
        });
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    bindEvents() {
        // Eventos globales de escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    handleButtonClick(e) {
        const btn = e.target;
        const action = btn.dataset.action;
        const value = btn.dataset.value;
        
        // Efecto visual
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 100);
        
        if (action) {
            this.executeAction(action);
        } else if (value) {
            this.addToExpression(value);
        }
    }
    
    handleKeydown(e) {
        if (!this.isOpen) return;
        
        e.preventDefault();
        
        const key = e.key;
        
        if (/[0-9]/.test(key)) {
            this.addToExpression(key);
        } else if (['+', '-', '*', '/', '(', ')', '.'].includes(key)) {
            this.addToExpression(key);
        } else if (key === 'Enter' || key === '=') {
            this.executeAction('equals');
        } else if (key === 'Backspace') {
            this.executeAction('backspace');
        } else if (key === 'Delete' || key === 'c' || key === 'C') {
            this.executeAction('clear');
        }
    }
    
    addToExpression(value) {
        if (this.result !== null && /[0-9]/.test(value)) {
            // Si hay un resultado y se ingresa un número, comenzar nueva expresión
            this.currentExpression = value;
            this.result = null;
        } else {
            this.currentExpression += value;
        }
        
        this.updateDisplay();
    }
    
    executeAction(action) {
        switch (action) {
            case 'clear':
                this.currentExpression = '';
                this.result = null;
                break;
                
            case 'clearEntry':
                this.currentExpression = '';
                break;
                
            case 'backspace':
                this.currentExpression = this.currentExpression.slice(0, -1);
                break;
                
            case 'equals':
                this.calculate();
                break;
                
            case 'sin':
                this.addFunction('sin');
                break;
                
            case 'cos':
                this.addFunction('cos');
                break;
                
            case 'tan':
                this.addFunction('tan');
                break;
                
            case 'ln':
                this.addFunction('ln');
                break;
                
            case 'log':
                this.addFunction('log');
                break;
                
            case 'sqrt':
                this.addFunction('sqrt');
                break;
                
            case 'power':
                this.addToExpression('^2');
                break;
                
            case 'powerY':
                this.addToExpression('^');
                break;
                
            case 'factorial':
                this.addFunction('!');
                break;
                
            case 'pi':
                this.addToExpression('π');
                break;
                
            case 'e':
                this.addToExpression('e');
                break;
        }
        
        this.updateDisplay();
    }
    
    addFunction(func) {
        if (func === '!') {
            this.currentExpression += '!';
        } else {
            this.currentExpression += func + '(';
        }
    }
    
    calculate() {
        if (!this.currentExpression) return;
        
        try {
            const processedExpression = this.preprocessExpression(this.currentExpression);
            const result = this.evaluateExpression(processedExpression);
            
            this.result = this.formatResult(result);
            this.addToHistory(this.currentExpression, this.result);
            this.renderMathExpression();
            
        } catch (error) {
            this.result = 'Error';
            console.error('Calculation error:', error);
        }
        
        this.updateDisplay();
    }
    
    preprocessExpression(expr) {
        return expr
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/(\d+)!/g, (match, n) => this.factorial(parseInt(n)))
            .replace(/\^/g, '**')
            .replace(/×/g, '*')
            .replace(/−/g, '-');
    }
    
    evaluateExpression(expr) {
        // Seguridad: solo permitir operaciones matemáticas básicas
        const allowedChars = /^[0-9+\-*/.()MathsincostandlogqrtEPI\s]+$/;
        if (!allowedChars.test(expr)) {
            throw new Error('Invalid expression');
        }
        
        return Function('"use strict"; return (' + expr + ')')();
    }
    
    factorial(n) {
        if (n < 0) return 'Error';
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    formatResult(result) {
        if (typeof result !== 'number') return result;
        
        if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-6 && result !== 0)) {
            return result.toExponential(6);
        }
        
        return parseFloat(result.toFixed(10));
    }
    
    updateDisplay() {
        const expressionEl = document.getElementById('calc-expression');
        const resultEl = document.getElementById('calc-result');
        
        if (expressionEl) {
            expressionEl.textContent = this.currentExpression || '0';
        }
        
        if (resultEl) {
            resultEl.textContent = this.result !== null ? '= ' + this.result : '';
        }
    }
    
    renderMathExpression() {
        const mathDisplayEl = document.getElementById('calc-math-display');
        if (!mathDisplayEl || !window.MathJax) return;
        
        try {
            const latexExpression = this.convertToLaTeX(this.currentExpression);
            const latexResult = this.convertToLaTeX(this.result.toString());
            
            mathDisplayEl.innerHTML = `
                <div class="calc-math-expr">
                    $$${latexExpression} = ${latexResult}$$
                </div>
            `;
            
            window.MathJax.typesetPromise([mathDisplayEl]).catch(err => {
                console.log('MathJax render error:', err);
            });
        } catch (error) {
            console.log('LaTeX conversion error:', error);
        }
    }
    
    convertToLaTeX(expr) {
        return expr.toString()
            .replace(/\*/g, ' \\cdot ')
            .replace(/\^2/g, '^{2}')
            .replace(/\^([^{])/g, '^{$1}')
            .replace(/sqrt\(/g, '\\sqrt{')
            .replace(/sin\(/g, '\\sin(')
            .replace(/cos\(/g, '\\cos(')
            .replace(/tan\(/g, '\\tan(')
            .replace(/ln\(/g, '\\ln(')
            .replace(/log\(/g, '\\log(')
            .replace(/π/g, '\\pi')
            .replace(/e/g, 'e');
    }
    
    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: new Date().toISOString(),
            latex: this.convertToLaTeX(expression) + ' = ' + this.convertToLaTeX(result.toString())
        };
        
        this.history.unshift(historyItem);
        
        // Mantener solo los últimos 50 cálculos
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        
        // Enviar al chat si está disponible
        this.sendToChat(expression, result);
    }
    
    sendToChat(expression, result) {
        // Integración con el chat principal
        if (window.mobileAIApp && window.mobileAIApp.textInput) {
            const chatMessage = `🧮 Calculadora: ${expression} = ${result}`;
            const currentValue = window.mobileAIApp.textInput.value;
            window.mobileAIApp.textInput.value = currentValue + (currentValue ? '\n' : '') + chatMessage;
            window.mobileAIApp.updateSendButton();
        }
    }
    
    showHistory() {
        const historyModal = this.createHistoryModal();
        document.body.appendChild(historyModal);
        
        setTimeout(() => {
            historyModal.style.opacity = '1';
            historyModal.querySelector('.calc-history-content').style.transform = 'scale(1)';
        }, 10);
    }
    
    createHistoryModal() {
        const modal = document.createElement('div');
        modal.className = 'calc-history-modal';
        modal.innerHTML = `
            <div class="calc-history-overlay" onclick="scientificCalculator.closeHistory()"></div>
            <div class="calc-history-content">
                <div class="calc-history-header">
                    <h3>📜 Historial de Cálculos</h3>
                    <button class="calc-close-btn" onclick="scientificCalculator.closeHistory()">✕</button>
                </div>
                
                <div class="calc-history-list">
                    ${this.renderHistoryList()}
                </div>
                
                <div class="calc-history-actions">
                    <button class="calc-clear-history-btn" onclick="scientificCalculator.clearHistory()">
                        🗑️ Limpiar Historial
                    </button>
                    <button class="calc-export-history-btn" onclick="scientificCalculator.exportHistory()">
                        📄 Exportar PDF
                    </button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    renderHistoryList() {
        if (this.history.length === 0) {
            return '<div class="calc-no-history">No hay cálculos en el historial</div>';
        }
        
        return this.history.map((item, index) => `
            <div class="calc-history-item" onclick="scientificCalculator.useFromHistory(${index})">
                <div class="calc-history-expression">${item.expression}</div>
                <div class="calc-history-result">= ${item.result}</div>
                <div class="calc-history-time">${new Date(item.timestamp).toLocaleString()}</div>
            </div>
        `).join('');
    }
    
    useFromHistory(index) {
        const item = this.history[index];
        this.currentExpression = item.expression;
        this.result = item.result;
        this.updateDisplay();
        this.closeHistory();
    }
    
    closeHistory() {
        const modal = document.querySelector('.calc-history-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    clearHistory() {
        if (confirm('¿Estás seguro de que quieres limpiar el historial?')) {
            this.history = [];
            localStorage.removeItem('calculatorHistory');
            this.closeHistory();
        }
    }
    
    async exportHistory() {
        if (this.history.length === 0) {
            alert('No hay historial para exportar');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert('PDF export no disponible');
            return;
        }
        
        const doc = new jsPDF();
        let yPosition = 20;
        
        doc.setFontSize(20);
        doc.text('🧮 Historial de Calculadora', 20, yPosition);
        yPosition += 20;
        
        doc.setFontSize(12);
        doc.text(`Generado: ${new Date().toLocaleDateString()}`, 20, yPosition);
        yPosition += 15;
        
        this.history.forEach((item, index) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text(`${index + 1}. ${item.expression} = ${item.result}`, 20, yPosition);
            yPosition += 7;
            doc.setFontSize(10);
            doc.text(`   ${new Date(item.timestamp).toLocaleString()}`, 25, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
        });
        
        doc.save(`Calculadora_Historial_${new Date().toISOString().split('T')[0]}.pdf`);
    }
}

// Inicializar calculadora
let scientificCalculator;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        scientificCalculator = new ScientificCalculator();
    });
} else {
    scientificCalculator = new ScientificCalculator();
}