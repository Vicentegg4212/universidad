
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import { CONFIG, validateConfig, getChatConfig } from './config.js';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==========================================
// ⚙️ VALIDAR CONFIGURACIÓN
// ==========================================

validateConfig();

// ==========================================
// 🤖 INICIALIZAR CLIENTE GOOGLE GEMINI
// ==========================================

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: CONFIG.GEMINI_MODEL });

console.log('✅ Cliente Google Gemini inicializado correctamente\n');

// ==========================================
// 🛠️ FUNCIONES AUXILIARES
// ==========================================

/**
 * Valida y limpia el historial de chat para Gemini
 * Gemini requiere que: user, model, user, model...
 * Esta función es AGRESIVA para evitar confusiones
 */
function validateAndCleanHistory(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return [];
    }

    const cleaned = [];
    let lastRole = null;
    let lastText = null;

    for (const msg of history) {
        if (!msg || typeof msg !== 'object') continue;
        
        const text = (msg.content || msg.text || '').trim();
        if (!text || text.length < 2) continue;  // Ignorar textos muy cortos

        const role = (msg.role === 'user' || msg.role === 'user') ? 'user' : 'model';
        
        // Si es el mismo rol dos veces seguidas, SALTAR
        if (role === lastRole) {
            console.warn(`⚠️ Saltando duplicado: rol "${role}" repetido`);
            continue;
        }

        // Si es el mismo texto exacto (sin importar rol), también saltar
        if (text === lastText) {
            console.warn(`⚠️ Saltando mensaje idéntico`);
            continue;
        }

        cleaned.push({
            role,
            parts: [{ text }]
        });
        
        lastRole = role;
        lastText = text;
    }

    // Asegurar que empieza con 'user'
    while (cleaned.length > 0 && cleaned[0].role !== 'user') {
        console.warn('⚠️ Removiendo inicio no-usuario');
        cleaned.shift();
    }

    // Asegurar alternancia correcta
    for (let i = 1; i < cleaned.length; i++) {
        if (cleaned[i].role === cleaned[i - 1].role) {
            console.warn(`⚠️ Removiendo duplicado en posición ${i}`);
            cleaned.splice(i, 1);
            i--;
        }
    }

    console.log(`📊 Historial: ${history.length} → ${cleaned.length} válidos`);
    return cleaned;
}

// ==========================================
// 🌐 CONFIGURAR EXPRESS
// ==========================================

app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ==========================================
// 🚫 IGNORAR RUTAS DE CHROME/NAVEGADOR
// ==========================================

app.use((req, res, next) => {
    // Ignorar rutas que no necesitan logging
    if (req.path.startsWith('/.well-known/') || req.path.includes('devtools')) {
        return res.status(404).end();
    }
    next();
});

// ==========================================
// 🛡️ ENDPOINTS DE AUTENTICACIÓN GITHUB
// ==========================================

// 1. Redirige al usuario a GitHub para login
app.get('/auth/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CONFIG.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(CONFIG.GITHUB_CALLBACK_URL)}&scope=read:user user:email`;
    res.redirect(githubAuthUrl);
});

// 2. Callback de GitHub (donde regresa el usuario)
app.get('/auth/github/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        console.error('No code provided in GitHub callback');
        return res.redirect('/index.html?error=NoCode');
    }
    try {
        // Intercambia el code por un access_token
        const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: CONFIG.GITHUB_CLIENT_ID,
            client_secret: CONFIG.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: CONFIG.GITHUB_CALLBACK_URL
        }, {
            headers: { Accept: 'application/json' }
        });
        const accessToken = tokenRes.data.access_token;
        if (!accessToken) {
            console.error('No access token received from GitHub');
            return res.redirect('/index.html?error=NoAccessToken');
        }
        // Obtiene datos del usuario
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const user = userRes.data;
        // Guarda sesión en cookie (simple, no seguro para producción)
        res.cookie('github_user', JSON.stringify({
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
            name: user.name,
            access_token: accessToken
        }), { httpOnly: false });
        // Redirige explícitamente a index.html para evitar error de ruta no encontrada
        res.redirect('/index.html');
    } catch (err) {
        console.error('GitHub OAuth error:', err);
        let errorMsg = 'Error autenticando con GitHub';
        if (err.response && err.response.data) {
            errorMsg += ': ' + JSON.stringify(err.response.data);
        } else if (err.message) {
            errorMsg += ': ' + err.message;
        }
        return res.redirect(`/index.html?error=${encodeURIComponent(errorMsg)}`);
    }
});

// 3. Endpoint para obtener datos del usuario autenticado
app.get('/api/github/me', (req, res) => {
    const userCookie = req.cookies.github_user;
    if (!userCookie) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    try {
        const user = JSON.parse(userCookie);
        res.json({ user });
    } catch {
        res.status(400).json({ error: 'Cookie inválida' });
    }
});

// 4. Endpoint para cerrar sesión de GitHub
app.get('/auth/logout', (req, res) => {
    res.clearCookie('github_user');
    console.log('👋 Usuario cerró sesión de GitHub');
    res.redirect('/index.html');
});

// ==========================================
// 📡 ENDPOINTS DE LA API
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
    console.log('🏥 Health check recibido');
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        user: 'Vicentegg4212',
        version: '2.0.0',
        model: CONFIG.GEMINI_MODEL,
        gemini: {
            model: CONFIG.GEMINI_MODEL
        }
    });
});

// Endpoint principal para generar respuestas
app.post('/api/generate', async (req, res) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    console.log(`\n📨 [${requestId}] Nueva petición recibida`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    try {
        const { history = [], lastMessage, imageB64 } = req.body;

        if (!lastMessage && !imageB64) {
            console.error(`❌ [${requestId}] Error: No se proporcionó mensaje ni imagen`);
            return res.status(400).json({
                error: 'Se requiere un mensaje o una imagen',
                request_id: requestId
            });
        }

        console.log(`📝 [${requestId}] Mensaje: "${lastMessage}"`);
        console.log(`🖼️ [${requestId}] Imagen: ${imageB64 ? 'Sí' : 'No'}`);
        console.log(`📚 [${requestId}] Historial: ${history.length} mensajes`);

        // Construir contenido para Google Gemini
        let userContent = [];
        
        if (lastMessage) {
            userContent.push(lastMessage);
        }

        // Agregar imagen si existe
        if (imageB64) {
            try {
                // Convertir base64 a formato compatible con Gemini
                const base64Data = imageB64.split(',')[1] || imageB64;
                userContent.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data
                    }
                });
            } catch (imgError) {
                console.warn(`⚠️ [${requestId}] Error procesando imagen:`, imgError.message);
            }
        }

        // Construir historial de chat
        const chatHistory = validateAndCleanHistory(history);

        console.log(`🤖 [${requestId}] Enviando a Google Gemini...`);
        console.log(`📚 [${requestId}] Historial limpio: ${chatHistory.length} mensajes`);

        // Construir el mensaje con system prompt
        let messageContent = [];
        
        // Agregar system prompt al inicio
        messageContent.push(CONFIG.SYSTEM_PROMPT);
        
        // Agregar contenido del usuario
        messageContent.push(...userContent);

        // Iniciar chat con historial (sin systemInstruction)
        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: CONFIG.GEMINI_CONFIG.maxOutputTokens,
                temperature: CONFIG.GEMINI_CONFIG.temperature,
                topP: CONFIG.GEMINI_CONFIG.topP
            }
        });

        // Enviar mensaje actual con system prompt incluido
        const result = await chat.sendMessage(messageContent);
        const response = result.response;
        const fullText = response.text();

        const processingTime = Date.now() - startTime;

        console.log(`✅ [${requestId}] Respuesta generada exitosamente`);
        console.log(`⏱️ [${requestId}] Tiempo total: ${processingTime}ms`);

        res.json({
            type: 'complete',
            guide: fullText,
            text: fullText,
            timestamp: new Date().toISOString(),
            request_id: requestId,
            processing_time_ms: processingTime,
            word_count: fullText.split(/\s+/).length,
            model_used: CONFIG.GEMINI_MODEL,
            user: 'Vicentegg4212'
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        
        // Si es error 429 (cuota excedida), reintenta automáticamente
        if (error.status === 429) {
            console.warn(`⏳ [${requestId}] Cuota excedida (429), reintentando en 5 segundos...`);
            
            // Esperar y reintentar
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            try {
                const retryResult = await chat.sendMessage(messageContent);
                const retryText = retryResult.response.text();
                
                console.log(`✅ [${requestId}] Reintento exitoso después de 429`);
                
                return res.json({
                    type: 'complete',
                    guide: retryText,
                    text: retryText,
                    timestamp: new Date().toISOString(),
                    request_id: requestId,
                    processing_time_ms: Date.now() - startTime,
                    word_count: retryText.split(/\s+/).length,
                    model_used: CONFIG.GEMINI_MODEL,
                    user: 'Vicentegg4212',
                    retried: true
                });
            } catch (retryError) {
                console.error(`❌ [${requestId}] Error en reintento:`, retryError.message);
                // Continuar con el manejo normal de errores
                error = retryError;
            }
        }
        
        console.error(`\n❌ [${requestId}] ERROR EN GOOGLE GEMINI:`);
        console.error(`📛 Tipo: ${error.name}`);
        console.error(`📝 Mensaje: ${error.message}`);
        console.error(`⏱️ Tiempo antes del error: ${processingTime}ms`);

        let errorMessage = 'Error al generar respuesta';
        let statusCode = 500;

        if (error.message.includes('API key') || error.message.includes('401')) {
            errorMessage = 'Error de autenticación: Verifica tu API key de Gemini';
            statusCode = 401;
        } else if (error.status === 429 || error.message.includes('quota') || error.message.includes('rate limit')) {
            errorMessage = 'Límite de uso excedido. Intenta en unos momentos.';
            statusCode = 429;
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Tiempo de espera agotado. Intenta de nuevo.';
            statusCode = 504;
        }

        res.status(statusCode).json({
            error: errorMessage,
            details: error.message,
            request_id: requestId,
            timestamp: new Date().toISOString(),
            processing_time_ms: processingTime
        });
    }
});

// Endpoint para streaming de respuestas
app.post('/api/generate-stream', async (req, res) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    console.log(`\n📨 [${requestId}] Nueva petición STREAMING recibida`);

    try {
        const { history = [], lastMessage, imageB64 } = req.body;

        if (!lastMessage && !imageB64) {
            return res.status(400).json({
                error: 'Se requiere un mensaje o una imagen',
                request_id: requestId
            });
        }

        // Construir contenido para Google Gemini
        let userContent = [];
        
        if (lastMessage) {
            userContent.push(lastMessage);
        }

        // Agregar imagen si existe
        if (imageB64) {
            try {
                const base64Data = imageB64.split(',')[1] || imageB64;
                userContent.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data
                    }
                });
            } catch (imgError) {
                console.warn(`⚠️ [${requestId}] Error procesando imagen:`, imgError.message);
            }
        }

        // Construir historial de chat
        const chatHistory = validateAndCleanHistory(history);

        console.log(`🤖 [${requestId}] Iniciando chat con streaming en Google Gemini...`);
        console.log(`📚 [${requestId}] Historial limpio: ${chatHistory.length} mensajes`);

        // Configurar headers para streaming
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        // Construir el mensaje con system prompt
        let messageContent = [];
        
        // Agregar system prompt al inicio
        messageContent.push(CONFIG.SYSTEM_PROMPT);
        
        // Agregar contenido del usuario
        messageContent.push(...userContent);

        // Iniciar chat con historial (sin systemInstruction)
        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: CONFIG.GEMINI_CONFIG.maxOutputTokens,
                temperature: CONFIG.GEMINI_CONFIG.temperature,
                topP: CONFIG.GEMINI_CONFIG.topP
            }
        });

        // Enviar mensaje con streaming
        const result = await chat.sendMessageStream(messageContent);
        let fullText = '';

        for await (const chunk of result.stream) {
            const content = chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (content) {
                fullText += content;
                
                const chunkData = JSON.stringify({
                    type: 'chunk',
                    content: content,
                    request_id: requestId
                }) + '\n';
                
                res.write(chunkData);
            }
        }

        // Enviar mensaje final
        const finalData = JSON.stringify({
            type: 'complete',
            guide: fullText,
            text: fullText,
            timestamp: new Date().toISOString(),
            request_id: requestId,
            processing_time_ms: Date.now() - startTime,
            word_count: fullText.split(/\s+/).length,
            model_used: CONFIG.GEMINI_MODEL
        }) + '\n';

        res.write(finalData);
        res.end();

        console.log(`✅ [${requestId}] Streaming completado exitosamente`);
        console.log(`⏱️ [${requestId}] Tiempo total: ${Date.now() - startTime}ms`);

    } catch (error) {
        console.error(`❌ [${requestId}] Error en streaming:`, error);
        
        // Si es error 429 (Too Many Requests), reintentar después de espera
        if (error.status === 429) {
            console.warn(`⏳ [${requestId}] Cuota excedida, reintentando en 5 segundos...`);
            
            setTimeout(async () => {
                try {
                    const retryResult = await chat.sendMessageStream(messageContent);
                    let fullText = '';

                    for await (const chunk of retryResult.stream) {
                        const content = chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        if (content) {
                            fullText += content;
                            
                            const chunkData = JSON.stringify({
                                type: 'chunk',
                                content: content,
                                request_id: requestId
                            }) + '\n';
                            
                            try {
                                res.write(chunkData);
                            } catch (writeErr) {
                                console.error(`Error escribiendo chunk:`, writeErr);
                                break;
                            }
                        }
                    }

                    const finalData = JSON.stringify({
                        type: 'complete',
                        guide: fullText,
                        text: fullText,
                        timestamp: new Date().toISOString(),
                        request_id: requestId,
                        processing_time_ms: Date.now() - startTime,
                        word_count: fullText.split(/\s+/).length,
                        model_used: CONFIG.GEMINI_MODEL
                    }) + '\n';

                    res.write(finalData);
                    res.end();

                    console.log(`✅ [${requestId}] Reintento exitoso después de 429`);
                } catch (retryError) {
                    console.error(`❌ [${requestId}] Error en reintento:`, retryError.message);
                    const errorData = JSON.stringify({
                        type: 'error',
                        error: 'Error después de reintentar',
                        details: retryError.message,
                        request_id: requestId
                    }) + '\n';
                    
                    try {
                        res.write(errorData);
                    } catch (e) {}
                    res.end();
                }
            }, 5000);
            
            return;
        }
        
        const errorData = JSON.stringify({
            type: 'error',
            error: error.message,
            details: error.message,
            request_id: requestId
        }) + '\n';
        
        try {
            res.write(errorData);
        } catch (writeError) {
            console.error(`❌ Error escribiendo error al cliente:`, writeError);
        }
        res.end();
    }
});

// Ruta principal - Servir index.html
app.get('/', (req, res) => {
    const indexPath = path.resolve(__dirname, '../../index.html');
    console.log(`📄 Sirviendo index.html desde: ${indexPath}`);
    res.sendFile(indexPath);
});

// Servir archivos estáticos desde la raíz del proyecto (después de rutas API y auth)
const projectRoot = path.resolve(__dirname, '../../');
app.use(express.static(projectRoot));
console.log(`📂 Sirviendo archivos estáticos desde: ${projectRoot}`);

// Manejo de errores 404
app.use((req, res) => {
    console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.url,
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// 🚀 INICIAR SERVIDOR
// ==========================================

let server;
const startServer = (port) => {
    server = app.listen(port, () => {
        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║  🚀 AI STUDY GENIUS - GOOGLE GEMINI SERVER           ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log(`\n✅ Servidor ejecutándose correctamente`);
        console.log(`📍 URL: http://localhost:${port}`);
        console.log(`👨‍💻 Desarrollado por: ${CONFIG.DEVELOPER}`);
        console.log(`📅 Fecha: ${new Date().toISOString()}`);
        console.log(`🤖 Modelo: ${CONFIG.GEMINI_MODEL}`);
        console.log(`\n💡 Presiona Ctrl+C para detener el servidor\n`);
    });
};

const DEFAULT_PORT = CONFIG.PORT || 3000;
const tryPort = (port) => {
    const tester = net.createServer()
        .once('error', err => {
            if (err.code === 'EADDRINUSE') {
                console.log(`⚠️ Puerto ${port} ocupado, probando siguiente...`);
                tryPort(port + 1);
            } else {
                throw err;
            }
        })
        .once('listening', () => {
            tester.close();
            startServer(port);
        })
        .listen(port);
};

tryPort(DEFAULT_PORT);

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('\n⚠️ Señal SIGTERM recibida. Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n⚠️ Señal SIGINT recibida (Ctrl+C). Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

export default app;