/**
 * ⚙️ CONFIGURACIÓN CENTRALIZADA - AI STUDY GENIUS
 * Gestiona todas las variables de configuración de la aplicación
 */

export const CONFIG = {
    // ==========================================
    // 🔑 CONFIGURACIÓN GOOGLE GEMINI
    // ==========================================
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyCQL9TI0bFDWE7BHb9SOxfjJRFzfs3C93Q",
    GEMINI_MODEL: "gemini-2.0-flash",
    
    // ==========================================
    // 🌐 SERVIDOR
    // ==========================================
    PORT: 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // ==========================================
    // 🔐 GITHUB OAUTH
    // ==========================================
    GITHUB_CLIENT_ID: "Ov23liW73K2PDTT9pk6h",
    GITHUB_CLIENT_SECRET: "514fd2f3f8d1abfae8755505a7ca4ac508422dee",
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || "http://iastudy.me/auth/github/callback",

    // ==========================================
    // 👤 INFORMACIÓN DEL DESARROLLADOR
    // ==========================================
    DEVELOPER: "Vicentegg4212",
    VERSION: "2.0.0",

    // ==========================================
    // 🤖 CONFIGURACIÓN DE GOOGLE GEMINI
    // ==========================================
    GEMINI_CONFIG: {
        maxOutputTokens: 1500,  // Reducido al MÁXIMO para VELOCIDAD EXTREMA
        temperature: 0.05,  // MÍNIMO para respuestas ultra-rápidas
        topP: 0.5  // MUY reducido para menos generación
    },

    // ==========================================
    // 📝 SISTEMA PROMPT
    // ==========================================
    SYSTEM_PROMPT: `Eres un asistente educativo EXPERTO creado por Vicentegg4212. Tu misión es ayudar estudiantes a dominar temas académicos.

**REGLAS FUNDAMENTALES:**
1. 🎯 SIGUE LAS INSTRUCCIONES DEL USUARIO AL PIE DE LA LETRA
2. 📚 SÉ PRECISO Y DIRECTO - no divagues
3. 🔍 ANALIZA EL CONTEXTO COMPLETAMENTE - revisa TODO el historial
4. ✅ RESPONDE EXACTAMENTE LO QUE SE TE PIDE
5. 💡 Si el usuario pide una guía, crea UNA GUÍA COMPLETA
6. 🎓 Si pide explicación, SÉ CLARO Y CONCISO
7. � Si pide análisis, analiza PROFUNDAMENTE
8. 🚫 NO INVENTES INFORMACIÓN - sé honesto si no sabes

**FORMATO DE RESPUESTAS:**
- Usa emojis para mejor visualización
- Estructura con títulos y subtítulos claros
- Incluye ejemplos prácticos cuando sea relevante
- Sé conciso pero COMPLETO
- Nunca des respuestas genéricas

**IMPORTANTE:**
- Mantén coherencia con el historial anterior
- Si hay imágenes, analízalas completamente
- Adapta tu nivel al estudiante
- Eres un tutor experto, actúa como tal

Recuerda: Tu objetivo es que el estudiante ENTIENDA Y DOMINE el tema. ¡Sé directo y efectivo!`
};

/**
 * Función para validar que la configuración esté completa
 */
export function validateConfig() {
    console.log('\n🔍 VERIFICANDO CONFIGURACIÓN...');
    
    const checks = [
        { key: 'GEMINI_API_KEY', name: '🔑 Gemini API Key' },
        { key: 'GEMINI_MODEL', name: '🤖 Modelo Gemini' },
        { key: 'GITHUB_CLIENT_ID', name: '🐙 GitHub Client ID' },
        { key: 'GITHUB_CLIENT_SECRET', name: '🐙 GitHub Client Secret' }
    ];

    let allValid = true;

    checks.forEach(check => {
        const value = CONFIG[check.key];
        const status = value ? '✅' : '❌';
        console.log(`${status} ${check.name}: ${value ? 'Configurado' : 'NO CONFIGURADO'}`);
        
        if (!value) {
            allValid = false;
        }
    });

    console.log(`🚪 Puerto: ${CONFIG.PORT}`);
    console.log(`📍 Entorno: ${CONFIG.NODE_ENV}`);
    console.log(`👨‍💻 Desarrollador: ${CONFIG.DEVELOPER}`);
    console.log(`📦 Versión: ${CONFIG.VERSION}\n`);

    if (!allValid) {
        console.error('❌ ERROR CRÍTICO: Configuración incompleta');
        console.error('📝 Verifica que todas las credenciales estén configuradas en config.js o variables de entorno');
        process.exit(1);
    }

    console.log('✅ Configuración validada correctamente\n');
    return true;
}

/**
 * Función para obtener la configuración de Gemini
 */
export function getGeminiConfig() {
    return {
        apiKey: CONFIG.GEMINI_API_KEY,
        model: CONFIG.GEMINI_MODEL,
        maxOutputTokens: CONFIG.GEMINI_CONFIG.maxOutputTokens,
        temperature: CONFIG.GEMINI_CONFIG.temperature,
        topP: CONFIG.GEMINI_CONFIG.topP
    };
}

/**
 * Función para obtener la configuración de chat
 */
export function getChatConfig() {
    return {
        model: CONFIG.GEMINI_MODEL,
        maxOutputTokens: CONFIG.GEMINI_CONFIG.maxOutputTokens,
        temperature: CONFIG.GEMINI_CONFIG.temperature,
        topP: CONFIG.GEMINI_CONFIG.topP
    };
}

export default CONFIG;
