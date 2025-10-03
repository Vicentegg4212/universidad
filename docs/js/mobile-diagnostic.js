/* ================================================
   📱 DIAGNÓSTICO MÓVIL - AI STUDY GENIUS
   👨‍💻 Desarrollado por: Vicentegg4212  
   🔧 Herramientas de análisis y corrección para móviles
   ================================================ */

class MobileDiagnostic {
    constructor() {
        this.diagnosticData = {};
        this.init();
    }

    init() {
        this.createDiagnosticButton();
        this.createDiagnosticPanel();
        this.runInitialDiagnostic();
    }

    createDiagnosticButton() {
        const btn = document.createElement('button');
        btn.className = 'mobile-diagnostic-btn';
        btn.innerHTML = '🩺';
        btn.title = 'Diagnóstico Móvil';
        btn.onclick = () => this.toggleDiagnosticPanel();
        document.body.appendChild(btn);
    }

    createDiagnosticPanel() {
        const panel = document.createElement('div');
        panel.className = 'mobile-diagnostic-panel';
        panel.id = 'mobileDiagnosticPanel';
        panel.innerHTML = `
            <div class="mobile-diagnostic-header">
                <h2>📱 Diagnóstico Móvil - AI Study Genius</h2>
                <button class="mobile-diagnostic-close" onclick="mobileDiagnostic.toggleDiagnosticPanel()">✕</button>
            </div>
            
            <div class="mobile-diagnostic-section">
                <h3>🎨 Estado de CSS</h3>
                <div id="cssStatus"></div>
            </div>
            
            <div class="mobile-diagnostic-section">
                <h3>⚡ Estado de JavaScript</h3>
                <div id="jsStatus"></div>
            </div>
            
            <div class="mobile-diagnostic-section">
                <h3>📱 Información del Dispositivo</h3>
                <div id="deviceInfo"></div>
            </div>
            
            <div class="mobile-diagnostic-section">
                <h3>🌐 Estado de Red</h3>
                <div id="networkStatus"></div>
            </div>
            
            <div class="mobile-diagnostic-section">
                <h3>🎯 Funcionalidades</h3>
                <div id="featuresStatus"></div>
            </div>
            
            <div class="mobile-diagnostic-section">
                <h3>🔧 Acciones de Corrección</h3>
                <div id="fixActions">
                    <button onclick="mobileDiagnostic.forceReloadCSS()" style="background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin: 4px; cursor: pointer;">🔄 Recargar CSS</button>
                    <button onclick="mobileDiagnostic.clearCache()" style="background: #f59e0b; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin: 4px; cursor: pointer;">🗑️ Limpiar Caché</button>
                    <button onclick="mobileDiagnostic.hardRefresh()" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin: 4px; cursor: pointer;">🚀 Recarga Completa</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    toggleDiagnosticPanel() {
        const panel = document.getElementById('mobileDiagnosticPanel');
        panel.classList.toggle('active');
        
        if (panel.classList.contains('active')) {
            this.updateDiagnosticData();
        }
    }

    runInitialDiagnostic() {
        // Ejecutar diagnóstico silencioso
        setTimeout(() => {
            this.checkCSSLoaded();
            this.checkJavaScriptModules();
            this.detectMobileIssues();
        }, 2000);
    }

    checkCSSLoaded() {
        const cssChecks = [
            { name: 'Variables CSS', test: () => this.testCSSVariable('--primary', '#6366f1') },
            { name: 'Mobile Styles', test: () => this.testCSSClass('container') },
            { name: 'Biblioteca Personal', test: () => this.testCSSClass('library-floating-btn') },
            { name: 'Calculadora Científica', test: () => this.testCSSClass('calc-floating-btn') },
            { name: 'Modo Estudio', test: () => this.testCSSClass('study-floating-btn') },
            { name: 'Examen Simulado', test: () => this.testCSSClass('exam-floating-btn') },
            { name: 'Dashboard Académico', test: () => this.testCSSClass('dashboard-floating-btn') },
            { name: 'Detector Patrones', test: () => this.testCSSClass('pattern-floating-btn') }
        ];

        this.diagnosticData.css = cssChecks.map(check => ({
            name: check.name,
            status: check.test() ? 'ok' : 'error'
        }));
    }

    testCSSVariable(variable, expectedValue) {
        const testElement = document.createElement('div');
        testElement.style.cssText = `color: var(${variable}, ${expectedValue});`;
        document.body.appendChild(testElement);
        const computedColor = getComputedStyle(testElement).color;
        document.body.removeChild(testElement);
        
        return computedColor.includes('99, 102, 241') || computedColor === expectedValue;
    }

    testCSSClass(className) {
        const testElement = document.createElement('div');
        testElement.className = className;
        document.body.appendChild(testElement);
        const hasStyles = getComputedStyle(testElement).display !== 'inline';
        document.body.removeChild(testElement);
        
        return hasStyles;
    }

    checkJavaScriptModules() {
        const jsChecks = [
            { name: 'Personal Library', test: () => typeof window.personalLibrary !== 'undefined' },
            { name: 'Scientific Calculator', test: () => typeof window.scientificCalculator !== 'undefined' },
            { name: 'Study Mode', test: () => typeof window.studyMode !== 'undefined' },
            { name: 'Infographics Generator', test: () => typeof window.infographicsGenerator !== 'undefined' },
            { name: 'Flashcard System', test: () => typeof window.flashcardSystem !== 'undefined' },
            { name: 'Pattern Detector', test: () => typeof window.studyPatternDetector !== 'undefined' },
            { name: 'Academic Dashboard', test: () => typeof window.academicDashboard !== 'undefined' },
            { name: 'Exam Simulator', test: () => typeof window.examSimulator !== 'undefined' }
        ];

        this.diagnosticData.js = jsChecks.map(check => ({
            name: check.name,
            status: check.test() ? 'ok' : 'warning'
        }));
    }

    detectMobileIssues() {
        // Detectar problemas específicos de móviles
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1
        };

        this.diagnosticData.device = {
            isMobile: isMobile,
            userAgent: navigator.userAgent,
            viewport: viewport,
            touchSupport: 'ontouchstart' in window,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };

        // Verificar conectividad
        this.diagnosticData.network = {
            online: navigator.onLine,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : 'unknown'
        };
    }

    updateDiagnosticData() {
        this.checkCSSLoaded();
        this.checkJavaScriptModules();
        this.detectMobileIssues();
        this.renderDiagnosticData();
    }

    renderDiagnosticData() {
        // Renderizar estado CSS
        const cssStatus = document.getElementById('cssStatus');
        cssStatus.innerHTML = this.diagnosticData.css.map(item => `
            <div class="mobile-diagnostic-item">
                ${item.name}
                <span class="mobile-diagnostic-status ${item.status}">
                    ${item.status === 'ok' ? '✅ OK' : '❌ ERROR'}
                </span>
            </div>
        `).join('');

        // Renderizar estado JavaScript
        const jsStatus = document.getElementById('jsStatus');
        jsStatus.innerHTML = this.diagnosticData.js.map(item => `
            <div class="mobile-diagnostic-item">
                ${item.name}
                <span class="mobile-diagnostic-status ${item.status}">
                    ${item.status === 'ok' ? '✅ OK' : '⚠️ NO CARGADO'}
                </span>
            </div>
        `).join('');

        // Renderizar info del dispositivo
        const deviceInfo = document.getElementById('deviceInfo');
        deviceInfo.innerHTML = `
            <div class="mobile-diagnostic-item">Móvil: ${this.diagnosticData.device.isMobile ? 'Sí' : 'No'}</div>
            <div class="mobile-diagnostic-item">Viewport: ${this.diagnosticData.device.viewport.width}x${this.diagnosticData.device.viewport.height}</div>
            <div class="mobile-diagnostic-item">Pixel Ratio: ${this.diagnosticData.device.viewport.pixelRatio}</div>
            <div class="mobile-diagnostic-item">Touch: ${this.diagnosticData.device.touchSupport ? 'Sí' : 'No'}</div>
            <div class="mobile-diagnostic-item">Orientación: ${this.diagnosticData.device.orientation}</div>
        `;

        // Renderizar estado de red
        const networkStatus = document.getElementById('networkStatus');
        networkStatus.innerHTML = `
            <div class="mobile-diagnostic-item">En línea: ${this.diagnosticData.network.online ? 'Sí' : 'No'}</div>
            <div class="mobile-diagnostic-item">Conexión: ${JSON.stringify(this.diagnosticData.network.connection)}</div>
        `;

        // Verificar funcionalidades
        this.checkFeatures();
    }

    checkFeatures() {
        const featuresStatus = document.getElementById('featuresStatus');
        const features = [
            { name: 'Biblioteca Personal', element: '.library-floating-btn' },
            { name: 'Calculadora Científica', element: '.calc-floating-btn' },
            { name: 'Modo Estudio', element: '.study-floating-btn' },
            { name: 'Generador Infografías', element: '.infographics-floating-btn' },
            { name: 'Sistema Flashcards', element: '.flashcards-floating-btn' },
            { name: 'Detector Patrones', element: '.pattern-floating-btn' },
            { name: 'Dashboard Académico', element: '.dashboard-floating-btn' },
            { name: 'Modo Examen', element: '.exam-floating-btn' }
        ];

        featuresStatus.innerHTML = features.map(feature => {
            const element = document.querySelector(feature.element);
            const status = element ? 'ok' : 'error';
            return `
                <div class="mobile-diagnostic-item">
                    ${feature.name}
                    <span class="mobile-diagnostic-status ${status}">
                        ${status === 'ok' ? '✅ VISIBLE' : '❌ NO VISIBLE'}
                    </span>
                </div>
            `;
        }).join('');
    }

    forceReloadCSS() {
        console.log('🔄 Forzando recarga de CSS...');
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            const href = link.href;
            const separator = href.includes('?') ? '&' : '?';
            const newHref = href + separator + 'mobile_reload=' + Date.now();
            const newLink = link.cloneNode();
            newLink.href = newHref;
            newLink.onload = () => {
                link.remove();
                console.log('✅ CSS recargado:', newHref);
            };
            link.parentNode.insertBefore(newLink, link.nextSibling);
        });
        
        setTimeout(() => {
            this.updateDiagnosticData();
            alert('✅ CSS recargado. Revisa el diagnóstico.');
        }, 2000);
    }

    clearCache() {
        console.log('🗑️ Limpiando caché...');
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister();
                });
            });
        }
        
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        localStorage.clear();
        sessionStorage.clear();
        
        alert('🗑️ Caché limpiado. Recarga la página.');
    }

    hardRefresh() {
        console.log('🚀 Recarga completa...');
        window.location.href = window.location.href + '?hard_refresh=' + Date.now();
    }
}

// Inicializar diagnóstico móvil
const mobileDiagnostic = new MobileDiagnostic();

// Exportar para uso global
window.mobileDiagnostic = mobileDiagnostic;