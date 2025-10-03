document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando AI Study Genius - Vicentegg4212...');
    console.log(`📅 Fecha actual: 2025-10-02 02:47:33 UTC`);

    // Configuración de URLs del backend
    const API_BASE_URL = 'http://localhost:3000';
    const API_ENDPOINTS = {
        health: `${API_BASE_URL}/api/health`,
        generate: `${API_BASE_URL}/api/generate`,
        generateStream: `${API_BASE_URL}/api/generate-stream`
    };

    console.log(`🔗 API configurada en: ${API_BASE_URL}`);

    // Mostrar info del modelo actual del backend (opcional, seguro)
    fetch(API_ENDPOINTS.health)
        .then(res => res.json())
        .then(data => {
            if (data.model) {
                console.log(`🤖 Modelo conectado: ${data.model}`);
                let info = document.getElementById('modelInfo');
                if (!info) {
                    info = document.createElement('div');
                    info.id = 'modelInfo';
                    info.style.cssText = `
                        position: fixed;
                        top: 10px;
                        left: 10px;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 8px;
                        font-size: 12px;
                        z-index: 1000;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    `;
                    document.body.prepend(info);
                }
                info.textContent = `🤖 ${data.model} • ${data.user}`;
            }
        })
        .catch(err => console.log('ℹ️ Info del modelo no disponible:', err.message));

    // --- VISTAS Y ELEMENTOS PRINCIPALES ---
    const authSection = document.getElementById('authSection');
    const appSection = document.getElementById('appSection');

    // --- LÓGICA DE AUTENTICACIÓN Y CUENTAS ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const themeToggle = document.getElementById('themeToggle');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    // --- LÓGICA DE BÚSQUEDA EN HISTORIAL ---
    let currentSearchTerm = '';

    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    };

    const searchHistory = (searchTerm) => {
        currentSearchTerm = searchTerm.toLowerCase().trim();
        
        if (currentSearchTerm) {
            searchClear.style.display = 'flex';
        } else {
            searchClear.style.display = 'none';
        }
        
        renderHistory();
        console.log(`🔍 Búsqueda: "${searchTerm}"`);
    };

    const clearSearch = () => {
        searchInput.value = '';
        currentSearchTerm = '';
        searchClear.style.display = 'none';
        renderHistory();
        searchInput.focus();
        console.log('🔍 Búsqueda limpiada');
    };

    // Event listeners para búsqueda
    searchInput?.addEventListener('input', (e) => {
        searchHistory(e.target.value);
    });

    searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    searchClear?.addEventListener('click', clearSearch);

    // --- LÓGICA DEL SELECTOR DE TEMA ---
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    };

    const updateThemeIcon = (theme) => {
        const icon = themeToggle?.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        console.log(`🎨 Tema cambiado a: ${newTheme}`);
        showNotification(`🎨 Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`, 'success');
    };

    themeToggle?.addEventListener('click', toggleTheme);
    
    // Inicializar tema al cargar
    initTheme();

    const showAppView = (email) => {
        const username = email.split('@')[0];
        welcomeMessage.textContent = `👋 Bienvenido, ${username}`;
        authSection.style.display = 'none';
        appSection.style.display = 'flex';
        renderHistory();
        console.log(`✅ Usuario logueado: ${username} (Vicentegg4212 - 2025-10-02 02:47:33)`);
    };

    const showAuthView = () => {
        authSection.style.display = 'flex';
        appSection.style.display = 'none';
        clearCurrentUser();
        console.log('🔒 Mostrando vista de autenticación');
    };

    showRegister?.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin?.addEventListener('click', () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // --- MANEJO DE DATOS CON LOCALSTORAGE ---
    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
    const getCurrentUser = () => localStorage.getItem('currentUser');
    const setCurrentUser = (email) => localStorage.setItem('currentUser', email);
    const clearCurrentUser = () => localStorage.removeItem('currentUser');
    const getChatHistory = (email) => JSON.parse(localStorage.getItem(`chat_${email}`)) || [];
    const saveChatHistory = (email, history) => localStorage.setItem(`chat_${email}`, JSON.stringify(history));

    // --- LÓGICA DE LOGIN/REGISTRO/LOGOUT ---
    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        const users = getUsers();
        if (users.find(user => user.email === email)) {
            alert('Este email ya está registrado');
            return;
        }

        users.push({ email, password });
        saveUsers(users);
        setCurrentUser(email);
        showAppView(email);
    });

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            setCurrentUser(email);
            showAppView(email);
        } else {
            alert('Credenciales incorrectas');
        }
    });

    logoutBtn?.addEventListener('click', () => {
        showAuthView();
    });

    const checkSession = () => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            showAppView(currentUser);
        } else {
            showAuthView();
        }
    };

    // =======================================================
    // ======== LÓGICA DEL GENERADOR DE GUÍAS (AZURE OPENAI) =========
    // =======================================================
    const textInput = document.getElementById('textInput');
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const selectPhotoBtn = document.getElementById('selectPhotoBtn');
    const micBtn = document.getElementById('micBtn');
    const generateBtn = document.getElementById('generateBtn');
    const templatesBtn = document.getElementById('templatesBtn');
    const templatesSection = document.getElementById('templatesSection');
    const imageInput = document.getElementById('imageInput');
    const chatHistoryContainer = document.getElementById('chatHistory');
    const welcomeTitle = document.getElementById('welcomeTitle');
    let imageFile = null;

    // --- SISTEMA DE PLANTILLAS ---
    const templates = {
        summary: {
            title: "📚 Resumen de Texto",
            prompt: "Por favor, crea un resumen completo y estructurado del siguiente texto. Incluye:\n\n1. 🎯 Ideas principales\n2. 📋 Puntos clave\n3. 💡 Conceptos importantes\n4. 📝 Conclusiones\n\nTexto a resumir:\n"
        },
        math: {
            title: "🔢 Resolver Matemáticas", 
            prompt: "Ayúdame a resolver este problema matemático paso a paso. Por favor:\n\n1. 📖 Explica el concepto involucrado\n2. 🔍 Identifica qué método usar\n3. 📝 Resuelve paso a paso\n4. ✅ Verifica la respuesta\n5. 💡 Da consejos para problemas similares\n\nProblema:\n"
        },
        essay: {
            title: "📝 Ayuda con Ensayo",
            prompt: "Ayúdame con mi ensayo. Por favor proporciona:\n\n1. 🎯 Estructura sugerida\n2. 💡 Ideas principales para desarrollar\n3. 📚 Puntos de argumentación\n4. 🔗 Cómo conectar ideas\n5. ✍️ Consejos de redacción\n\nTema del ensayo:\n"
        },
        science: {
            title: "🧬 Explicar Ciencia",
            prompt: "Explica este concepto científico de manera clara y didáctica:\n\n1. 🔬 Definición simple\n2. 📖 Explicación detallada\n3. 🌟 Ejemplos de la vida real\n4. 💡 Conceptos relacionados\n5. 🎯 Aplicaciones prácticas\n\nConcepto a explicar:\n"
        },
        history: {
            title: "🏛️ Contexto Histórico",
            prompt: "Proporciona información histórica completa sobre:\n\n1. 📅 Contexto temporal\n2. 🌍 Situación geográfica/social\n3. 👥 Personajes importantes\n4. ⚡ Eventos clave\n5. 📈 Consecuencias e impacto\n6. 🔗 Conexiones con otros eventos\n\nTema histórico:\n"
        },
        language: {
            title: "🌍 Idiomas",
            prompt: "Ayúdame con este idioma:\n\n1. 📝 Traducción precisa\n2. 📖 Explicación gramatical\n3. 🗣️ Pronunciación (si aplica)\n4. 💡 Uso en contexto\n5. 🎯 Expresiones similares\n6. 📚 Consejos para recordar\n\nTexto o concepto:\n"
        }
    };

    let templatesVisible = false;

    const toggleTemplates = () => {
        templatesVisible = !templatesVisible;
        templatesSection.style.display = templatesVisible ? 'block' : 'none';
        
        const icon = templatesBtn.querySelector('.material-symbols-outlined');
        icon.textContent = templatesVisible ? 'close' : 'description';
        
        console.log(`📋 Plantillas ${templatesVisible ? 'mostradas' : 'ocultadas'}`);
    };

    const applyTemplate = (templateKey) => {
        const template = templates[templateKey];
        if (template) {
            textInput.value = template.prompt;
            textInput.focus();
            
            // Posicionar cursor al final
            textInput.setSelectionRange(textInput.value.length, textInput.value.length);
            
            updateSendButtonState();
            toggleTemplates(); // Ocultar plantillas
            
            console.log(`📋 Plantilla aplicada: ${template.title}`);
            showNotification(`📋 Plantilla "${template.title}" aplicada`, 'success');
        }
    };

    // Event listeners para plantillas
    templatesBtn?.addEventListener('click', toggleTemplates);
    
    // Agregar event listeners a todos los botones de plantilla
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('template-btn')) {
            const templateKey = e.target.getAttribute('data-template');
            applyTemplate(templateKey);
        }
    });

    // Cerrar plantillas al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (templatesVisible && 
            !templatesSection.contains(e.target) && 
            !templatesBtn.contains(e.target)) {
            toggleTemplates();
        }
    });

    if (!textInput || !generateBtn || !chatHistoryContainer) {
        console.error('❌ Elementos del DOM no encontrados');
        return;
    }

    console.log('✅ Elementos del DOM encontrados correctamente');

    const renderHistory = () => {
        const email = getCurrentUser();
        if (!email) {
            console.log('❌ No hay usuario logueado');
            return;
        }

        const history = getChatHistory(email);
        chatHistoryContainer.innerHTML = '';

        // Filtrar mensajes según búsqueda
        let filteredHistory = history;
        if (currentSearchTerm) {
            filteredHistory = history.filter(message => 
                message.text && message.text.toLowerCase().includes(currentSearchTerm)
            );
        }

        if (filteredHistory.length === 0) {
            if (currentSearchTerm) {
                // Mostrar mensaje de no resultados
                chatHistoryContainer.innerHTML = `
                    <div class="no-results">
                        🔍 No se encontraron mensajes que contengan "${currentSearchTerm}"
                        <br><br>
                        <button onclick="document.getElementById('searchInput').value=''; document.querySelector('#searchClear').click();" 
                                style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">
                            Limpiar búsqueda
                        </button>
                    </div>
                `;
            } else if (welcomeTitle) {
                welcomeTitle.style.display = 'block';
            }
        } else {
            if (welcomeTitle) welcomeTitle.style.display = 'none';
            
            filteredHistory.forEach((message, index) => {
                const messageElement = createMessageElement(message, index, currentSearchTerm);
                chatHistoryContainer.appendChild(messageElement);
            });
        }

        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
        console.log(`📝 Historial renderizado: ${filteredHistory.length}/${history.length} mensajes${currentSearchTerm ? ` (filtrado por: "${currentSearchTerm}")` : ''}`);
    };

    const createMessageElement = (message, index, searchTerm = '') => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        messageDiv.id = `message-${index}`;

        if (message.isLoading) {
            messageDiv.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    🤖 Generando respuesta con Azure OpenAI...
                </div>
            `;
        } else if (message.isStreaming) {
            const timestamp = new Date().toLocaleTimeString();
            const roleLabel = '🧠 AI Study Assistant';

            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="role">${roleLabel}</span>
                        <span class="timestamp">${timestamp}</span>
                        <span class="streaming-indicator">✨ Escribiendo...</span>
                    </div>
                    <div class="message-text">${formatMessage(message.text || '')}</div>
                </div>
            `;
        } else {
            const timestamp = new Date().toLocaleTimeString();
            const roleLabel = message.role === 'user' ? '👤 Tú' : '🧠 AI Study Assistant';
            
            // Aplicar resaltado si hay término de búsqueda
            let messageText = formatMessage(message.text || 'Sin contenido');
            if (searchTerm) {
                messageText = highlightText(messageText, searchTerm);
                messageDiv.classList.add('highlighted');
            }

            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="role">${roleLabel}</span>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    ${message.image ? `<img src="${message.image}" alt="Imagen enviada" class="message-image">` : ''}
                    <div class="message-text">${messageText}</div>
                    ${message.metadata ? `<div class="message-metadata">
                        ${message.metadata.processing_time_ms ? `⏱️ ${message.metadata.processing_time_ms}ms` : ''}
                        ${message.metadata.word_count ? ` • 📝 ${message.metadata.word_count} palabras` : ''}
                        ${message.metadata.model_used ? ` • 🤖 ${message.metadata.model_used}` : ''}
                    </div>` : ''}
                </div>
            `;
        }

        return messageDiv;
    };

    const formatMessage = (text) => {
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/### (.*?)(\n|<br>)/g, '<h3>$1</h3>')
            .replace(/## (.*?)(\n|<br>)/g, '<h2>$1</h2>')
            .replace(/# (.*?)(\n|<br>)/g, '<h1>$1</h1>');
    };

    const updateSendButtonState = () => {
        const hasText = textInput.value.trim() !== '';
        const hasImage = imageFile !== null;
        const isEnabled = hasText || hasImage;

        generateBtn.classList.toggle('enabled', isEnabled);
        generateBtn.disabled = !isEnabled;

        console.log(`🔘 Botón estado: ${isEnabled ? 'habilitado' : 'deshabilitado'} (texto: ${hasText}, imagen: ${hasImage})`);
    };

    textInput.addEventListener('input', updateSendButtonState);
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (generateBtn.classList.contains('enabled')) {
                handleSendMessage();
            }
        }
    });

    takePhotoBtn?.addEventListener('click', () => {
        imageInput.setAttribute('capture', 'environment');
        imageInput.value = '';
        imageInput.click();
    });

    selectPhotoBtn?.addEventListener('click', () => {
        imageInput.removeAttribute('capture');
        imageInput.value = '';
        imageInput.click();
    });

    imageInput?.addEventListener('change', (e) => {
        imageFile = e.target.files[0];
        updateSendButtonState();
        if (imageFile) {
            console.log(`📷 Imagen seleccionada: ${imageFile.name}`);
        }
    });

    // --- RECONOCIMIENTO DE VOZ ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;

        micBtn?.addEventListener('click', () => {
            console.log('🎤 Iniciando reconocimiento de voz...');
            recognition.start();
        });

        recognition.addEventListener('result', (event) => {
            const transcript = event.results[0][0].transcript;
            textInput.value = transcript;
            updateSendButtonState();
            console.log(`🎤 Texto reconocido: ${transcript}`);
        });

        recognition.addEventListener('error', (event) => {
            console.error('❌ Error en reconocimiento de voz:', event.error);
        });
    } else {
        if (micBtn) micBtn.style.display = 'none';
        console.log('❌ Reconocimiento de voz no disponible');
    }

    // --- FUNCIÓN PRINCIPAL DE ENVÍO AZURE OPENAI ---
    const handleSendMessage = async () => {
        console.log('📤 Iniciando envío de mensaje... (Vicentegg4212 - 2025-10-02 02:47:33)');

        if (!generateBtn.classList.contains('enabled')) {
            console.log('❌ Botón no habilitado, cancelando envío');
            return;
        }

        const email = getCurrentUser();
        if (!email) {
            console.error('❌ No hay usuario logueado');
            alert('Debes estar logueado para enviar mensajes');
            return;
        }

        const text = textInput.value.trim();
        const currentImageFile = imageFile;

        if (!text && !currentImageFile) {
            console.log('❌ No hay texto ni imagen para enviar');
            return;
        }

        console.log(`📝 Enviando mensaje: "${text}" (imagen: ${currentImageFile ? 'sí' : 'no'})`);

        imageFile = null;
        textInput.value = '';
        updateSendButtonState();

        // Deshabilitar temporalmente el botón
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span>';

        try {
            await processSendMessage(text, currentImageFile, email);
        } catch (error) {
            console.error('❌ Error en processSendMessage:', error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="material-symbols-outlined">send</span>';
            updateSendButtonState();
        }
    };

    // --- MANEJO MEJORADO DE ERRORES ---
    const getErrorDetails = (error) => {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            return {
                code: 'NETWORK_ERROR',
                message: 'Error de conectividad de red',
                shortMessage: 'Sin conexión al servidor',
                solutions: [
                    'Verifica tu conexión a internet',
                    'Asegúrate que el servidor esté ejecutándose en localhost:3000',
                    'Revisa el firewall o proxy',
                    'Intenta recargar la página'
                ]
            };
        }
        
        if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
            return {
                code: 'AUTH_ERROR',
                message: 'Error de autenticación con Azure OpenAI',
                shortMessage: 'Error de autenticación',
                solutions: [
                    'Verifica la API key de Azure OpenAI en el servidor',
                    'Comprueba que la clave no haya expirado',
                    'Revisa la configuración del endpoint',
                    'Contacta al administrador del sistema'
                ]
            };
        }
        
        if (errorMessage.includes('429') || errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
            return {
                code: 'RATE_LIMIT',
                message: 'Límite de uso de API excedido',
                shortMessage: 'Límite de uso excedido',
                solutions: [
                    'Espera unos minutos antes de volver a intentar',
                    'El límite se restablece automáticamente',
                    'Considera upgrading el plan de Azure OpenAI',
                    'Intenta con mensajes más cortos'
                ]
            };
        }
        
        if (errorMessage.includes('500') || errorMessage.includes('internal server')) {
            return {
                code: 'SERVER_ERROR',
                message: 'Error interno del servidor',
                shortMessage: 'Error del servidor',
                solutions: [
                    'El problema es temporal, intenta de nuevo',
                    'Verifica los logs del servidor',
                    'Reinicia el servidor si es posible',
                    'Reporta el error si persiste'
                ]
            };
        }
        
        if (errorMessage.includes('timeout')) {
            return {
                code: 'TIMEOUT_ERROR',
                message: 'Tiempo de espera agotado',
                shortMessage: 'Tiempo de espera agotado',
                solutions: [
                    'La respuesta está tomando demasiado tiempo',
                    'Intenta con un mensaje más corto',
                    'Verifica la estabilidad de la conexión',
                    'Espera un momento y vuelve a intentar'
                ]
            };
        }
        
        if (errorMessage.includes('json') || errorMessage.includes('parse')) {
            return {
                code: 'PARSE_ERROR',
                message: 'Error al procesar la respuesta del servidor',
                shortMessage: 'Error de formato de respuesta',
                solutions: [
                    'La respuesta del servidor está malformada',
                    'Verifica la configuración del servidor',
                    'Intenta recargar la página',
                    'Reporta este error técnico'
                ]
            };
        }
        
        // Error genérico
        return {
            code: 'UNKNOWN_ERROR',
            message: error.message || 'Error desconocido',
            shortMessage: 'Error inesperado',
            solutions: [
                'Intenta recargar la página',
                'Verifica tu conexión a internet',
                'Limpia el caché del navegador',
                'Contacta soporte técnico si persiste'
            ]
        };
    };

    // --- SISTEMA DE REINTENTOS ---
    const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 Intento ${attempt}/${maxRetries}`);
                return await requestFn();
            } catch (error) {
                console.warn(`⚠️ Intento ${attempt} falló:`, error.message);
                
                if (attempt === maxRetries) {
                    throw error;
                }
                
                // Esperar antes del siguiente intento
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
                
                showNotification(`🔄 Reintentando... (${attempt}/${maxRetries})`, 'info');
            }
        }
    };

    // --- FUNCIÓN DE PROCESAMIENTO DE MENSAJE CON STREAMING ---
    const processSendMessage = async (text, currentImageFile, email) => {
        const handleSend = async (imageB64) => {
            const userMessage = {
                role: 'user',
                text: text || 'Imagen enviada',
                timestamp: new Date().toISOString()
            };
            if (imageB64) userMessage.image = imageB64;

            let history = getChatHistory(email);
            history.push(userMessage);
            saveChatHistory(email, history);
            renderHistory();

            console.log('👤 Mensaje del usuario agregado al historial');

            // Agregar mensaje de IA en streaming
            const streamingMessage = {
                role: 'assistant',
                text: '',
                timestamp: new Date().toISOString(),
                isStreaming: true
            };
            history.push(streamingMessage);
            saveChatHistory(email, history);
            renderHistory();

            const lastMessageElement = chatHistoryContainer.lastElementChild;
            const messageTextElement = lastMessageElement?.querySelector('.message-text');

            console.log('⏳ Iniciando streaming...');

            // Preparar datos para la API
            const lastMessage = text || 'Analiza esta imagen y crea una guía de estudio';

            const azureHistory = history
                .filter(msg => !msg.isLoading && !msg.isStreaming && msg.text)
                .slice(-10)
                .map(msg => ({
                    role: msg.role,
                    content: msg.text
                }));

            if (azureHistory.length > 0 && azureHistory[azureHistory.length - 1].role === 'user') {
                azureHistory.pop();
            }

            try {
                const requestBody = {
                    history: azureHistory,
                    lastMessage: lastMessage,
                    imageB64: imageB64
                };

                console.log('📦 Enviando petición con streaming...');
                
                const response = await retryRequest(async () => {
                    return await fetch(API_ENDPOINTS.generateStream, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'text/plain'
                        },
                        body: JSON.stringify(requestBody)
                    });
                }, 2, 2000);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const reader = response.body?.getReader();
                if (!reader) {
                    throw new Error('No se pudo obtener el reader del stream');
                }

                const decoder = new TextDecoder();
                let accumulatedText = '';

                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.trim()) {
                            try {
                                const data = JSON.parse(line);
                                
                                if (data.type === 'chunk' && data.content) {
                                    accumulatedText += data.content;
                                    if (messageTextElement) {
                                        messageTextElement.innerHTML = formatMessage(accumulatedText);
                                    }
                                } else if (data.type === 'complete') {
                                    // Actualizar mensaje final
                                    history = getChatHistory(email);
                                    if (history.length > 0 && history[history.length - 1].isStreaming) {
                                        history[history.length - 1] = {
                                            role: 'assistant',
                                            text: data.guide || accumulatedText,
                                            timestamp: data.timestamp || new Date().toISOString(),
                                            metadata: {
                                                request_id: data.request_id,
                                                processing_time_ms: data.processing_time_ms,
                                                word_count: data.word_count,
                                                model_used: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME
                                            }
                                        };
                                        saveChatHistory(email, history);
                                        renderHistory();
                                    }
                                    
                                    console.log('✅ Streaming completado');
                                    showNotification(`✅ Respuesta generada con streaming en ${data.processing_time_ms}ms`, 'success');
                                    return;
                                } else if (data.type === 'error') {
                                    throw new Error(data.error || 'Error en streaming');
                                }
                            } catch (parseError) {
                                console.warn('Error parsing streaming data:', parseError);
                            }
                        }
                    }
                }

            } catch (err) {
                console.error('❌ Error durante streaming:', err);

                // Fallback a método tradicional
                console.log('🔄 Fallback a método tradicional...');
                
                try {
                    const fallbackResponse = await retryRequest(async () => {
                        return await fetch(API_ENDPOINTS.generate, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(requestBody)
                        });
                    }, 2, 1500);

                    if (!fallbackResponse.ok) {
                        throw new Error(`Error ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
                    }

                    const data = await fallbackResponse.json();

                    history = getChatHistory(email);
                    if (history.length > 0 && history[history.length - 1].isStreaming) {
                        history[history.length - 1] = {
                            role: 'assistant',
                            text: data.guide || data.text,
                            timestamp: data.timestamp || new Date().toISOString(),
                            metadata: {
                                request_id: data.request_id,
                                processing_time_ms: data.processing_time_ms,
                                word_count: data.word_count,
                                model_used: data.model_used
                            }
                        };
                        saveChatHistory(email, history);
                        renderHistory();
                    }

                    showNotification(`✅ Respuesta generada (fallback) en ${data.processing_time_ms}ms`, 'success');

                } catch (fallbackError) {
                    console.error('❌ Error en fallback:', fallbackError);

                    history = getChatHistory(email);
                    if (history.length > 0 && history[history.length - 1].isStreaming) {
                        const errorDetails = getErrorDetails(fallbackError);
                        history[history.length - 1] = {
                            role: 'assistant',
                            text: `❌ **Error de Conexión**\n\n${errorDetails.message}\n\n💡 **Soluciones sugeridas:**\n${errorDetails.solutions.map(s => `• ${s}`).join('\n')}\n\n⚠️ **Código de error:** ${errorDetails.code}\n🕐 **Hora:** ${new Date().toLocaleString()}\n\n👨‍💻 Desarrollado por: Vicentegg4212`,
                            timestamp: new Date().toISOString(),
                            isError: true
                        };
                        saveChatHistory(email, history);
                        renderHistory();
                    }

                    showNotification(`❌ ${errorDetails.shortMessage}`, 'error');
                }
            }
        };

        if (currentImageFile) {
            console.log('📷 Procesando imagen...');
            const reader = new FileReader();
            reader.onload = (event) => {
                console.log('📷 Imagen convertida a base64');
                handleSend(event.target.result);
            };
            reader.onerror = (error) => {
                console.error('❌ Error al leer la imagen:', error);
                handleSend(null);
            };
            reader.readAsDataURL(currentImageFile);
        } else {
            handleSend(null);
        }
    };

    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-text">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #00b894, #00cec9)' :
                type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' :
                    'linear-gradient(135deg, #667eea, #764ba2)'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(10px);
            animation: slideInRight 0.3s ease;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;

        closeBtn.onclick = () => notification.remove();

        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 5000);
    };

    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🖱️ Botón de envío clickeado');
        handleSendMessage();
    });

    function resetUI(clearAll = true) {
        textInput.value = '';
        imageFile = null;
        updateSendButtonState();

        if (clearAll) {
            const email = getCurrentUser();
            if (email) {
                saveChatHistory(email, []);
                renderHistory();
                console.log('🧹 Historial limpiado');
            }
        }
    }

    window.chatDebug = {
        getCurrentUser,
        getChatHistory,
        resetUI,
        showNotification,
        apiEndpoints: API_ENDPOINTS,
        checkConnection: async () => {
            try {
                console.log('🔍 Verificando conexión con servidor Azure OpenAI...');
                const response = await fetch(API_ENDPOINTS.health);
                const data = await response.json();
                console.log('🔍 Estado de la API:', data);
                showNotification(`✅ Servidor: ${data.status} • ${data.model}`, 'success');
                return data;
            } catch (error) {
                console.error('🔍 Error de conexión:', error);
                showNotification(`❌ Error de conexión: ${error.message}`, 'error');
                return { error: error.message };
            }
        },
        testGenerate: async () => {
            try {
                const response = await fetch(API_ENDPOINTS.generate, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lastMessage: 'Test de conectividad - responde solo OK',
                        history: []
                    })
                });
                const data = await response.json();
                console.log('🤖 Test Generate:', data);
                return data;
            } catch (error) {
                console.error('🤖 Error test Generate:', error);
                return { error: error.message };
            }
        }
    };

    console.log('🎯 Verificando sesión e iniciando app...');
    checkSession();

    setTimeout(async () => {
        try {
            const response = await fetch(API_ENDPOINTS.health);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Conexión con backend Azure OpenAI establecida');
                console.log(`🤖 Modelo: ${data.model}`);
                console.log(`⚡ Tiempo de respuesta: ${data.response_time_ms}ms`);
                showNotification(`✅ Conectado • ${data.model}`, 'success');
            } else {
                console.warn('⚠️ Backend no responde correctamente');
                showNotification('⚠️ Servidor no responde correctamente', 'error');
            }
        } catch (error) {
            console.warn('⚠️ No se pudo conectar con el backend:', error.message);
            showNotification(`⚠️ Error de conexión: ${error.message}`, 'error');
        }
    }, 1000);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .message-metadata {
            font-size: 0.75rem;
            opacity: 0.7;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .message-text {
            line-height: 1.6;
        }

        .message-text h1, .message-text h2, .message-text h3 {
            margin: 16px 0 8px 0;
            color: inherit;
        }

        .message-text code {
            background: rgba(0, 0, 0, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
        }

        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .streaming-indicator {
            color: #667eea;
            font-size: 0.8rem;
            animation: pulse-text 1.5s infinite;
        }

        @keyframes pulse-text {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }

        .message.assistant .streaming-indicator {
            background: linear-gradient(90deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    `;
    document.head.appendChild(style);
});