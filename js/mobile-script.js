// ================================================
// 🚀 AI STUDY GENIUS - MOBILE JAVASCRIPT
// 👨‍💻 Desarrollado por: Vicentegg4212  
// 📱 Optimizado para experiencia móvil premium
// ================================================

class MobileAIApp {
    constructor() {
        this.currentUser = null;
        this.chatHistory = [];
        this.imageFile = null;
        this.isTyping = false;
        
        // Configuración Azure OpenAI
        this.azureConfig = {
            endpoint: "https://ceinnova05162-5325-resource.cognitiveservices.azure.com/",
            apiKey: "5AobTefY3p7mkeceBRQYdEQNtc6uz2F8Aio9fZ2iqDRvLh4thDeXJQQJ99BJACHYHv6XJ3w3AAAAACOGB4kA",
            deployment: "gpt-4o",
            apiVersion: "2024-08-01-preview"
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Iniciando AI Study Genius Mobile...');
        this.initializeElements();
        this.attachEventListeners();
        this.initializeAuth();
        this.addTouchFeedback();
        this.initializeSwipeGestures();
        
        // Mostrar indicador de versión móvil
        this.showVersionIndicator();
    }
    
    initializeElements() {
        // Auth elements
        this.authSection = document.getElementById('authSection');
        this.appSection = document.getElementById('appSection');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.showRegisterLink = document.getElementById('showRegister');
        this.showLoginLink = document.getElementById('showLogin');
        
        // App elements
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.textInput = document.getElementById('textInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.takePhotoBtn = document.getElementById('takePhotoBtn');
        this.selectPhotoBtn = document.getElementById('selectPhotoBtn');
        this.micBtn = document.getElementById('micBtn');
        this.clearChatBtn = document.getElementById('clearChatBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.imageInput = document.getElementById('imageInput');
    }
    
    attachEventListeners() {
        // Auth listeners
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        this.showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });
        this.showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
        
        // App listeners
        this.textInput.addEventListener('input', () => this.updateSendButton());
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.takePhotoBtn.addEventListener('click', () => this.takePhoto());
        this.selectPhotoBtn.addEventListener('click', () => this.selectPhoto());
        this.micBtn.addEventListener('click', () => this.toggleMicrophone());
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.logoutBtn.addEventListener('click', () => this.logout());
        
        this.imageInput.addEventListener('change', (e) => this.handleImageSelect(e));
        
        // Prevent zoom on input focus (iOS)
        this.textInput.addEventListener('focus', () => {
            document.body.style.zoom = '1';
        });
    }
    
    addTouchFeedback() {
        // Agregar efecto ripple a todos los botones táctiles
        const touchButtons = document.querySelectorAll('.touch-btn, .header-btn, .auth-button');
        
        touchButtons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                this.createRipple(e, button);
            });
            
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
                
                // Vibration feedback si está disponible
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left - size / 2;
        const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    initializeSwipeGestures() {
        let startY = 0;
        let startX = 0;
        
        this.chatMessages.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });
        
        this.chatMessages.addEventListener('touchmove', (e) => {
            // Prevent rubber band effect
            if (this.chatMessages.scrollTop === 0 && e.touches[0].clientY > startY) {
                e.preventDefault();
            }
        });
    }
    
    showVersionIndicator() {
        const indicator = document.createElement('div');
        indicator.textContent = '📱 Mobile v2.0';
        indicator.style.cssText = `
            position: fixed;
            top: 70px;
            right: 16px;
            background: var(--primary);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            z-index: 1001;
            animation: slideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => indicator.remove(), 500);
        }, 3000);
    }
    
    // ============== AUTH METHODS ==============
    
    initializeAuth() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.showApp();
        }
    }
    
    handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simulación de autenticación
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user || email && password) {
            this.currentUser = email;
            localStorage.setItem('currentUser', email);
            this.showApp();
            this.showNotification('¡Bienvenido! 🎉', 'success');
        } else {
            this.showNotification('Credenciales incorrectas ❌', 'error');
        }
    }
    
    handleRegister(event) {
        event.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.email === email)) {
            this.showNotification('Email ya registrado ⚠️', 'warning');
            return;
        }
        
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        this.currentUser = email;
        localStorage.setItem('currentUser', email);
        this.showApp();
        this.showNotification('¡Cuenta creada! 🎉', 'success');
    }
    
    showRegisterForm() {
        this.loginForm.style.display = 'none';
        this.registerForm.style.display = 'block';
    }
    
    showLoginForm() {
        this.registerForm.style.display = 'none';
        this.loginForm.style.display = 'block';
    }
    
    showApp() {
        this.authSection.style.display = 'none';
        this.appSection.style.display = 'block';
        this.loadChatHistory();
    }
    
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.chatHistory = [];
        this.authSection.style.display = 'flex';
        this.appSection.style.display = 'none';
        this.showLoginForm();
        this.showNotification('Sesión cerrada 👋', 'info');
    }
    
    // ============== CHAT METHODS ==============
    
    loadChatHistory() {
        const history = JSON.parse(localStorage.getItem(`chat_${this.currentUser}`) || '[]');
        this.chatHistory = history;
        
        if (history.length === 0) {
            this.welcomeScreen.style.display = 'block';
            this.chatContainer.style.display = 'none';
        } else {
            this.welcomeScreen.style.display = 'none';
            this.chatContainer.style.display = 'block';
            this.renderMessages();
        }
    }
    
    saveChatHistory() {
        localStorage.setItem(`chat_${this.currentUser}`, JSON.stringify(this.chatHistory));
    }
    
    renderMessages() {
        this.chatMessages.innerHTML = '';
        
        this.chatHistory.forEach(message => {
            this.addMessageToDOM(message);
        });
        
        this.scrollToBottom();
    }
    
    addMessageToDOM(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.role}`;
        
        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'message-bubble';
        
        const contentEl = document.createElement('div');
        contentEl.className = 'message-content';
        
        // Agregar imagen si existe
        if (message.image) {
            const img = document.createElement('img');
            img.src = message.image;
            img.className = 'image-preview';
            img.alt = 'Imagen enviada';
            contentEl.appendChild(img);
        }
        
        // Agregar texto con renderizado matemático
        const textEl = document.createElement('div');
        textEl.innerHTML = this.formatMessage(message.text);
        contentEl.appendChild(textEl);
        
        bubbleEl.appendChild(contentEl);
        
        // Agregar timestamp
        const timeEl = document.createElement('div');
        timeEl.className = 'message-time';
        timeEl.textContent = this.formatTime(message.timestamp);
        
        messageEl.appendChild(bubbleEl);
        messageEl.appendChild(timeEl);
        
        this.chatMessages.appendChild(messageEl);
        
        // Renderizar matemáticas si existen
        this.renderMathInElement(messageEl);
    }
    
    updateSendButton() {
        const hasText = this.textInput.value.trim() !== '';
        const hasImage = this.imageFile !== null;
        const canSend = (hasText || hasImage) && !this.isTyping;
        
        this.sendBtn.disabled = !canSend;
        this.sendBtn.className = canSend ? 'btn-send touch-btn enabled' : 'btn-send touch-btn';
        
        // Actualizar placeholder
        if (hasImage) {
            this.textInput.placeholder = 'Describe qué quieres saber de la imagen...';
        } else {
            this.textInput.placeholder = 'Pregúntame algo...';
        }
    }
    
    async sendMessage() {
        if (this.isTyping) return;
        
        const text = this.textInput.value.trim();
        const image = this.imageFile;
        
        if (!text && !image) return;
        
        // Ocultar welcome screen
        this.welcomeScreen.style.display = 'none';
        this.chatContainer.style.display = 'block';
        
        // Agregar mensaje del usuario
        const userMessage = {
            role: 'user',
            text: text || 'Imagen enviada',
            timestamp: new Date().toISOString(),
            image: image ? await this.fileToBase64(image) : null
        };
        
        this.chatHistory.push(userMessage);
        this.addMessageToDOM(userMessage);
        
        // Limpiar input
        this.textInput.value = '';
        this.imageFile = null;
        this.updateSendButton();
        
        // Mostrar indicador de typing
        this.showTypingIndicator();
        
        try {
            // Enviar a Azure OpenAI
            const response = await this.callAzureOpenAI(text, userMessage.image);
            
            const assistantMessage = {
                role: 'assistant',
                text: response.content,
                timestamp: new Date().toISOString()
            };
            
            this.chatHistory.push(assistantMessage);
            this.hideTypingIndicator();
            this.addMessageToDOM(assistantMessage);
            
        } catch (error) {
            console.error('Error:', error);
            this.hideTypingIndicator();
            
            const errorMessage = {
                role: 'assistant',
                text: '❌ Lo siento, ocurrió un error. Por favor intenta de nuevo.',
                timestamp: new Date().toISOString()
            };
            
            this.chatHistory.push(errorMessage);
            this.addMessageToDOM(errorMessage);
            this.showNotification('Error de conexión ⚠️', 'error');
        }
        
        this.saveChatHistory();
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.updateSendButton();
        
        const typingEl = document.createElement('div');
        typingEl.className = 'message assistant loading-message';
        typingEl.id = 'typingIndicator';
        
        typingEl.innerHTML = `
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <span style="margin-left: 8px; color: var(--text-secondary);">AI está escribiendo...</span>
            </div>
        `;
        
        this.chatMessages.appendChild(typingEl);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.updateSendButton();
        
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    async callAzureOpenAI(text, imageBase64) {
        console.log('📤 Enviando a Azure OpenAI...');
        
        const messages = [
            {
                role: "system",
                content: `Eres un asistente educativo experto creado por Vicentegg4212, especializado en MATEMÁTICAS de nivel PROFESIONAL.

🧮 ESPECIALIZACIÓN MATEMÁTICA:
- Resuelves TODOS los cálculos paso a paso como un humano experto
- Muestras CADA operación realizada detalladamente
- Verificas que todos los resultados sean 100% EXACTOS
- Usas notación LaTeX para ecuaciones perfectas: $ecuación$ o $$ecuación$$
- Explicas el razonamiento detrás de cada paso

📚 FUNCIONES GENERALES:
- Crear guías de estudio completas
- Explicar conceptos claramente  
- Proporcionar ejemplos prácticos
- Analizar imágenes educativas
- Resolver dudas académicas

🔢 FORMATO MATEMÁTICO OBLIGATORIO:
Para CUALQUIER contenido matemático:
1. **Problema**: Reformula la pregunta claramente
2. **Datos**: Lista lo que se conoce
3. **Fórmulas**: Muestra las ecuaciones necesarias en LaTeX
4. **Paso a paso**: Cada operación detallada
5. **Verificación**: Comprueba el resultado
6. **Respuesta final**: Destacada claramente

EJEMPLO:
**Problema**: Resolver $2x + 5 = 13$
**Datos**: Ecuación lineal con una incógnita
**Fórmulas**: $ax + b = c → x = \\frac{c - b}{a}$
**Paso a paso**:
1. $2x + 5 = 13$
2. $2x = 13 - 5$ (restamos 5 a ambos lados)
3. $2x = 8$
4. $x = \\frac{8}{2}$ (dividimos entre 2)
5. $x = 4$
**Verificación**: $2(4) + 5 = 8 + 5 = 13$ ✓
**Respuesta**: $x = 4$

FORMATO GENERAL:
- Usa emojis para mejor visualización
- Estructura clara con títulos
- Ejemplos cuando sea necesario  
- Conciso pero completo
- Amigable y profesional

Para imágenes: analiza detalladamente el contenido educativo, especialmente si contiene matemáticas.`
            }
        ];
        
        // Construir mensaje del usuario
        const userMessage = {
            role: "user",
            content: []
        };
        
        // Detectar si es contenido matemático y agregar contexto especial
        const isMathContent = this.detectMathContent(text) || imageBase64;
        
        if (text) {
            let enhancedText = text;
            
            // Si detectamos matemáticas, añadir instrucciones especiales
            if (isMathContent) {
                enhancedText = `[CONTENIDO MATEMÁTICO DETECTADO] ${text}

Por favor:
1. Muestra TODOS los cálculos paso a paso
2. Usa notación LaTeX para ecuaciones: $ecuación$ o $$ecuación$$
3. Verifica que todos los resultados sean 100% exactos
4. Formatea usando las secciones: **Problema**, **Datos**, **Fórmulas**, **Paso a paso**, **Verificación**, **Respuesta**
5. Si hay imagen, analiza matemáticamente todo lo visible`;
            }
            
            userMessage.content.push({
                type: "text",
                text: enhancedText
            });
        }
        
        if (imageBase64) {
            const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
            userMessage.content.push({
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Data}`
                }
            });
        }
        
        if (userMessage.content.length === 0) {
            userMessage.content.push({
                type: "text",
                text: "¿Puedes ayudarme con esto?"
            });
        }
        
        messages.push(userMessage);
        
        const response = await fetch(`${this.azureConfig.endpoint}openai/deployments/${this.azureConfig.deployment}/chat/completions?api-version=${this.azureConfig.apiVersion}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.azureConfig.apiKey
            },
            body: JSON.stringify({
                messages: messages,
                max_tokens: 2000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Azure OpenAI Error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        return {
            content: data.choices[0].message.content
        };
    }
    
    // ============== MEDIA METHODS ==============
    
    takePhoto() {
        this.imageInput.setAttribute('capture', 'environment');
        this.imageInput.click();
    }
    
    selectPhoto() {
        this.imageInput.removeAttribute('capture');
        this.imageInput.click();
    }
    
    handleImageSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.imageFile = file;
            this.updateSendButton();
            this.showNotification(`📷 Imagen seleccionada: ${file.name}`, 'success');
            
            // Vibrar para feedback
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        }
    }
    
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    toggleMicrophone() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.startSpeechRecognition();
        } else {
            this.showNotification('Reconocimiento de voz no disponible 🎤', 'warning');
        }
    }
    
    startSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        this.micBtn.style.background = 'var(--error)';
        this.micBtn.style.animation = 'pulse 1s infinite';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.textInput.value = transcript;
            this.updateSendButton();
            this.showNotification(`🎤 "${transcript}"`, 'success');
        };
        
        recognition.onerror = (event) => {
            this.showNotification('Error en reconocimiento de voz ❌', 'error');
        };
        
        recognition.onend = () => {
            this.micBtn.style.background = 'var(--warning)';
            this.micBtn.style.animation = '';
        };
        
        recognition.start();
        
        // Vibrar para indicar inicio
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
    }
    
    // ============== UTILITY METHODS ==============
    
    clearChat() {
        this.chatHistory = [];
        this.saveChatHistory();
        this.welcomeScreen.style.display = 'block';
        this.chatContainer.style.display = 'none';
        this.showNotification('Chat limpiado 🧹', 'info');
    }
    
    formatMessage(text) {
        let formatted = text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px;">$1</code>')
            .replace(/### (.*?)(\n|<br>|$)/g, '<h3 style="margin: 12px 0 8px 0; color: var(--primary);">$1</h3>')
            .replace(/## (.*?)(\n|<br>|$)/g, '<h2 style="margin: 16px 0 12px 0; color: var(--primary);">$1</h2>')
            .replace(/# (.*?)(\n|<br>|$)/g, '<h1 style="margin: 20px 0 16px 0; color: var(--primary);">$1</h1>');
        
        // Detectar y formatear contenido matemático
        formatted = this.formatMathematicalContent(formatted);
        
        return formatted;
    }
    
    formatMathematicalContent(text) {
        // Detectar patrones matemáticos y agregarles clases especiales
        let formatted = text;
        
        // Detectar secciones de problema matemático
        formatted = formatted.replace(/\*\*Problema\*\*:/g, '<div class="math-step"><strong style="color: var(--primary);">🎯 Problema:</strong>');
        formatted = formatted.replace(/\*\*Datos\*\*:/g, '</div><div class="math-step"><strong style="color: var(--secondary);">📊 Datos:</strong>');
        formatted = formatted.replace(/\*\*Fórmulas\*\*:/g, '</div><div class="math-step"><strong style="color: var(--warning);">📐 Fórmulas:</strong>');
        formatted = formatted.replace(/\*\*Paso a paso\*\*:/g, '</div><div class="math-step"><strong style="color: var(--success);">🔢 Paso a paso:</strong>');
        formatted = formatted.replace(/\*\*Verificación\*\*:/g, '</div><div class="math-verification"><strong style="color: var(--success);">✅ Verificación:</strong>');
        formatted = formatted.replace(/\*\*Respuesta\*\*:/g, '</div><div class="math-result"><strong style="color: var(--primary);">🎉 Respuesta:</strong>');
        
        // Cerrar divs abiertos
        if (formatted.includes('<div class="math-')) {
            formatted += '</div>';
        }
        
        return formatted;
    }
    
    renderMathInElement(element) {
        // Renderizar matemáticas con MathJax cuando esté disponible
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([element]).catch((err) => {
                console.log('MathJax error:', err);
            });
        }
    }
    
    detectMathContent(text) {
        // Detectar si el texto contiene contenido matemático
        const mathPatterns = [
            /\$.*?\$/,  // LaTeX inline
            /\$\$.*?\$\$/,  // LaTeX display
            /\d+\s*[\+\-\*\/\=]\s*\d+/,  // Operaciones básicas
            /[xy]\s*[\+\-\*\/\=]/,  // Variables algebraicas
            /\b(sen|cos|tan|log|ln|sqrt|∫|∂|∑)\b/,  // Funciones matemáticas
            /\d+\^\d+/,  // Exponentes
            /(ecuaci[óo]n|f[óo]rmula|calcul|resol|matemática)/i  // Palabras clave
        ];
        
        return mathPatterns.some(pattern => pattern.test(text));
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const colors = {
            success: 'var(--success)',
            error: 'var(--error)',
            warning: 'var(--warning)',
            info: 'var(--primary)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 500;
            z-index: 1001;
            animation: slideDown 0.3s ease-out;
            max-width: 90%;
            text-align: center;
            box-shadow: var(--shadow-lg);
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============== CSS ANIMATIONS ==============
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============== INITIALIZE APP ==============
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando AI Study Genius Mobile...');
    new MobileAIApp();
});

// ============== PWA SUPPORT ==============
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// ============== MOBILE OPTIMIZATIONS ==============

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Force reflow
        document.body.style.height = '100vh';
        setTimeout(() => {
            document.body.style.height = '';
        }, 100);
    }, 500);
});

// Prevent pull-to-refresh
document.body.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    
    const scrollY = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollY > 0) return;
    
    document.body.style.overflow = 'hidden';
});

document.body.addEventListener('touchend', () => {
    document.body.style.overflow = '';
});

// ✅ AI STUDY GENIUS MOBILE v2.0 - ULTRA OPTIMIZADO