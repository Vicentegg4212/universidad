document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando AI Study Genius - Vicentegg4212...');
    console.log(`📅 Fecha actual: 2025-10-02 02:47:33 UTC`);

    // Configuración de URLs del backend
    // Detectar automáticamente el entorno
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_BASE_URL = isLocalhost ? 'http://localhost:3000' : window.location.origin;
    
    const API_ENDPOINTS = {
        health: `${API_BASE_URL}/api/health`,
        generate: `${API_BASE_URL}/api/generate`
    };

    console.log(`🔗 API configurada en: ${API_BASE_URL}`);

    // Mostrar info del modelo actual del backend (solo si está en localhost)
    if (isLocalhost) {
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
            .catch(err => console.log('ℹ️ Servidor backend no disponible (modo local)'));
    } else {
        console.log('🌐 Ejecutándose en host externo - Modo demo sin servidor backend');
    }

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
    const imageInput = document.getElementById('imageInput');
    const chatHistoryContainer = document.getElementById('chatHistory');
    const welcomeTitle = document.getElementById('welcomeTitle');
    let imageFile = null;

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

        if (history.length === 0) {
            if (welcomeTitle) welcomeTitle.style.display = 'block';
        } else {
            if (welcomeTitle) welcomeTitle.style.display = 'none';
            history.forEach((message, index) => {
                const messageElement = createMessageElement(message, index);
                chatHistoryContainer.appendChild(messageElement);
            });
        }

        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
        console.log(`📝 Historial renderizado: ${history.length} mensajes`);
    };

    const createMessageElement = (message, index) => {
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
        } else {
            const timestamp = new Date().toLocaleTimeString();
            const roleLabel = message.role === 'user' ? '👤 Tú' : '🧠 AI Study Assistant';

            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="role">${roleLabel}</span>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    ${message.image ? `<img src="${message.image}" alt="Imagen enviada" class="message-image">` : ''}
                    <div class="message-text">${formatMessage(message.text || 'Sin contenido')}</div>
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

    // --- FUNCIÓN DE PROCESAMIENTO DE MENSAJE ACTUALIZADA ---
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

            // Agregar indicador de carga
            const loadingMessage = {
                role: 'assistant',
                isLoading: true,
                timestamp: new Date().toISOString()
            };
            history.push(loadingMessage);
            saveChatHistory(email, history);
            renderHistory();

            console.log('⏳ Indicador de carga mostrado');

            // Preparar datos para la API de Azure OpenAI
            const lastMessage = text || 'Analiza esta imagen y crea una guía de estudio';

            // Transformar historial al formato compatible con Azure OpenAI (solo role y content)
            const azureHistory = history
                .filter(msg => !msg.isLoading && msg.text)
                .slice(-10)
                .map(msg => ({
                    role: msg.role,
                    content: msg.text
                }));

            // Quitar el último mensaje del usuario del historial (se envía por separado)
            if (azureHistory.length > 0 && azureHistory[azureHistory.length - 1].role === 'user') {
                azureHistory.pop();
            }

            console.log(`🤖 Enviando a Azure OpenAI - Historial: ${azureHistory.length} mensajes`);
            console.log(`📝 Último mensaje: "${lastMessage}"`);
            console.log(`🔗 Endpoint: ${API_ENDPOINTS.generate}`);

            try {
                // Verificar si estamos en localhost (desarrollo)
                if (!isLocalhost) {
                    throw new Error('🌐 Esta funcionalidad requiere un servidor backend. Por favor, ejecuta la aplicación localmente con tu servidor Node.js para usar la IA.');
                }

                const requestBody = {
                    history: azureHistory,
                    lastMessage: lastMessage,
                    imageB64: imageB64
                };

                console.log('📦 Enviando petición a backend...');
                
                const response = await fetch(API_ENDPOINTS.generate, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log(`🌐 Respuesta del servidor: ${response.status} ${response.statusText}`);

                if (!response.ok) {
                    let errorMessage = `Error ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorData.details || errorMessage;
                        console.log('📦 Error detallado:', errorData);
                    } catch (e) {
                        errorMessage = `Error de red: ${response.statusText}`;
                        console.error('❌ Error parseando respuesta de error:', e);
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                console.log('📦 Datos recibidos del servidor:', data);

                if (!data.guide && !data.text) {
                    throw new Error('Respuesta inválida del servidor: no hay contenido');
                }

                const assistantMessage = {
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

                history = getChatHistory(email);
                if (history.length > 0 && history[history.length - 1].isLoading) {
                    history.pop();
                }
                history.push(assistantMessage);
                saveChatHistory(email, history);
                renderHistory();

                console.log('✅ Respuesta de la IA agregada al historial');
                console.log(`📊 Estadísticas: ${data.processing_time_ms}ms, ${data.word_count} palabras`);

                showNotification(`✅ Respuesta generada en ${data.processing_time_ms}ms`, 'success');

            } catch (err) {
                console.error('❌ Error al contactar el backend:', err);
                console.error('❌ Error stack:', err.stack);

                history = getChatHistory(email);
                if (history.length > 0 && history[history.length - 1].isLoading) {
                    history.pop();
                }

                const errorMessage = {
                    role: 'assistant',
                    text: `❌ **Error de Conexión**\n\n${err.message}\n\n💡 **Posibles soluciones:**\n- Verifica que el servidor esté ejecutándose en ${API_BASE_URL}\n- Comprueba tu conexión a internet\n- Revisa la consola del navegador para más detalles\n- Intenta recargar la página\n\n👨‍💻 Desarrollado por: Vicentegg4212\n📅 Fecha: 2025-10-02 02:47:33`,
                    timestamp: new Date().toISOString(),
                    isError: true
                };

                history.push(errorMessage);
                saveChatHistory(email, history);
                renderHistory();

                console.log('💥 Mensaje de error agregado al historial');
                showNotification(`❌ Error: ${err.message}`, 'error');
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
                // Verificar si estamos en localhost
                if (!isLocalhost) {
                    throw new Error('Funcionalidad no disponible en host externo');
                }

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
                // Verificar si estamos en localhost
                if (!isLocalhost) {
                    throw new Error('Funcionalidad no disponible en host externo');
                }

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
    `;
    document.head.appendChild(style);
});