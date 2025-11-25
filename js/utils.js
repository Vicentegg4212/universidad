/**
 * 🛠️ UTILIDADES FRONTEND - AI STUDY GENIUS
 * Funciones auxiliares para gestionar la aplicación
 */

import { API_CONFIG } from './config.js';

/**
 * 💾 Gestión de LocalStorage
 */
export const StorageManager = {
    getUsers: () => JSON.parse(localStorage.getItem(API_CONFIG.STORAGE_KEYS.users)) || [],
    saveUsers: (users) => localStorage.setItem(API_CONFIG.STORAGE_KEYS.users, JSON.stringify(users)),
    
    getCurrentUser: () => localStorage.getItem(API_CONFIG.STORAGE_KEYS.currentUser),
    setCurrentUser: (email) => localStorage.setItem(API_CONFIG.STORAGE_KEYS.currentUser, email),
    clearCurrentUser: () => localStorage.removeItem(API_CONFIG.STORAGE_KEYS.currentUser),
    
    getConversations: (email) => {
        const conversations = JSON.parse(localStorage.getItem(API_CONFIG.STORAGE_KEYS.conversations(email))) || [];
        
        // Crear conversación por defecto si no hay ninguna
        if (conversations.length === 0) {
            const defaultConv = {
                id: Date.now().toString(),
                title: 'Nueva conversación',
                timestamp: new Date().toISOString(),
                messages: []
            };
            conversations.push(defaultConv);
            localStorage.setItem(API_CONFIG.STORAGE_KEYS.conversations(email), JSON.stringify(conversations));
        }
        
        return conversations;
    },
    saveConversations: (email, conversations) => {
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.conversations(email), JSON.stringify(conversations));
    }
};

/**
 * 🕐 Utilidades de fecha y tiempo
 */
export const TimeUtils = {
    getTimeAgo: (date) => {
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
    },

    formatTime: (date) => {
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    formatDate: (date) => {
        return date.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
};

/**
 * 📝 Utilidades de formato de texto
 */
export const TextUtils = {
    formatMessage: (text) => {
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/### (.*?)(\n|<br>)/g, '<h3>$1</h3>')
            .replace(/## (.*?)(\n|<br>)/g, '<h2>$1</h2>')
            .replace(/# (.*?)(\n|<br>)/g, '<h1>$1</h1>');
    },

    highlightText: (text, searchTerm) => {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
};

/**
 * 🔍 Gestión de errores
 */
export const ErrorHandler = {
    getErrorDetails: (error) => {
        const errorMessage = error.message.toLowerCase();
        
        const errorMap = {
            'network|fetch': {
                code: 'NETWORK_ERROR',
                message: 'Error de conectividad de red',
                shortMessage: 'Sin conexión al servidor',
                solutions: [
                    'Verifica tu conexión a internet',
                    'Asegúrate que el servidor esté ejecutándose en localhost:3000',
                    'Revisa el firewall o proxy',
                    'Intenta recargar la página'
                ]
            },
            '401|unauthorized': {
                code: 'AUTH_ERROR',
                message: 'Error de autenticación con Azure OpenAI',
                shortMessage: 'Error de autenticación',
                solutions: [
                    'Verifica la API key de Azure OpenAI en el servidor',
                    'Comprueba que la clave no haya expirado',
                    'Revisa la configuración del endpoint',
                    'Contacta al administrador del sistema'
                ]
            },
            '429|rate limit|quota': {
                code: 'RATE_LIMIT',
                message: 'Límite de uso de API excedido',
                shortMessage: 'Límite de uso excedido',
                solutions: [
                    'Espera unos minutos antes de volver a intentar',
                    'El límite se restablece automáticamente',
                    'Considera upgrading el plan de Azure OpenAI',
                    'Intenta con mensajes más cortos'
                ]
            },
            '500|internal server': {
                code: 'SERVER_ERROR',
                message: 'Error interno del servidor',
                shortMessage: 'Error del servidor',
                solutions: [
                    'El problema es temporal, intenta de nuevo',
                    'Verifica los logs del servidor',
                    'Reinicia el servidor si es posible',
                    'Reporta el error si persiste'
                ]
            },
            'timeout': {
                code: 'TIMEOUT_ERROR',
                message: 'Tiempo de espera agotado',
                shortMessage: 'Tiempo de espera agotado',
                solutions: [
                    'La respuesta está tomando demasiado tiempo',
                    'Intenta con un mensaje más corto',
                    'Verifica la estabilidad de la conexión',
                    'Espera un momento y vuelve a intentar'
                ]
            },
            'json|parse': {
                code: 'PARSE_ERROR',
                message: 'Error al procesar la respuesta del servidor',
                shortMessage: 'Error de formato de respuesta',
                solutions: [
                    'La respuesta del servidor está malformada',
                    'Verifica la configuración del servidor',
                    'Intenta recargar la página',
                    'Reporta este error técnico'
                ]
            }
        };

        // Buscar el tipo de error
        for (const [pattern, details] of Object.entries(errorMap)) {
            const patterns = pattern.split('|');
            if (patterns.some(p => errorMessage.includes(p))) {
                return details;
            }
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
    }
};

/**
 * 🔄 Gestión de reintentos
 */
export const RetryManager = {
    retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
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
            }
        }
    }
};

/**
 * 📬 Notificaciones
 */
export const NotificationManager = {
    show: (message, type = 'info') => {
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
        }, API_CONFIG.NOTIFICATIONS.DURATION);
    }
};

export default {
    StorageManager,
    TimeUtils,
    TextUtils,
    ErrorHandler,
    RetryManager,
    NotificationManager
};
