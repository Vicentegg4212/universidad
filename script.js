// Clase para manejar la API de Azure OpenAI
class AIStudyAPI {
    constructor() {
        this.isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.baseURL = this.isLocal ? 'http://localhost:3000' : window.location.origin;
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            const data = await response.json();
            return {
                status: 'online',
                model: data.azure_openai?.deployment || 'gpt-4o',
                ...data
            };
        } catch (error) {
            throw new Error(`Error de conexión: ${error.message}`);
        }
    }

    async generateStudyGuide(history, imageB64 = null) {
        try {
            const response = await fetch(`${this.baseURL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    history: history,
                    lastMessage: history[history.length - 1]?.content || '',
                    imageB64: imageB64
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error al generar respuesta: ${error.message}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando AI Study Genius - Vicentegg4212...');
    console.log(`📅 Fecha actual: ${new Date().toISOString()}`);

    // Inicializar API
    const api = new AIStudyAPI();
    
    console.log(`🔗 API configurada para: ${api.isLocal ? 'Desarrollo Local' : 'GitHub Pages'}`);

    // Probar conexión inicial
    api.testConnection()
        .then(data => {
            console.log(`🤖 Modelo conectado: ${data.model}`);
            showModelInfo(data);
            showNotification(`✅ Conectado • ${data.model}`, 'success');
        })
        .catch(err => {
            console.log('ℹ️ Conexión inicial falló, reintentando...', err.message);
            showNotification('⚠️ Conectando con Azure OpenAI...', 'info');
        });

    const showModelInfo = (data) => {
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
        info.textContent = `🤖 ${data.model} • Vicentegg4212`;
    };

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
        console.log('📷 Abriendo cámara para tomar foto...');
        imageInput.setAttribute('capture', 'environment'); // Cámara trasera preferida
        imageInput.setAttribute('accept', 'image/*');
        imageInput.value = '';
        imageInput.click();
        
        // Feedback visual
        takePhotoBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            takePhotoBtn.style.transform = 'scale(1)';
        }, 150);
    });

    selectPhotoBtn?.addEventListener('click', () => {
        console.log('🖼️ Abriendo galería para seleccionar imagen...');
        imageInput.removeAttribute('capture');
        imageInput.setAttribute('accept', 'image/*');
        imageInput.value = '';
        imageInput.click();
        
        // Feedback visual
        selectPhotoBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            selectPhotoBtn.style.transform = 'scale(1)';
        }, 150);
    });

    imageInput?.addEventListener('change', (e) => {
        imageFile = e.target.files[0];
        updateSendButtonState();
        if (imageFile) {
            console.log(`📷 Imagen seleccionada: ${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)}MB)`);
            
            // Mostrar preview de la imagen
            const reader = new FileReader();
            reader.onload = (event) => {
                showImagePreview(event.target.result, imageFile.name);
            };
            reader.readAsDataURL(imageFile);
            
            // Auto-rellenar texto si está vacío
            if (!textInput.value.trim()) {
                textInput.value = "Analiza esta imagen y créame una guía de estudio detallada sobre el contenido que ves";
                updateSendButtonState();
            }
        } else {
            hideImagePreview();
        }
    });

    // Función para mostrar preview de imagen
    const showImagePreview = (imageSrc, fileName) => {
        // Remover preview anterior si existe
        hideImagePreview();
        
        const preview = document.createElement('div');
        preview.id = 'imagePreview';
        preview.innerHTML = `
            <div style="
                position: fixed;
                bottom: 120px;
                right: 20px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                max-width: 300px;
                z-index: 1000;
                border: 1px solid rgba(255, 255, 255, 0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 0.85rem; font-weight: 600; color: #667eea;">📷 Imagen seleccionada</span>
                    <button onclick="hideImagePreview()" style="
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                        color: #999;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">&times;</button>
                </div>
                <img src="${imageSrc}" style="
                    width: 100%;
                    max-height: 150px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 8px;
                " alt="Preview">
                <div style="font-size: 0.75rem; color: #666; text-align: center;">${fileName}</div>
            </div>
        `;
        document.body.appendChild(preview);
    };

    // Función para ocultar preview de imagen
    window.hideImagePreview = () => {
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.remove();
        }
        // También limpiar la referencia del archivo
        imageFile = null;
        updateSendButtonState();
        console.log('📷 Preview de imagen removido');
    };

    // --- RECONOCIMIENTO DE VOZ MEJORADO ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isRecording = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        micBtn?.addEventListener('click', () => {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        });

        const startRecording = () => {
            console.log('🎤 Iniciando reconocimiento de voz...');
            isRecording = true;
            micBtn.classList.add('recording');
            micBtn.innerHTML = '<span class="material-symbols-outlined">mic_off</span>';
            
            // Feedback visual de grabación
            micBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
            micBtn.style.animation = 'pulse 1.5s infinite';
            
            showNotification('🎤 Escuchando... Haz clic en el micrófono para parar', 'info');
            
            try {
                recognition.start();
            } catch (error) {
                console.error('❌ Error al iniciar reconocimiento:', error);
                stopRecording();
                showNotification('❌ Error al acceder al micrófono', 'error');
            }
        };

        const stopRecording = () => {
            console.log('🎤 Deteniendo reconocimiento de voz...');
            isRecording = false;
            micBtn.classList.remove('recording');
            micBtn.innerHTML = '<span class="material-symbols-outlined">mic</span>';
            
            // Restaurar estilo original
            micBtn.style.background = 'linear-gradient(135deg, #fa709a, #fee140)';
            micBtn.style.animation = '';
            
            if (recognition) {
                recognition.stop();
            }
            
            showNotification('🎤 Grabación detenida', 'success');
        };

        recognition.addEventListener('result', (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                textInput.value = finalTranscript;
                updateSendButtonState();
                console.log(`🎤 Texto final reconocido: ${finalTranscript}`);
                stopRecording();
            } else if (interimTranscript) {
                // Mostrar texto temporal mientras se graba
                textInput.placeholder = `Reconociendo: "${interimTranscript}"...`;
            }
        });

        recognition.addEventListener('error', (event) => {
            console.error('❌ Error en reconocimiento de voz:', event.error);
            stopRecording();
            
            let errorMessage = 'Error en el reconocimiento de voz';
            switch (event.error) {
                case 'not-allowed':
                    errorMessage = 'Permisos de micrófono denegados. Permite el acceso al micrófono.';
                    break;
                case 'no-speech':
                    errorMessage = 'No se detectó habla. Intenta hablar más claro.';
                    break;
                case 'network':
                    errorMessage = 'Error de conexión. Verifica tu internet.';
                    break;
                case 'audio-capture':
                    errorMessage = 'No se pudo capturar audio. Verifica tu micrófono.';
                    break;
            }
            
            showNotification(`❌ ${errorMessage}`, 'error');
        });

        recognition.addEventListener('end', () => {
            if (isRecording) {
                console.log('🎤 Reconocimiento terminado inesperadamente, reiniciando...');
                try {
                    recognition.start();
                } catch (error) {
                    console.error('❌ Error al reiniciar reconocimiento:', error);
                    stopRecording();
                }
            }
        });

        // Restaurar placeholder cuando se detenga la grabación
        recognition.addEventListener('end', () => {
            textInput.placeholder = '💭 Escribe tu pregunta o sube una imagen para crear guías de estudio...';
        });

    } else {
        if (micBtn) {
            micBtn.style.display = 'none';
            console.log('❌ Reconocimiento de voz no disponible en este navegador');
        }
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

            // Preparar mensaje para Azure OpenAI
            const lastMessage = text || 'Analiza esta imagen y crea una guía de estudio';

            // Transformar historial al formato compatible con Azure OpenAI
            const azureHistory = history
                .filter(msg => !msg.isLoading && msg.text)
                .slice(-10) // Últimos 10 mensajes para no exceder límites
                .map(msg => ({
                    role: msg.role,
                    content: msg.text
                }));

            // Quitar el último mensaje del usuario del historial (se envía por separado)
            if (azureHistory.length > 0 && azureHistory[azureHistory.length - 1].role === 'user') {
                azureHistory.pop();
            }

            // Agregar el mensaje actual
            azureHistory.push({
                role: 'user',
                content: lastMessage
            });

            console.log(`🤖 Enviando a Azure OpenAI - Historial: ${azureHistory.length} mensajes`);
            console.log(`📝 Último mensaje: "${lastMessage}"`);

            try {
                console.log('📦 Enviando petición a Azure OpenAI...');
                
                const response = await api.generateStudyGuide(azureHistory, imageB64);

                console.log('📦 Datos recibidos de Azure OpenAI:', response);

                if (!response.guide && !response.text) {
                    throw new Error('Respuesta inválida de Azure OpenAI: no hay contenido');
                }

                const assistantMessage = {
                    role: 'assistant',
                    text: response.guide || response.text,
                    timestamp: response.timestamp || new Date().toISOString(),
                    metadata: {
                        processing_time_ms: response.processing_time_ms,
                        word_count: response.word_count,
                        model_used: response.model_used
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
                console.log(`📊 Estadísticas: ${response.processing_time_ms}ms, ${response.word_count} palabras`);

                showNotification(`✅ Respuesta generada en ${response.processing_time_ms}ms`, 'success');

            } catch (err) {
                console.error('❌ Error al contactar Azure OpenAI:', err);

                history = getChatHistory(email);
                if (history.length > 0 && history[history.length - 1].isLoading) {
                    history.pop();
                }

                let errorMessage = '';
                let solutions = '';

                // Detectar tipo de error específico
                if (err.statusCode === 401) {
                    errorMessage = '🔑 **Error de autenticación**\n\nProblema con las credenciales de Azure OpenAI.';
                    solutions = '💡 **Soluciones:**\n- Verifica la configuración de la API key\n- Comprueba que el endpoint sea correcto\n- Contacta al administrador del sistema';
                } else if (err.statusCode === 429) {
                    errorMessage = '⏱️ **Límite de uso excedido**\n\nSe ha alcanzado el límite de peticiones.';
                    solutions = '💡 **Soluciones:**\n- Espera unos minutos antes de intentar de nuevo\n- El límite se restablece automáticamente\n- Intenta con mensajes más cortos';
                } else if (err.statusCode === 503 || err.statusCode === 504) {
                    errorMessage = '🌐 **Error de conexión**\n\nNo se puede conectar con Azure OpenAI.';
                    solutions = '💡 **Soluciones:**\n- Verifica tu conexión a internet\n- Azure OpenAI podría estar temporalmente no disponible\n- Intenta recargar la página\n- Si persiste, intenta más tarde';
                } else {
                    errorMessage = `❌ **Error inesperado**\n\n${err.message}`;
                    solutions = '💡 **Soluciones:**\n- Verifica tu conexión a internet\n- Intenta recargar la página\n- Si el problema persiste, contacta soporte';
                }

                const fullErrorMessage = {
                    role: 'assistant',
                    text: `${errorMessage}\n\n${solutions}\n\n👨‍💻 Desarrollado por: Vicentegg4212\n📅 ${new Date().toLocaleDateString()}`,
                    timestamp: new Date().toISOString(),
                    isError: true
                };

                history.push(fullErrorMessage);
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
        checkConnection: async () => {
            try {
                console.log('🔍 Verificando conexión con Azure OpenAI...');
                const result = await api.testConnection();
                console.log('🔍 Estado de la API:', result);
                showNotification(`✅ Azure OpenAI: ${result.status} • ${result.model}`, 'success');
                return result;
            } catch (error) {
                console.error('🔍 Error de conexión:', error);
                showNotification(`❌ Error de conexión: ${error.message}`, 'error');
                return { error: error.message };
            }
        },
        testGenerate: async () => {
            try {
                const result = await api.generateStudyGuide([
                    { role: 'user', content: 'Test de conectividad - responde solo OK' }
                ]);
                console.log('🤖 Test Generate:', result);
                return result;
            } catch (error) {
                console.error('🤖 Error test Generate:', error);
                return { error: error.message };
            }
        }
    };

    console.log('🎯 Verificando sesión e iniciando app...');
    checkSession();

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