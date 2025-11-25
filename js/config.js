/**
 * ⚙️ CONFIGURACIÓN FRONTEND - AI STUDY GENIUS
 * Gestiona la configuración del cliente
 */

// Detectar si estamos en desarrollo o producción
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isDevelopment 
    ? 'http://localhost:3000'
    : 'https://universidad-iwir.onrender.com'; // Backend en Render

export const API_CONFIG = {
    // URLs base
    API_BASE_URL: API_BASE_URL,
    
    // Endpoints
    API_ENDPOINTS: {
        health: `${API_BASE_URL}/api/health`,
        generate: `${API_BASE_URL}/api/generate`,
        generateStream: `${API_BASE_URL}/api/generate-stream`,
        githubMe: `${API_BASE_URL}/api/github/me`,
        authGithub: `${API_BASE_URL}/auth/github`,
        authLogout: `${API_BASE_URL}/auth/logout`
    },

    // Configuración de plantillas
    TEMPLATES: {
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
    },

    // Configuración de notificaciones
    NOTIFICATIONS: {
        DURATION: 5000,
        POSITIONS: {
            TOP_RIGHT: 'top-right',
            TOP_LEFT: 'top-left',
            BOTTOM_RIGHT: 'bottom-right',
            BOTTOM_LEFT: 'bottom-left'
        }
    },

    // Información del desarrollador
    DEVELOPER: "Vicentegg4212",
    VERSION: "2.0.0",
    
    // Configuración de almacenamiento local
    STORAGE_KEYS: {
        currentUser: 'currentUser',
        theme: 'theme',
        conversations: (email) => `conversations_${email}`,
        users: 'users'
    }
};

export default API_CONFIG;
