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
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const newChatBtn = document.getElementById('newChatBtn');
    const logoutBtnSidebar = document.getElementById('logoutBtnSidebar');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    // --- LÓGICA DE SIDEBAR ---
    const toggleSidebar = () => {
        console.log('🔄 Toggling sidebar...');
        if (sidebar) {
            sidebar.classList.toggle('open');
            console.log('Sidebar classes:', sidebar.className);
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.toggle('active');
            console.log('Overlay classes:', sidebarOverlay.className);
        }
    };

    // Agregar listeners con validación
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📱 Botón sidebar clickeado');
            toggleSidebar();
        });
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📱 Botón móvil clickeado');
            toggleSidebar();
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📱 Overlay clickeado');
            toggleSidebar();
        });
    }

    newChatBtn?.addEventListener('click', () => {
        const email = getCurrentUser();
        if (email) {
            createNewConversation(email);
            renderHistory();
            renderSidebarConversations();
            if (welcomeTitle) welcomeTitle.style.display = 'block';
            console.log('🆕 Nuevo chat iniciado');
            showNotification('🆕 Nuevo chat iniciado', 'success');
        }
    });

    logoutBtnSidebar?.addEventListener('click', () => {
        showAuthView();
    });

    // --- RENDERIZAR CONVERSACIONES EN SIDEBAR ---
    const renderSidebarConversations = () => {
        const email = getCurrentUser();
        if (!email) return;

        const sidebarChats = document.getElementById('sidebarChats');
        if (!sidebarChats) return;

        const conversations = getConversations(email);
        
        sidebarChats.innerHTML = `
            <div class="sidebar-section">
                <div class="sidebar-section-title">Recientes</div>
                ${conversations.map(conv => {
                    const isActive = conv.id === currentConversationId;
                    const date = new Date(conv.timestamp);
                    const timeAgo = getTimeAgo(date);
                    
                    return `
                        <div class="chat-item ${isActive ? 'active' : ''}" data-conversation-id="${conv.id}">
                            <span class="material-symbols-outlined" style="font-size: 18px;">chat_bubble</span>
                            <div style="flex: 1; overflow: hidden;">
                                <div style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    ${conv.title}
                                </div>
                                <div style="font-size: 11px; opacity: 0.6; margin-top: 2px;">
                                    ${timeAgo}
                                </div>
                            </div>
                            <button class="delete-conversation-btn" data-conversation-id="${conv.id}" style="background:transparent;border:none;color:rgba(255,255,255,0.5);cursor:pointer;padding:4px;border-radius:4px;transition:all 0.2s;" title="Eliminar conversación">
                                <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Agregar event listeners a las conversaciones
        sidebarChats.querySelectorAll('.chat-item').forEach(item => {
            const convId = item.getAttribute('data-conversation-id');
            
            item.addEventListener('click', (e) => {
                // No hacer nada si se clickeó el botón de eliminar
                if (e.target.closest('.delete-conversation-btn')) return;
                switchConversation(convId);
            });
        });

        // Agregar event listeners a los botones de eliminar
        sidebarChats.querySelectorAll('.delete-conversation-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255, 107, 107, 0.2)';
                btn.style.color = 'rgba(255, 107, 107, 1)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'transparent';
                btn.style.color = 'rgba(255, 255, 255, 0.5)';
            });
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const convId = btn.getAttribute('data-conversation-id');
                
                // Confirmar eliminación
                if (conversations.length > 1) {
                    if (confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
                        deleteConversation(email, convId);
                        showNotification('🗑️ Conversación eliminada', 'success');
                    }
                } else {
                    showNotification('⚠️ No puedes eliminar la única conversación', 'error');
                }
            });
        });
    };

    // Función para calcular tiempo relativo
    const getTimeAgo = (date) => {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString();
    };

    // --- LÓGICA DE BÚSQUEDA EN HISTORIAL (REMOVIDA - AHORA EN SIDEBAR) ---
    let currentSearchTerm = '';

    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    };

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
        welcomeMessage.textContent = `🧠 AI Study Genius`;
        
        // Actualizar info del usuario en la sidebar
        if (userName) userName.textContent = username;
        if (userAvatar) userAvatar.textContent = username.charAt(0).toUpperCase();
        
        // Inicializar conversaciones
        const conversations = getConversations(email);
        if (!currentConversationId && conversations.length > 0) {
            currentConversationId = conversations[0].id;
        }
        
        authSection.style.display = 'none';
        appSection.style.display = 'flex';
        renderHistory();
        renderSidebarConversations();
        console.log(`✅ Usuario logueado: ${username} (Vicentegg4212 - 2025-10-02 02:47:33)`);
    };

    const showAuthView = () => {
        authSection.style.display = 'flex';
        appSection.style.display = 'none';
        clearCurrentUser();
        console.log('🔒 Mostrando vista de autenticación');
    };

    showRegister?.addEventListener('click', () => {
        console.log('🔄 Mostrando formulario de registro');
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
    });

    showLogin?.addEventListener('click', () => {
        console.log('🔄 Mostrando formulario de login');
        if (registerForm) registerForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
    });

    // --- BOTÓN DE LOGIN CON GITHUB ---
    const githubLoginBtn = document.getElementById('github-login-btn-register');
    if (githubLoginBtn) {
        console.log('✅ Botón de GitHub encontrado');
        githubLoginBtn.addEventListener('click', () => {
            console.log('🔐 Iniciando OAuth con GitHub...');
            window.location.href = `${API_BASE_URL}/auth/github`;
        });
    } else {
        console.warn('⚠️ Botón de login con GitHub no encontrado');
    }

    // --- MANEJO DE DATOS CON LOCALSTORAGE ---
    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
    const getCurrentUser = () => localStorage.getItem('currentUser');
    const setCurrentUser = (email) => localStorage.setItem('currentUser', email);
    const clearCurrentUser = () => localStorage.removeItem('currentUser');
    
    // Sistema de conversaciones múltiples
    let currentConversationId = null;
    
    const getConversations = (email) => {
        const conversations = JSON.parse(localStorage.getItem(`conversations_${email}`)) || [];
        // Si no hay conversaciones, crear una por defecto
        if (conversations.length === 0) {
            const defaultConv = {
                id: Date.now().toString(),
                title: 'Nueva conversación',
                timestamp: new Date().toISOString(),
                messages: []
            };
            conversations.push(defaultConv);
            localStorage.setItem(`conversations_${email}`, JSON.stringify(conversations));
            currentConversationId = defaultConv.id;
        }
        return conversations;
    };
    
    const saveConversations = (email, conversations) => {
        localStorage.setItem(`conversations_${email}`, JSON.stringify(conversations));
    };
    
    const getCurrentConversation = (email) => {
        const conversations = getConversations(email);
        if (!currentConversationId && conversations.length > 0) {
            currentConversationId = conversations[0].id;
        }
        return conversations.find(c => c.id === currentConversationId) || conversations[0];
    };
    
    const getChatHistory = (email, includeStreaming = false) => {
        const conversation = getCurrentConversation(email);
        if (!conversation) {
            console.log(`❌ Sin conversación actual`);
            return [];
        }
        
        console.log(`📖 getChatHistory(email, includeStreaming=${includeStreaming})`);
        console.log(`   Mensajes en conversación: ${conversation.messages.length}`);
        conversation.messages.forEach((msg, idx) => {
            console.log(`   [RAW ${idx}] role=${msg.role}, text-len=${msg.text?.length || 0}, streaming=${msg.isStreaming}`);
        });
        
        // Si includeStreaming es true, retornar sin filtrar estados temporales
        if (includeStreaming) {
            const filtered = conversation.messages.filter(msg => msg && msg.text !== undefined);
            console.log(`   Retornando ${filtered.length} mensajes (con streaming)`);
            return filtered;
        }
        
        // Limpiar mensajes de estados temporales (isLoading, isStreaming)
        const cleanMessages = conversation.messages
            .filter(msg => msg && msg.text && msg.text.trim() !== '')
            .map(msg => ({
                ...msg,
                isLoading: false,
                isStreaming: false
            }));
        
        console.log(`   Retornando ${cleanMessages.length} mensajes (limpiados)`);
        cleanMessages.forEach((msg, idx) => {
            console.log(`   [CLEAN ${idx}] role=${msg.role}, text-len=${msg.text?.length || 0}`);
        });
        
        return cleanMessages;
    };
    
    const saveChatHistory = (email, history) => {
        const conversations = getConversations(email);
        const currentConv = conversations.find(c => c.id === currentConversationId);
        
        console.log(`💾 Guardando historial para conversación: ${currentConversationId}`);
        console.log(`   Mensajes a guardar: ${history.length}`);
        
        // Logging detallado de cada mensaje a guardar
        history.forEach((msg, idx) => {
            console.log(`   [${idx}] role=${msg.role}, text-len=${msg.text?.length || 0}, streaming=${msg.isStreaming}, loading=${msg.isLoading}`);
        });
        
        if (currentConv) {
            // Filtrar mensajes vacíos PERO mantener mensajes en streaming
            const cleanHistory = history
                .filter(msg => msg && (msg.text !== undefined || msg.isStreaming || msg.isLoading))
                .map(msg => {
                    const cleaned = {
                        role: msg.role,
                        text: msg.text || '',
                        timestamp: msg.timestamp || new Date().toISOString(),
                        image: msg.image || null,
                        metadata: msg.metadata || null
                    };
                    
                    // Mantener flags de estado si existen
                    if (msg.isStreaming) cleaned.isStreaming = true;
                    if (msg.isLoading) cleaned.isLoading = true;
                    if (msg.isError) cleaned.isError = true;
                    
                    return cleaned;
                });
            
            console.log(`   Mensajes después de limpiar: ${cleanHistory.length}`);
            cleanHistory.forEach((msg, idx) => {
                console.log(`   [GUARDADO ${idx}] role=${msg.role}, text-len=${msg.text?.length || 0}, streaming=${msg.isStreaming}`);
            });
            
            currentConv.messages = cleanHistory;
            currentConv.timestamp = new Date().toISOString();
            
            // Actualizar título basado en el primer mensaje del usuario
            if (cleanHistory.length > 0 && currentConv.title === 'Nueva conversación') {
                const firstUserMsg = cleanHistory.find(m => m.role === 'user' && m.text);
                if (firstUserMsg && firstUserMsg.text) {
                    currentConv.title = firstUserMsg.text.substring(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
                }
            }
            
            saveConversations(email, conversations);
            console.log(`✅ Historial guardado en localStorage`);
            renderSidebarConversations();
        } else {
            console.error(`❌ No se encontró conversación con ID: ${currentConversationId}`);
        }
    };
    
    const createNewConversation = (email) => {
        const conversations = getConversations(email);
        const newConv = {
            id: Date.now().toString(),
            title: 'Nueva conversación',
            timestamp: new Date().toISOString(),
            messages: []
        };
        conversations.unshift(newConv); // Agregar al inicio
        saveConversations(email, conversations);
        currentConversationId = newConv.id;
        return newConv;
    };
    
    const switchConversation = (conversationId) => {
        const email = getCurrentUser();
        if (!email) return;
        
        // Limpiar conversación actual antes de cambiar
        const conversations = getConversations(email);
        const conv = conversations.find(c => c.id === conversationId);
        
        if (conv) {
            // Limpiar mensajes inválidos
            conv.messages = conv.messages.filter(msg => 
                msg && 
                msg.text && 
                msg.text.trim() !== '' &&
                !msg.isLoading &&
                !msg.isStreaming
            );
            saveConversations(email, conversations);
        }
        
        currentConversationId = conversationId;
        renderHistory();
        renderSidebarConversations();
        
        if (sidebar?.classList.contains('open')) {
            toggleSidebar();
        }
        
        console.log(`💬 Cambiado a conversación: ${conversationId}`);
    };
    
    const deleteConversation = (email, conversationId) => {
        let conversations = getConversations(email);
        conversations = conversations.filter(c => c.id !== conversationId);
        
        // Si eliminamos la conversación actual, cambiar a otra
        if (currentConversationId === conversationId) {
            if (conversations.length === 0) {
                // Crear una nueva si no hay ninguna
                const newConv = {
                    id: Date.now().toString(),
                    title: 'Nueva conversación',
                    timestamp: new Date().toISOString(),
                    messages: []
                };
                conversations.push(newConv);
                currentConversationId = newConv.id;
            } else {
                currentConversationId = conversations[0].id;
            }
        }
        
        saveConversations(email, conversations);
        renderHistory();
        renderSidebarConversations();
        console.log(`🗑️ Conversación eliminada: ${conversationId}`);
    };

    // --- LÓGICA DE LOGIN/REGISTRO/LOGOUT ---
    if (registerForm) {
        console.log('✅ Formulario de registro encontrado');
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Procesando registro...');
            const email = document.getElementById('registerEmail')?.value;
            const password = document.getElementById('registerPassword')?.value;

            if (!email || !password) {
                alert('Por favor completa todos los campos');
                return;
            }

            const users = getUsers();
            if (users.find(user => user.email === email)) {
                alert('Este email ya está registrado');
                return;
            }

            users.push({ email, password });
            saveUsers(users);
            setCurrentUser(email);
            console.log('✅ Usuario registrado exitosamente');
            showAppView(email);
        });
    } else {
        console.warn('⚠️ Formulario de registro no encontrado');
    }

    if (loginForm) {
        console.log('✅ Formulario de login encontrado');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('🔐 Procesando login...');
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;

            if (!email || !password) {
                alert('Por favor completa todos los campos');
                return;
            }

            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                setCurrentUser(email);
                console.log('✅ Login exitoso');
                showAppView(email);
            } else {
                alert('Credenciales incorrectas');
            }
        });
    } else {
        console.warn('⚠️ Formulario de login no encontrado');
    }

    logoutBtn?.addEventListener('click', () => {
        showAuthView();
    });

    const checkSession = async () => {
        // Primero verificar si hay sesión de GitHub
        try {
            const response = await fetch(`${API_BASE_URL}/api/github/me`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    console.log('✅ Usuario de GitHub autenticado:', data.user.login);
                    const githubEmail = data.user.email || `${data.user.login}@github.com`;
                    setCurrentUser(githubEmail);
                    
                    // Actualizar UI con info de GitHub
                    const displayName = data.user.name || data.user.login;
                    welcomeMessage.textContent = `🧠 AI Study Genius`;
                    if (userName) userName.textContent = displayName;
                    if (userAvatar) userAvatar.textContent = displayName.charAt(0).toUpperCase();
                    
                    // Inicializar conversaciones
                    const conversations = getConversations(githubEmail);
                    if (!currentConversationId && conversations.length > 0) {
                        currentConversationId = conversations[0].id;
                    }
                    
                    authSection.style.display = 'none';
                    appSection.style.display = 'flex';
                    renderHistory();
                    renderSidebarConversations();
                    showNotification(`✅ Sesión de GitHub activa: ${data.user.login}`, 'success');
                    return;
                }
            }
        } catch (error) {
            console.log('ℹ️ No hay sesión de GitHub activa');
        }

        // Si no hay sesión de GitHub, verificar sesión local
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

        console.log(`📊📊📊 RENDER HISTORY INICIADO`);
        console.log(`   Email: ${email}`);
        console.log(`   Conversación actual: ${currentConversationId}`);
        
        const history = getChatHistory(email);
        console.log(`📊 Renderizando ${history.length} mensajes`);
        
        history.forEach((msg, idx) => {
            console.log(`   [RENDER ${idx}] role=${msg.role}, text-preview="${msg.text?.substring(0, 50) || '(vacío)'}..."`);
        });
        
        chatHistoryContainer.innerHTML = '';

        let validMessagesCount = 0;  // Mover aquí para que esté disponible globalmente

        if (history.length === 0) {
            if (welcomeTitle) welcomeTitle.style.display = 'block';
        } else {
            if (welcomeTitle) welcomeTitle.style.display = 'none';
            
            let lastDate = null;
            
            history.forEach((message, index) => {
                // Agregar separador de fecha si cambia el día
                const messageDate = message.timestamp ? new Date(message.timestamp) : new Date();
                const dateString = messageDate.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                if (!lastDate || lastDate !== dateString) {
                    const dateSeparator = document.createElement('div');
                    dateSeparator.className = 'date-separator';
                    dateSeparator.innerHTML = `<span>${dateString}</span>`;
                    chatHistoryContainer.appendChild(dateSeparator);
                    lastDate = dateString;
                }
                
                const messageElement = createMessageElement(message, index);
                if (messageElement) {
                    chatHistoryContainer.appendChild(messageElement);
                    console.log(`✅ Mensaje ${index + 1} renderizado: ${message.role} (text-len: ${message.text?.length || 0})`);
                    validMessagesCount++;
                }
            });
            
            // Si no hay mensajes válidos, mostrar título de bienvenida
            if (validMessagesCount === 0 && welcomeTitle) {
                welcomeTitle.style.display = 'block';
            }
        }

        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
        console.log(`📝 Historial renderizado: ${history.length} mensajes (${validMessagesCount || 0} válidos)`);
    };

    const createMessageElement = (message, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        messageDiv.id = `message-${index}`;

        // Verificar que el mensaje tiene contenido válido
        if (!message) {
            console.warn('Mensaje sin contenido detectado:', message);
            return null;
        }
        
        // Si no tiene texto ni imagen pero tiene role, dejarlo pasar
        if (!message.text && !message.image) {
            console.warn('Mensaje vacío detectado:', message.role);
            // No retornar null, permitir mostrar mensajes sin contenido
        }

        // Formatear timestamp
        const timestamp = message.timestamp ? new Date(message.timestamp) : new Date();
        const timeString = timestamp.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        let messageText = '';  // Definir aquí para que esté disponible en todo el scope

        if (message.isLoading) {
            messageDiv.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-spinner"></div>
                    <div class="loading-spinner"></div>
                </div>
            `;
        } else if (message.isStreaming) {
            messageText = formatMessage(message.text || '');
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${messageText}</div>
                </div>
            `;
        } else {
            messageText = formatMessage(message.text || '');
            const roleLabel = message.role === 'user' ? 'Tú' : 'AI Assistant';

            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header-minimal">
                        <span class="message-role-label">${roleLabel}</span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    ${message.image ? `<img src="${message.image}" alt="Imagen enviada" class="message-image">` : ''}
                    ${messageText ? `<div class="message-text">${messageText}</div>` : ''}
                </div>
            `;
        }

        console.log(`📨 Elemento de mensaje creado: ${message.role} - ${messageText?.substring(0, 50) || '(vacío)'}`);
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

            let history = getChatHistory(email, true);
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
            history = getChatHistory(email, true);
            history.push(streamingMessage);
            saveChatHistory(email, history);
            renderHistory();

            const lastMessageElement = chatHistoryContainer.lastElementChild;
            const messageTextElement = lastMessageElement?.querySelector('.message-text');

            console.log('⏳ Iniciando streaming...');

            // Preparar datos para la API
            const lastMessage = text || 'Analiza esta imagen y crea una guía de estudio';

            // Obtener historial limpio para enviar a la API (sin el mensaje de streaming actual)
            const cleanHistory = getChatHistory(email, true)
                .filter(msg => !msg.isLoading && !msg.isStreaming && msg.text)
                .slice(-3);  // Solo últimos 3 mensajes = MÁS RÁPIDO
            
            const azureHistory = cleanHistory.map(msg => ({
                role: msg.role,
                content: msg.text
            }));

            // NO remover el último mensaje - Gemini necesita el historial completo
            // y el lastMessage se envía por separado

            const requestBody = {
                history: azureHistory,
                lastMessage: lastMessage,
                imageB64: imageB64
            };

            try {
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
                                    history = getChatHistory(email, true);
                                    const streamingIndex = history.findIndex(msg => msg.isStreaming);
                                    
                                    if (streamingIndex !== -1) {
                                        history[streamingIndex] = {
                                            role: 'assistant',
                                            text: data.guide || accumulatedText,
                                            timestamp: data.timestamp || new Date().toISOString(),
                                            metadata: {
                                                request_id: data.request_id,
                                                processing_time_ms: data.processing_time_ms,
                                                word_count: data.word_count,
                                                model_used: data.model_used || 'gpt-4o'
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

                    history = getChatHistory(email, true);
                    const streamingIndex = history.findIndex(msg => msg.isStreaming);
                    
                    if (streamingIndex !== -1) {
                        history[streamingIndex] = {
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
                    const errorDetails = getErrorDetails(fallbackError);

                    history = getChatHistory(email, true);
                    const streamingIndex = history.findIndex(msg => msg.isStreaming);
                    
                    if (streamingIndex !== -1) {
                        history[streamingIndex] = {
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

    // ==========================================
    // 🔧 VALIDACIÓN Y FIX PARA BOTONES
    // ==========================================
    
    // Verificar que el botón de menú existe y funciona
    setTimeout(() => {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const sb = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        console.log('🔍 Verificación de botones:');
        console.log(`   📱 Botón menú: ${menuBtn ? '✅ Encontrado' : '❌ NO ENCONTRADO'}`);
        console.log(`   📂 Sidebar: ${sb ? '✅ Encontrado' : '❌ NO ENCONTRADO'}`);
        console.log(`   🎭 Overlay: ${overlay ? '✅ Encontrado' : '❌ NO ENCONTRADO'}`);
        
        // Asegurar que el botón está clickeable
        if (menuBtn && !menuBtn.onclick && !menuBtn.listeners) {
            console.log('🔧 Agregando listener al botón menú...');
            menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ Botón menú clickeado!');
                
                if (sb) {
                    sb.classList.toggle('open');
                    console.log('📂 Sidebar toggled:', sb.classList.contains('open'));
                }
                
                if (overlay) {
                    overlay.classList.toggle('active');
                    console.log('🎭 Overlay toggled:', overlay.classList.contains('active'));
                }
            });
        }
    }, 500);
});