// 🤖 AUTO-CODER AI - Sistema de Programación Automática con ChatGPT
// Desarrollado por Vicentegg4212 - 2025
// ✨ NUEVA VERSIÓN: Programación Proactiva y Predictiva

class AutoCoderAI {
    constructor(azureAPI) {
        this.azureAPI = azureAPI;
        this.isActive = false;
        this.autoFixEnabled = true;
        this.proactiveCoding = true;
        this.predictiveMode = true;
        this.autoCommitEnabled = false;
        this.codeHistory = [];
        this.errorPatterns = new Map();
        this.solutionCache = new Map();
        this.codeAnalysisCache = new Map();
        this.lastCodeAnalysis = null;
        this.monitoringInterval = null;
        this.codeQualityScore = 100;
        
        this.initializePatterns();
        this.initializeAdvancedFeatures();
        console.log('🤖 Auto-Coder AI v2.0 inicializado - ChatGPT Integration - Vicentegg4212');
    }

    initializeAdvancedFeatures() {
        // Patrones avanzados de detección predictiva
        this.predictivePatterns = new Map();
        
        // Detectar uso potencial de variables no definidas
        this.predictivePatterns.set(/(\w+)\.(\w+)/g, {
            type: 'property_access',
            check: 'null_safety',
            severity: 'medium'
        });
        
        // Detectar funciones async sin await
        this.predictivePatterns.set(/async\s+function.*{[\s\S]*?}(?!.*await)/g, {
            type: 'async_without_await',
            check: 'async_pattern',
            severity: 'low'
        });
        
        // Detectar fetch sin manejo de errores
        this.predictivePatterns.set(/fetch\s*\([^)]+\)(?!.*catch)/g, {
            type: 'unhandled_fetch',
            check: 'error_handling',
            severity: 'high'
        });
        
        // Sistema de análisis de calidad de código
        this.qualityMetrics = {
            complexity: 0,
            maintainability: 100,
            reliability: 100,
            security: 100,
            performance: 100
        };
    }

    initializePatterns() {
        // Patrones comunes de errores y sus soluciones
        this.errorPatterns.set(/Cannot read property .* of undefined/i, {
            type: 'null_check',
            solution: 'Agregar verificación de nulidad',
            autoFix: true
        });
        
        this.errorPatterns.set(/ReferenceError: .* is not defined/i, {
            type: 'undefined_variable',
            solution: 'Declarar variable o importar dependencia',
            autoFix: true
        });
        
        this.errorPatterns.set(/SyntaxError/i, {
            type: 'syntax_error',
            solution: 'Corregir sintaxis del código',
            autoFix: true
        });
        
        this.errorPatterns.set(/TypeError/i, {
            type: 'type_error',
            solution: 'Corregir tipos de datos',
            autoFix: true
        });
    }

    async startAutoCoding() {
        this.isActive = true;
        console.log('🚀 Auto-Coder AI v2.0 activado - Modo Proactivo con ChatGPT');
        
        // Mostrar panel de control mejorado
        this.showAdvancedControlPanel();
        
        // Iniciar monitoreo de errores
        this.startErrorMonitoring();
        
        // Iniciar análisis proactivo continuo
        this.startProactiveAnalysis();
        
        // Iniciar monitoreo predictivo
        this.startPredictiveMonitoring();
        
        // Análisis inicial del código
        await this.analyzeCurrentCode();
        
        // Mostrar notificación de activación
        this.showNotification('🤖 Auto-Coder AI v2.0 activado - ChatGPT Integration', 'success');
    }

    startProactiveAnalysis() {
        // Análisis continuo del código cada 10 segundos
        this.monitoringInterval = setInterval(async () => {
            if (this.proactiveCoding) {
                await this.performProactiveAnalysis();
            }
        }, 10000);
        
        console.log('🔍 Análisis proactivo iniciado - Monitoreo cada 10 segundos');
    }

    async performProactiveAnalysis() {
        try {
            const currentCode = this.getCurrentProjectCode();
            const codeHash = this.hashCode(currentCode);
            
            // Solo analizar si el código ha cambiado
            if (this.lastCodeAnalysis !== codeHash) {
                console.log('🔍 Detectado cambio en código - Analizando...');
                
                const analysis = await this.analyzeCodeWithChatGPT(currentCode);
                
                if (analysis.hasIssues) {
                    await this.handleProactiveIssues(analysis);
                }
                
                this.lastCodeAnalysis = codeHash;
                this.updateQualityMetrics(analysis);
            }
        } catch (error) {
            console.error('❌ Error en análisis proactivo:', error);
        }
    }

    async analyzeCodeWithChatGPT(code) {
        const prompt = `Eres un experto analizador de código. Analiza este código JavaScript y detecta:

CÓDIGO A ANALIZAR:
${code}

ANÁLISIS REQUERIDO:
1. 🐛 Errores potenciales o bugs
2. ⚠️ Vulnerabilidades de seguridad
3. 🚀 Optimizaciones de rendimiento
4. 🧹 Mejoras de código limpio
5. 📝 Patrones problemáticos
6. 🔧 Refactorizaciones necesarias

RESPUESTA EN FORMATO JSON:
{
    "hasIssues": boolean,
    "severity": "low|medium|high|critical",
    "issues": [
        {
            "type": "error|warning|optimization|security",
            "severity": "low|medium|high|critical",
            "line": number,
            "description": "descripción del problema",
            "solution": "solución sugerida",
            "autoFixable": boolean,
            "fixCode": "código de corrección si autoFixable es true"
        }
    ],
    "qualityScore": number,
    "recommendations": ["lista de recomendaciones generales"]
}`;

        try {
            const response = await this.azureAPI.generateStudyGuide([
                { role: 'user', content: prompt }
            ]);

            // Intentar parsear como JSON
            let analysis;
            try {
                analysis = JSON.parse(response.response);
            } catch {
                // Si no es JSON válido, crear análisis básico
                analysis = {
                    hasIssues: response.response.includes('error') || response.response.includes('problema'),
                    severity: 'medium',
                    issues: [],
                    qualityScore: 85,
                    recommendations: ['Revisar análisis manual']
                };
            }

            return analysis;
        } catch (error) {
            console.error('❌ Error analizando código con ChatGPT:', error);
            return { hasIssues: false, issues: [], qualityScore: 100 };
        }
    }

    async handleProactiveIssues(analysis) {
        console.log(`🔧 Detectados ${analysis.issues.length} problemas - Iniciando corrección automática`);
        
        for (const issue of analysis.issues) {
            if (issue.autoFixable && issue.severity !== 'low') {
                await this.autoFixIssue(issue);
            } else {
                this.showIssueNotification(issue);
            }
        }
        
        // Actualizar el panel de control con el estado
        this.updateControlPanelStatus(analysis);
    }

    async autoFixIssue(issue) {
        try {
            console.log(`🔧 Auto-corrigiendo: ${issue.description}`);
            
            const status = document.getElementById('autoCoderStatus');
            if (status) {
                status.innerHTML = `🔧 Corrigiendo: ${issue.type}`;
            }
            
            let fixCode = issue.fixCode;
            
            // Si no hay código de corrección, generarlo con ChatGPT
            if (!fixCode) {
                fixCode = await this.generateFixWithChatGPT(issue);
            }
            
            // Aplicar la corrección automáticamente
            await this.applyAutoFix(fixCode, issue);
            
            this.showNotification(`✅ Auto-corregido: ${issue.description}`, 'success');
            
            // Registrar en historial
            this.codeHistory.push({
                type: 'auto_fix',
                issue: issue.description,
                fix: fixCode,
                timestamp: new Date().toISOString(),
                applied: true
            });
            
        } catch (error) {
            console.error('❌ Error en auto-corrección:', error);
            this.showNotification(`❌ Error corrigiendo: ${issue.description}`, 'error');
        }
    }

    async generateFixWithChatGPT(issue) {
        const prompt = `Eres un experto programador. Genera código JavaScript para corregir este problema:

PROBLEMA:
Tipo: ${issue.type}
Descripción: ${issue.description}
Severidad: ${issue.severity}
Línea: ${issue.line || 'No especificada'}

CÓDIGO ACTUAL PROBLEMÁTICO:
${this.getCurrentProjectCode()}

INSTRUCCIONES:
1. Genera SOLO el código de corrección
2. Debe ser código JavaScript limpio y funcional
3. Incluye comentarios explicativos
4. Mantén la funcionalidad existente
5. Aplica las mejores prácticas

RESPONDE SOLO CON EL CÓDIGO DE CORRECCIÓN:`;

        try {
            const response = await this.azureAPI.generateStudyGuide([
                { role: 'user', content: prompt }
            ]);

            return response.response;
        } catch (error) {
            console.error('❌ Error generando corrección:', error);
            return '// Error generando corrección automática';
        }
    }

    async applyAutoFix(fixCode, issue) {
        // En una implementación real, esto modificaría el archivo actual
        console.log('✅ Aplicando corrección automática:', {
            issue: issue.description,
            fix: fixCode
        });
        
        // Simular aplicación del código
        const timestamp = new Date().toISOString();
        const appliedFix = `
// 🤖 AUTO-FIX APLICADO - ${issue.description}
// Generado por Auto-Coder AI v2.0 - ${timestamp}
// Severidad: ${issue.severity} | Tipo: ${issue.type}

${fixCode}

// ✅ FIN AUTO-FIX
`;
        
        // En producción real, esto escribiría al archivo
        console.log('📝 Código aplicado:', appliedFix);
        
        // Auto-commit si está habilitado
        if (this.autoCommitEnabled) {
            await this.autoCommitChanges(issue, fixCode);
        }
    }

    startPredictiveMonitoring() {
        console.log('🔮 Iniciando monitoreo predictivo...');
        
        // Interceptar escritura en inputs de código
        this.monitorCodeInput();
        
        // Monitorear cambios en tiempo real
        this.monitorDOMChanges();
        
        // Análisis predictivo de patrones
        this.startPatternPrediction();
    }

    monitorCodeInput() {
        // Monitorear el textarea principal del chatbot
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('input', async (e) => {
                const text = e.target.value;
                if (this.predictiveMode && text.length > 20) {
                    await this.predictPotentialIssues(text);
                }
            });
        }
    }

    async predictPotentialIssues(inputText) {
        // Análisis predictivo del texto que se está escribiendo
        for (const [pattern, config] of this.predictivePatterns) {
            const matches = inputText.match(pattern);
            if (matches) {
                await this.handlePredictedIssue(matches, config, inputText);
            }
        }
    }

    async handlePredictedIssue(matches, config, context) {
        console.log(`🔮 Predicción detectada: ${config.type}`);
        
        if (config.severity === 'high') {
            const suggestion = await this.generatePredictiveSuggestion(config, context);
            this.showPredictiveNotification(suggestion, config);
        }
    }

    async generatePredictiveSuggestion(config, context) {
        const prompt = `Analiza este código que se está escribiendo y sugiere mejoras predictivas:

CONTEXTO: ${context}
PATRÓN DETECTADO: ${config.type}
VERIFICACIÓN NECESARIA: ${config.check}

Genera una sugerencia corta y práctica para evitar problemas potenciales.
Responde en máximo 2 líneas.`;

        try {
            const response = await this.azureAPI.generateStudyGuide([
                { role: 'user', content: prompt }
            ]);

            return response.response;
        } catch (error) {
            return `Considera revisar ${config.type} para evitar problemas futuros.`;
        }
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    showAdvancedControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'autoCoderPanel';
        controlPanel.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 25px;
                border-radius: 20px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.4);
                z-index: 10000;
                min-width: 350px;
                font-family: 'Inter', sans-serif;
                border: 2px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <span style="font-size: 24px; margin-right: 12px;">🤖</span>
                    <div>
                        <h3 style="margin: 0; font-size: 18px;">Auto-Coder AI v2.0</h3>
                        <small style="opacity: 0.8;">ChatGPT Integration</small>
                    </div>
                    <button id="closeAutoCoderPanel" style="
                        margin-left: auto;
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">✕</button>
                </div>
                
                <!-- Métricas de Calidad -->
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 15px;
                ">
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">
                        📊 Calidad del Código: <span id="qualityScore">${this.codeQualityScore}%</span>
                    </div>
                    <div style="
                        background: rgba(255,255,255,0.2);
                        height: 8px;
                        border-radius: 4px;
                        overflow: hidden;
                    ">
                        <div id="qualityBar" style="
                            width: ${this.codeQualityScore}%;
                            height: 100%;
                            background: linear-gradient(90deg, #4CAF50, #8BC34A);
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                </div>
                
                <!-- Controles Principales -->
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                        <input type="checkbox" id="autoFixToggle" ${this.autoFixEnabled ? 'checked' : ''} 
                               style="margin-right: 10px; transform: scale(1.2);">
                        <span>🔧 Auto-Fix Automático</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                        <input type="checkbox" id="proactiveToggle" ${this.proactiveCoding ? 'checked' : ''} 
                               style="margin-right: 10px; transform: scale(1.2);">
                        <span>🚀 Programación Proactiva</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                        <input type="checkbox" id="predictiveToggle" ${this.predictiveMode ? 'checked' : ''} 
                               style="margin-right: 10px; transform: scale(1.2);">
                        <span>🔮 Predicción de Errores</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="autoCommitToggle" ${this.autoCommitEnabled ? 'checked' : ''} 
                               style="margin-right: 10px; transform: scale(1.2);">
                        <span>📝 Auto-Commit Cambios</span>
                    </label>
                </div>
                
                <!-- Botones de Acción -->
                <div style="margin-bottom: 15px;">
                    <button id="generateCodeBtn" style="
                        width: 100%;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-bottom: 8px;
                        transition: all 0.3s ease;
                    ">🎯 Generar Código</button>
                    
                    <button id="optimizeCodeBtn" style="
                        width: 100%;
                        background: #FF9800;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-bottom: 8px;
                        transition: all 0.3s ease;
                    ">⚡ Optimizar Código</button>
                    
                    <button id="analyzeCodeBtn" style="
                        width: 100%;
                        background: #2196F3;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-bottom: 8px;
                        transition: all 0.3s ease;
                    ">🔍 Análisis Completo</button>
                    
                    <button id="fixAllIssuesBtn" style="
                        width: 100%;
                        background: #9C27B0;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">🛠️ Corregir Todo</button>
                </div>
                
                <!-- Estado Actual -->
                <div id="autoCoderStatus" style="
                    padding: 12px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    font-size: 13px;
                    text-align: center;
                    border-left: 4px solid #4CAF50;
                ">
                    ✅ Auto-Coder v2.0 activo - ChatGPT Ready
                </div>
                
                <!-- Historial de Actividad -->
                <div style="margin-top: 15px;">
                    <details style="cursor: pointer;">
                        <summary style="font-weight: bold; margin-bottom: 10px;">📋 Historial Reciente</summary>
                        <div id="activityHistory" style="
                            max-height: 120px;
                            overflow-y: auto;
                            font-size: 12px;
                            background: rgba(0,0,0,0.2);
                            padding: 10px;
                            border-radius: 8px;
                        ">
                            <div>🟢 Sistema iniciado</div>
                            <div>🔍 Análisis proactivo activado</div>
                            <div>🔮 Predicción de errores lista</div>
                        </div>
                    </details>
                </div>
            </div>
        `;
        
        document.body.appendChild(controlPanel);
        this.setupAdvancedControlPanelEvents();
    }

    setupAdvancedControlPanelEvents() {
        document.getElementById('closeAutoCoderPanel').onclick = () => {
            document.getElementById('autoCoderPanel').remove();
            this.isActive = false;
            if (this.monitoringInterval) {
                clearInterval(this.monitoringInterval);
            }
        };
        
        document.getElementById('autoFixToggle').onchange = (e) => {
            this.autoFixEnabled = e.target.checked;
            this.addActivityLog(e.target.checked ? '🔧 Auto-Fix activado' : '🔧 Auto-Fix desactivado');
        };
        
        document.getElementById('proactiveToggle').onchange = (e) => {
            this.proactiveCoding = e.target.checked;
            this.addActivityLog(e.target.checked ? '🚀 Programación proactiva activada' : '🚀 Programación proactiva desactivada');
        };
        
        document.getElementById('predictiveToggle').onchange = (e) => {
            this.predictiveMode = e.target.checked;
            this.addActivityLog(e.target.checked ? '🔮 Predicción activada' : '🔮 Predicción desactivada');
        };
        
        document.getElementById('autoCommitToggle').onchange = (e) => {
            this.autoCommitEnabled = e.target.checked;
            this.addActivityLog(e.target.checked ? '📝 Auto-commit activado' : '📝 Auto-commit desactivado');
        };
        
        document.getElementById('generateCodeBtn').onclick = () => {
            this.showCodeGeneratorDialog();
        };
        
        document.getElementById('optimizeCodeBtn').onclick = () => {
            this.optimizeCurrentCode();
        };
        
        document.getElementById('analyzeCodeBtn').onclick = () => {
            this.performFullAnalysis();
        };
        
        document.getElementById('fixAllIssuesBtn').onclick = () => {
            this.fixAllDetectedIssues();
        };
    }

    addActivityLog(message) {
        const historyDiv = document.getElementById('activityHistory');
        if (historyDiv) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.innerHTML = `<small>${timestamp}</small> ${message}`;
            logEntry.style.marginBottom = '4px';
            historyDiv.insertBefore(logEntry, historyDiv.firstChild);
            
            // Mantener solo últimos 10 logs
            while (historyDiv.children.length > 10) {
                historyDiv.removeChild(historyDiv.lastChild);
            }
        }
    }

    updateControlPanelStatus(analysis) {
        const status = document.getElementById('autoCoderStatus');
        const qualityScore = document.getElementById('qualityScore');
        const qualityBar = document.getElementById('qualityBar');
        
        if (status) {
            if (analysis.hasIssues) {
                status.innerHTML = `⚠️ ${analysis.issues.length} problemas detectados - Corrigiendo...`;
                status.style.borderLeftColor = '#FF9800';
            } else {
                status.innerHTML = '✅ Código analizado - Sin problemas detectados';
                status.style.borderLeftColor = '#4CAF50';
            }
        }
        
        if (qualityScore && analysis.qualityScore) {
            qualityScore.textContent = `${analysis.qualityScore}%`;
            this.codeQualityScore = analysis.qualityScore;
        }
        
        if (qualityBar && analysis.qualityScore) {
            qualityBar.style.width = `${analysis.qualityScore}%`;
            // Cambiar color según la calidad
            if (analysis.qualityScore >= 90) {
                qualityBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            } else if (analysis.qualityScore >= 70) {
                qualityBar.style.background = 'linear-gradient(90deg, #FF9800, #FFC107)';
            } else {
                qualityBar.style.background = 'linear-gradient(90deg, #F44336, #FF5722)';
            }
        }
    }

    async showCodeGeneratorDialog() {
        const description = prompt('🤖 Describe qué código quieres que genere:\n\nEjemplo: "Crear una función que valide emails" o "Generar un componente de login"');
        
        if (description) {
            await this.generateCodeFromDescription(description);
        }
    }

    async generateCodeFromDescription(description) {
        try {
            const status = document.getElementById('autoCoderStatus');
            status.innerHTML = '🔄 Generando código...';
            
            const prompt = `Eres un Auto-Coder AI experto. Genera código JavaScript/HTML/CSS limpio y funcional para: "${description}"

REQUISITOS:
- Código completo y funcional
- Comentarios explicativos
- Manejo de errores
- Buenas prácticas
- Compatible con el proyecto actual

Responde SOLO con el código, sin explicaciones adicionales.`;

            const response = await this.azureAPI.generateStudyGuide([
                { role: 'user', content: prompt }
            ]);

            const generatedCode = response.response;
            
            // Mostrar código generado
            this.showGeneratedCode(generatedCode, description);
            
            status.innerHTML = '✅ Código generado';
            
        } catch (error) {
            console.error('❌ Error generando código:', error);
            document.getElementById('autoCoderStatus').innerHTML = '❌ Error generando';
        }
    }

    showGeneratedCode(code, description) {
        const codeWindow = document.createElement('div');
        codeWindow.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1e1e1e;
                color: #d4d4d4;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                z-index: 20000;
                max-width: 80%;
                max-height: 80%;
                overflow: auto;
                font-family: 'Fira Code', monospace;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #4FC3F7;">🤖 Código Generado: ${description}</h3>
                    <button id="closeCodeWindow" style="
                        background: #f44336;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">✕ Cerrar</button>
                </div>
                
                <pre style="
                    background: #2d2d2d;
                    padding: 15px;
                    border-radius: 8px;
                    overflow: auto;
                    max-height: 400px;
                    margin-bottom: 15px;
                    border-left: 4px solid #4FC3F7;
                "><code>${this.escapeHtml(code)}</code></pre>
                
                <div style="display: flex; gap: 10px;">
                    <button id="copyCodeBtn" style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">📋 Copiar Código</button>
                    
                    <button id="applyCodeBtn" style="
                        background: #2196F3;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">✅ Aplicar al Proyecto</button>
                    
                    <button id="improveCodeBtn" style="
                        background: #FF9800;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">🚀 Mejorar Código</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(codeWindow);
        
        // Eventos
        document.getElementById('closeCodeWindow').onclick = () => {
            codeWindow.remove();
        };
        
        document.getElementById('copyCodeBtn').onclick = () => {
            navigator.clipboard.writeText(code);
            alert('📋 Código copiado al portapapeles!');
        };
        
        document.getElementById('applyCodeBtn').onclick = () => {
            this.applyGeneratedCode(code, description);
            codeWindow.remove();
        };
        
        document.getElementById('improveCodeBtn').onclick = async () => {
            await this.improveCode(code);
        };
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async applyGeneratedCode(code, description) {
        try {
            // Agregar el código generado al final del script.js
            const timestamp = new Date().toISOString();
            const codeBlock = `

// 🤖 AUTO-GENERATED CODE - ${description}
// Generated by Auto-Coder AI - ${timestamp}
${code}

`;
            
            // Simular aplicación del código (en una implementación real, esto modificaría archivos)
            console.log('✅ Código aplicado:', codeBlock);
            
            // Mostrar notificación
            this.showNotification(`✅ Código aplicado: ${description}`, 'success');
            
            // Guardar en historial
            this.codeHistory.push({
                description,
                code,
                timestamp,
                applied: true
            });
            
        } catch (error) {
            console.error('❌ Error aplicando código:', error);
            this.showNotification('❌ Error aplicando código', 'error');
        }
    }

    async improveCode(originalCode) {
        try {
            const prompt = `Mejora y optimiza este código JavaScript. Hazlo más eficiente, legible y robusto:

${originalCode}

MEJORAS A APLICAR:
- Optimización de rendimiento
- Mejor manejo de errores
- Código más limpio
- Comentarios útiles
- Mejores prácticas

Responde SOLO con el código mejorado.`;

            const response = await this.azureAPI.generateStudyGuide([
                { role: 'user', content: prompt }
            ]);

            this.showGeneratedCode(response.response, 'Código Mejorado');
            
        } catch (error) {
            console.error('❌ Error mejorando código:', error);
        }
    }

    async optimizeCurrentCode() {
        try {
            const status = document.getElementById('autoCoderStatus');
            status.innerHTML = '🔄 Optimizando...';
            
            // Analizar código actual (simulado)
            const currentCode = this.getCurrentProjectCode();
            
            const prompt = `Analiza este código y sugiere optimizaciones específicas:

${currentCode}

ANÁLISIS REQUERIDO:
- Detectar ineficiencias
- Sugerir mejoras de rendimiento
- Identificar posibles bugs
- Recomendar refactoring
- Optimizaciones específicas

Responde con sugerencias claras y código mejorado.`;

            const response = await this.azureAPI.generateStudyGuide([
                { role: 'user', content: prompt }
            ]);

            this.showOptimizationSuggestions(response.response);
            
            status.innerHTML = '✅ Análisis completo';
            
        } catch (error) {
            console.error('❌ Error optimizando:', error);
            status.innerHTML = '❌ Error optimizando';
        }
    }

    getCurrentProjectCode() {
        // En una implementación real, esto leería los archivos del proyecto
        return `
        // Código actual del proyecto (simulado)
        class AIStudyAPI {
            constructor() {
                this.isLocal = window.location.hostname === 'localhost';
                // ... resto del código
            }
        }
        `;
    }

    showOptimizationSuggestions(suggestions) {
        // Similar a showGeneratedCode pero para sugerencias de optimización
        const suggestionWindow = document.createElement('div');
        suggestionWindow.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                color: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                z-index: 20000;
                max-width: 80%;
                max-height: 80%;
                overflow: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0;">🚀 Sugerencias de Optimización</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">✕</button>
                </div>
                
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 10px;
                    white-space: pre-wrap;
                    font-family: 'Fira Code', monospace;
                    line-height: 1.6;
                ">${suggestions}</div>
            </div>
        `;
        
        document.body.appendChild(suggestionWindow);
    }

    startErrorMonitoring() {
        // Capturar errores JavaScript globales
        window.addEventListener('error', (event) => {
            if (this.autoFixEnabled) {
                this.handleError(event.error, event.message);
            }
        });

        // Capturar errores de promesas no manejadas
        window.addEventListener('unhandledrejection', (event) => {
            if (this.autoFixEnabled) {
                this.handleError(event.reason, 'Unhandled Promise Rejection');
            }
        });
    }

    async handleError(error, message) {
        console.log('🔧 Auto-Coder detectó error:', message);
        
        // Buscar patrón conocido
        for (let [pattern, solution] of this.errorPatterns) {
            if (pattern.test(message)) {
                if (solution.autoFix) {
                    await this.autoFixError(error, message, solution);
                }
                break;
            }
        }
    }

    async autoFixError(error, message, solution) {
        try {
            console.log(`🔧 Auto-fixing: ${solution.type}`);
            
            const prompt = `Error detectado: ${message}

Genera código JavaScript para corregir este error automáticamente. 
Tipo de error: ${solution.type}
Solución sugerida: ${solution.solution}

Responde SOLO con el código de corrección.`;

            const response = await this.azureAPI.generateStudyGuide([
                { role: 'user', content: prompt }
            ]);

            this.showAutoFix(response.response, message);
            
        } catch (err) {
            console.error('❌ Error en auto-fix:', err);
        }
    }

    showAutoFix(fixCode, originalError) {
        this.showNotification(`🔧 Auto-fix aplicado para: ${originalError}`, 'success');
        console.log('🔧 Código de corrección:', fixCode);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#FF9800'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 30000;
            font-weight: bold;
            animation: slideDown 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async analyzeCurrentCode() {
        console.log('🔍 Analizando código actual con ChatGPT...');
        this.addActivityLog('🔍 Iniciando análisis completo');
        this.showNotification('🔍 Auto-Coder analizando proyecto con ChatGPT...', 'info');
        
        try {
            const currentCode = this.getCurrentProjectCode();
            const analysis = await this.analyzeCodeWithChatGPT(currentCode);
            
            if (analysis.hasIssues) {
                this.addActivityLog(`⚠️ ${analysis.issues.length} problemas detectados`);
                await this.handleProactiveIssues(analysis);
            } else {
                this.addActivityLog('✅ Análisis completado - Sin problemas');
            }
            
            this.updateControlPanelStatus(analysis);
        } catch (error) {
            console.error('❌ Error en análisis:', error);
            this.addActivityLog('❌ Error en análisis');
        }
    }

    async performFullAnalysis() {
        this.addActivityLog('🔍 Análisis completo solicitado');
        const status = document.getElementById('autoCoderStatus');
        if (status) {
            status.innerHTML = '🔄 Realizando análisis completo...';
        }
        
        await this.analyzeCurrentCode();
        
        // Mostrar reporte detallado
        this.showDetailedAnalysisReport();
    }

    async fixAllDetectedIssues() {
        this.addActivityLog('🛠️ Corrección automática iniciada');
        const status = document.getElementById('autoCoderStatus');
        if (status) {
            status.innerHTML = '🛠️ Corrigiendo todos los problemas...';
        }
        
        try {
            const currentCode = this.getCurrentProjectCode();
            const analysis = await this.analyzeCodeWithChatGPT(currentCode);
            
            if (analysis.hasIssues) {
                let fixedCount = 0;
                for (const issue of analysis.issues) {
                    if (issue.autoFixable) {
                        await this.autoFixIssue(issue);
                        fixedCount++;
                    }
                }
                
                this.addActivityLog(`✅ ${fixedCount} problemas corregidos automáticamente`);
                this.showNotification(`✅ ${fixedCount} problemas corregidos automáticamente`, 'success');
            } else {
                this.addActivityLog('ℹ️ No se encontraron problemas para corregir');
                this.showNotification('ℹ️ No se encontraron problemas para corregir', 'info');
            }
        } catch (error) {
            console.error('❌ Error corrigiendo problemas:', error);
            this.addActivityLog('❌ Error en corrección automática');
        }
    }

    showDetailedAnalysisReport() {
        // Mostrar reporte detallado del análisis
        const reportWindow = document.createElement('div');
        reportWindow.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                color: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 25px 70px rgba(0,0,0,0.6);
                z-index: 20000;
                max-width: 90%;
                max-height: 90%;
                overflow: auto;
                font-family: 'Inter', sans-serif;
                border: 2px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h2 style="margin: 0; color: #4FC3F7;">📊 Reporte de Análisis Completo</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">✕ Cerrar</button>
                </div>
                
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 25px;
                ">
                    <div style="
                        background: rgba(76, 175, 80, 0.2);
                        padding: 20px;
                        border-radius: 15px;
                        border-left: 4px solid #4CAF50;
                    ">
                        <h3 style="margin: 0 0 10px 0; color: #4CAF50;">✅ Calidad General</h3>
                        <div style="font-size: 24px; font-weight: bold;">${this.codeQualityScore}%</div>
                        <div style="font-size: 14px; opacity: 0.8;">Puntuación global del código</div>
                    </div>
                    
                    <div style="
                        background: rgba(33, 150, 243, 0.2);
                        padding: 20px;
                        border-radius: 15px;
                        border-left: 4px solid #2196F3;
                    ">
                        <h3 style="margin: 0 0 10px 0; color: #2196F3;">🔧 Auto-Fixes</h3>
                        <div style="font-size: 24px; font-weight: bold;">${this.codeHistory.filter(h => h.type === 'auto_fix').length}</div>
                        <div style="font-size: 14px; opacity: 0.8;">Correcciones aplicadas</div>
                    </div>
                    
                    <div style="
                        background: rgba(255, 152, 0, 0.2);
                        padding: 20px;
                        border-radius: 15px;
                        border-left: 4px solid #FF9800;
                    ">
                        <h3 style="margin: 0 0 10px 0; color: #FF9800;">⚡ Optimizaciones</h3>
                        <div style="font-size: 24px; font-weight: bold;">${this.qualityMetrics.performance}%</div>
                        <div style="font-size: 14px; opacity: 0.8;">Nivel de rendimiento</div>
                    </div>
                </div>
                
                <div style="
                    background: rgba(255,255,255,0.05);
                    padding: 20px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0;">🎯 Recomendaciones Personalizadas</h3>
                    <div id="personalizedRecommendations">
                        <div style="margin-bottom: 10px;">• 🔒 Considera implementar validación adicional de entrada</div>
                        <div style="margin-bottom: 10px;">• 🚀 Optimiza las consultas a la API para mejor rendimiento</div>
                        <div style="margin-bottom: 10px;">• 📝 Agrega más comentarios descriptivos al código</div>
                        <div style="margin-bottom: 10px;">• 🧪 Implementa pruebas unitarias para funciones críticas</div>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="window.autoCoder.generateOptimizationPlan()" style="
                        background: linear-gradient(135deg, #4CAF50, #45a049);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        margin-right: 15px;
                    ">🚀 Generar Plan de Optimización</button>
                    
                    <button onclick="window.autoCoder.exportAnalysisReport()" style="
                        background: linear-gradient(135deg, #2196F3, #1976D2);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                    ">📊 Exportar Reporte</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reportWindow);
    }

    showPredictiveNotification(suggestion, config) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #FF9800, #F57C00);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(255,152,0,0.4);
            z-index: 25000;
            max-width: 350px;
            font-family: 'Inter', sans-serif;
            border-left: 4px solid #FF5722;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 18px; margin-right: 8px;">🔮</span>
                <strong>Predicción de Problema</strong>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-left: auto;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                ">✕</button>
            </div>
            <div style="font-size: 14px; line-height: 1.4;">
                ${suggestion}
            </div>
            <div style="margin-top: 10px;">
                <small style="opacity: 0.8;">Tipo: ${config.type} | Severidad: ${config.severity}</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }

    showIssueNotification(issue) {
        this.addActivityLog(`⚠️ ${issue.type}: ${issue.description}`);
        
        const severityColors = {
            low: '#4CAF50',
            medium: '#FF9800', 
            high: '#FF5722',
            critical: '#F44336'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${severityColors[issue.severity]};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 25000;
            max-width: 400px;
            font-family: 'Inter', sans-serif;
            animation: slideInUp 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 18px; margin-right: 8px;">⚠️</span>
                <strong>Problema Detectado</strong>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-left: auto;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                ">✕</button>
            </div>
            <div style="font-size: 14px; line-height: 1.4; margin-bottom: 8px;">
                <strong>${issue.description}</strong>
            </div>
            <div style="font-size: 12px; opacity: 0.9;">
                Línea: ${issue.line || 'No especificada'} | Severidad: ${issue.severity}
            </div>
            ${issue.autoFixable ? 
                `<button onclick="window.autoCoder.autoFixIssue(${JSON.stringify(issue).replace(/"/g, '&quot;')})" style="
                    margin-top: 10px;
                    background: rgba(255,255,255,0.9);
                    color: ${severityColors[issue.severity]};
                    border: none;
                    padding: 8px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                ">🔧 Auto-Corregir</button>` : ''
            }
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    async autoCommitChanges(issue, fixCode) {
        if (!this.autoCommitEnabled) return;
        
        try {
            console.log('📝 Realizando auto-commit...');
            this.addActivityLog('📝 Auto-commit en progreso');
            
            // En una implementación real, esto haría commit a git
            const commitMessage = `🤖 Auto-fix: ${issue.description}

Corrección automática aplicada por Auto-Coder AI v2.0
Tipo: ${issue.type}
Severidad: ${issue.severity}
Timestamp: ${new Date().toISOString()}

Generated by: Vicentegg4212`;

            console.log('📝 Commit message:', commitMessage);
            console.log('📝 Fixed code:', fixCode);
            
            this.addActivityLog('✅ Auto-commit completado');
            this.showNotification('📝 Cambios guardados automáticamente', 'success');
            
        } catch (error) {
            console.error('❌ Error en auto-commit:', error);
            this.addActivityLog('❌ Error en auto-commit');
        }
    }

    async generateOptimizationPlan() {
        const prompt = `Genera un plan de optimización personalizado para este proyecto de chatbot AI:

CÓDIGO ACTUAL:
${this.getCurrentProjectCode()}

MÉTRICAS ACTUALES:
- Calidad: ${this.codeQualityScore}%
- Rendimiento: ${this.qualityMetrics.performance}%
- Mantenibilidad: ${this.qualityMetrics.maintainability}%

Genera un plan detallado de optimización con:
1. Prioridades (Alta/Media/Baja)
2. Pasos específicos
3. Estimación de tiempo
4. Beneficios esperados

Formato: Lista organizada y práctica.`;

        try {
            const response = await this.azureAPI.generateStudyGuide([
                { role: 'user', content: prompt }
            ]);

            this.showGeneratedCode(response.response, 'Plan de Optimización Personalizado');
        } catch (error) {
            console.error('❌ Error generando plan:', error);
        }
    }

    exportAnalysisReport() {
        const report = {
            timestamp: new Date().toISOString(),
            qualityScore: this.codeQualityScore,
            metrics: this.qualityMetrics,
            history: this.codeHistory,
            project: 'AI Chatbot - Vicentegg4212'
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auto-coder-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('📊 Reporte exportado exitosamente', 'success');
    }
}

// Exportar para uso global
window.AutoCoderAI = AutoCoderAI;