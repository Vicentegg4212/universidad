// ==========================================
// 🚀 AI STUDY GENIUS - AZURE OPENAI SERVER
// 👨‍💻 Desarrollado por: Vicentegg4212
// 📅 Fecha: 2025-10-02 05:12:40 UTC
// ==========================================

import { AzureOpenAI } from "openai";
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 🔑 CONFIGURACIÓN FUNCIONAL - IA AL 100%
// ==========================================

const CONFIG = {
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY || "5AobTefY3p7mkeceBRQYdEQNtc6uz2F8Aio9fZ2iqDRvLh4thDeXJQQJ99BJACHYHv6XJ3w3AAAAACOGB4kA",
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT || "https://ceinnova05162-5325-resource.cognitiveservices.azure.com/",
    AZURE_OPENAI_DEPLOYMENT_NAME: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o",
    API_VERSION: process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview",
    PORT: process.env.PORT || 3000
};

console.log('\n🔍 VERIFICANDO CONFIGURACIÓN...');
console.log(`🔑 API Key: ${CONFIG.AZURE_OPENAI_API_KEY ? '✅ OK' : '❌ NO'}`);
console.log(`🌐 Endpoint: ${CONFIG.AZURE_OPENAI_ENDPOINT ? '✅ OK' : '❌ NO'}`);
console.log(`🤖 Deployment: ${CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME}`);
console.log(`🚪 Puerto: ${CONFIG.PORT}\n`);

// ==========================================
// 🤖 INICIALIZAR CLIENTE AZURE OPENAI
// ==========================================

let client = null;
let isAzureConfigured = false;

try {
    if (CONFIG.AZURE_OPENAI_API_KEY && CONFIG.AZURE_OPENAI_API_KEY.length > 10) {
        client = new AzureOpenAI({
            endpoint: CONFIG.AZURE_OPENAI_ENDPOINT,
            apiKey: CONFIG.AZURE_OPENAI_API_KEY,
            deployment: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
            apiVersion: CONFIG.API_VERSION
        });
        isAzureConfigured = true;
        console.log('✅ Cliente Azure OpenAI inicializado correctamente');
    } else {
        console.log('⚠️ Azure OpenAI no configurado - Modo demo');
    }
} catch (error) {
    console.error('❌ Error inicializando Azure OpenAI:', error.message);
    console.log('🔄 Servidor continuará en modo demo');
}

console.log('\n');

// ==========================================
// 🌐 CONFIGURAR EXPRESS
// ==========================================

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos desde la raíz del proyecto
const projectRoot = path.resolve(__dirname, '../../');
app.use(express.static(projectRoot));

console.log(`📂 Sirviendo archivos estáticos desde: ${projectRoot}`);

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
        azure_configured: isAzureConfigured,
        model: isAzureConfigured ? CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME : 'demo-mode',
        azure_openai: {
            endpoint: CONFIG.AZURE_OPENAI_ENDPOINT,
            deployment: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
            api_version: CONFIG.API_VERSION,
            configured: isAzureConfigured
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

        // FORZAR USO DE AZURE OPENAI - SIN MODO DEMO
        if (!isAzureConfigured || !client) {
            console.error(`❌ [${requestId}] ERROR CRÍTICO: Azure OpenAI no configurado`);
            
            // Intentar reconfigurar el cliente
            try {
                console.log(`🔄 [${requestId}] Intentando reconfigurar Azure OpenAI...`);
                client = new AzureOpenAI({
                    endpoint: CONFIG.AZURE_OPENAI_ENDPOINT,
                    apiKey: CONFIG.AZURE_OPENAI_API_KEY,
                    deployment: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
                    apiVersion: CONFIG.API_VERSION
                });
                isAzureConfigured = true;
                console.log(`✅ [${requestId}] Cliente Azure OpenAI reconfigurado exitosamente`);
            } catch (error) {
                console.error(`❌ [${requestId}] Error al reconfigurar:`, error.message);
                return res.status(500).json({
                    error: 'Azure OpenAI no disponible. La IA requiere configuración válida.',
                    request_id: requestId,
                    details: error.message
                });
            }
        }

        // Construir mensajes para Azure OpenAI
        const messages = [
            {
                role: "system",
                content: `Eres un asistente educativo experto creado por Vicentegg4212. Tu función es:
                
1. 📚 Crear guías de estudio completas y estructuradas
2. 🎯 Explicar conceptos de forma clara y concisa
3. 💡 Proporcionar ejemplos prácticos
4. 🔍 Analizar imágenes de apuntes, libros, problemas
5. ✅ Resolver dudas académicas

Formato de respuesta:
- Usa emojis para mejor visualización
- Estructura con títulos y subtítulos claros
- Incluye ejemplos cuando sea necesario
- Sé conciso pero completo

Recuerda: Eres un tutor amigable pero profesional.`
            }
        ];

        // Agregar historial previo
        history.forEach(msg => {
            if (msg.role && msg.content) {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            }
        });

        // Agregar mensaje actual (con o sin imagen)
        if (imageB64) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: lastMessage || "Analiza esta imagen y crea una guía de estudio" },
                    { type: "image_url", image_url: { url: imageB64 } }
                ]
            });
        } else {
            messages.push({
                role: "user",
                content: lastMessage
            });
        }

        console.log(`🤖 [${requestId}] Enviando a Azure OpenAI...`);

        // Llamada a Azure OpenAI
        const response = await client.chat.completions.create({
            messages: messages,
            model: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
            max_tokens: 4096,
            temperature: 0.7,
            top_p: 0.95,
            stream: false
        });

        const processingTime = Date.now() - startTime;

        if (!response.choices || response.choices.length === 0) {
            throw new Error('Respuesta vacía de Azure OpenAI');
        }

        const generatedText = response.choices[0].message.content;
        const wordCount = generatedText.split(/\s+/).length;

        console.log(`✅ [${requestId}] Respuesta generada exitosamente`);
        console.log(`⏱️ [${requestId}] Tiempo de procesamiento: ${processingTime}ms`);
        console.log(`📊 [${requestId}] Palabras generadas: ${wordCount}`);
        console.log(`🔢 [${requestId}] Tokens usados: prompt=${response.usage?.prompt_tokens || 0}, completion=${response.usage?.completion_tokens || 0}`);

        res.json({
            guide: generatedText,
            text: generatedText,
            timestamp: new Date().toISOString(),
            request_id: requestId,
            processing_time_ms: processingTime,
            word_count: wordCount,
            model_used: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
            user: 'Vicentegg4212',
            usage: {
                prompt_tokens: response.usage?.prompt_tokens || 0,
                completion_tokens: response.usage?.completion_tokens || 0,
                total_tokens: response.usage?.total_tokens || 0
            }
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        
        console.error(`\n❌ [${requestId}] ERROR EN AZURE OPENAI:`);
        console.error(`📛 Tipo: ${error.name}`);
        console.error(`📝 Mensaje: ${error.message}`);
        console.error(`⏱️ Tiempo antes del error: ${processingTime}ms`);
        
        if (error.response) {
            console.error(`📦 Status: ${error.response.status}`);
            console.error(`📄 Data:`, error.response.data);
        }

        let errorMessage = 'Error al generar respuesta';
        let statusCode = 500;

        if (error.message.includes('API key')) {
            errorMessage = 'Error de autenticación: Verifica tu API key';
            statusCode = 401;
        } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
            errorMessage = 'Límite de uso excedido. Intenta más tarde.';
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

// Ruta principal - Servir index.html
app.get('/', (req, res) => {
    const indexPath = path.join(projectRoot, 'index.html');
    console.log(`📄 Sirviendo index.html desde: ${indexPath}`);
    res.sendFile(indexPath);
});

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

const server = app.listen(CONFIG.PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀 AI STUDY GENIUS - AZURE OPENAI SERVER  ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log(`\n✅ Servidor ejecutándose correctamente`);
    console.log(`📍 URL: http://localhost:${CONFIG.PORT}`);
    console.log(`👨‍💻 Desarrollado por: Vicentegg4212`);
    console.log(`📅 Fecha: ${new Date().toISOString()}`);
    console.log(`🤖 Modelo: ${CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME}`);
    console.log(`🌐 Endpoint: ${CONFIG.AZURE_OPENAI_ENDPOINT}`);
    console.log(`\n💡 Presiona Ctrl+C para detener el servidor\n`);
});

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