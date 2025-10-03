// ==========================================
// 🚀 AI STUDY GENIUS - AZURE OPENAI SERVER
// 👨‍💻 Desarrollado por: Vicentegg4212
// 📅 Fecha: 2025-10-02 05:12:40 UTC
// ==========================================

import OpenAI from "openai";
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 🔑 CONFIGURACIÓN DIRECTA (SIN .env)
// ==========================================

const CONFIG = {
    AZURE_OPENAI_API_KEY: "5AobTefY3p7mkeceBRQYdEQNtc6uz2F8Aio9fZ2iqDRvLh4thDeXJQQJ99BJACHYHv6XJ3w3AAAAACOGB4kA",  // 👈 CAMBIA ESTO
    AZURE_OPENAI_ENDPOINT: "https://ceinnova05162-5325-resource.cognitiveservices.azure.com/",
    AZURE_OPENAI_DEPLOYMENT_NAME: "gpt-4o",
    API_VERSION: "2024-04-01-preview",
    PORT: 3000
};

console.log('\n🔍 VERIFICANDO CONFIGURACIÓN...');
console.log(`🔑 API Key: ${CONFIG.AZURE_OPENAI_API_KEY ? '✅ OK' : '❌ NO'}`);
console.log(`🌐 Endpoint: ${CONFIG.AZURE_OPENAI_ENDPOINT ? '✅ OK' : '❌ NO'}`);
console.log(`🤖 Deployment: ${CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME}`);
console.log(`🚪 Puerto: ${CONFIG.PORT}\n`);

// Validación de configuración
if (!CONFIG.AZURE_OPENAI_API_KEY ) {
    console.error('❌ ERROR CRÍTICO: AZURE_OPENAI_API_KEY no configurada');
    console.error('📝 Abre server.js y cambia "TU_API_KEY_AQUI" por tu clave real');
    process.exit(1);
}

if (!CONFIG.AZURE_OPENAI_ENDPOINT) {
    console.error('❌ ERROR CRÍTICO: AZURE_OPENAI_ENDPOINT no configurado');
    process.exit(1);
}

// ==========================================
// 🤖 INICIALIZAR CLIENTE AZURE OPENAI
// ==========================================

const client = new OpenAI({
    apiKey: CONFIG.AZURE_OPENAI_API_KEY,
    baseURL: `${CONFIG.AZURE_OPENAI_ENDPOINT}openai/deployments/${CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME}`,
    defaultQuery: { 'api-version': CONFIG.API_VERSION },
    defaultHeaders: {
        'api-key': CONFIG.AZURE_OPENAI_API_KEY,
    }
});

console.log('✅ Cliente Azure OpenAI inicializado correctamente\n');

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
        azure_openai: {
            endpoint: CONFIG.AZURE_OPENAI_ENDPOINT,
            deployment: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
            api_version: CONFIG.API_VERSION
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

        // Llamada a Azure OpenAI con streaming
        const response = await client.chat.completions.create({
            messages: messages,
            model: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
            max_tokens: 4096,
            temperature: 0.7,
            top_p: 0.95,
            stream: true
        });

        const processingTime = Date.now() - startTime;

        // Configurar headers para streaming
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        });

        let fullText = '';
        let tokenCount = 0;

        try {
            for await (const chunk of response) {
                const delta = chunk.choices[0]?.delta?.content;
                if (delta) {
                    fullText += delta;
                    tokenCount++;
                    
                    // Enviar chunk al cliente
                    const chunkData = JSON.stringify({
                        type: 'chunk',
                        content: delta,
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
                model_used: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
                user: 'Vicentegg4212',
                usage: {
                    completion_tokens: tokenCount,
                    total_tokens: tokenCount
                }
            }) + '\n';

            res.write(finalData);
            res.end();

            console.log(`✅ [${requestId}] Streaming completado exitosamente`);
            console.log(`⏱️ [${requestId}] Tiempo total: ${Date.now() - startTime}ms`);
            console.log(`📊 [${requestId}] Tokens streamed: ${tokenCount}`);

        } catch (streamError) {
            console.error(`❌ [${requestId}] Error durante streaming:`, streamError);
            
            const errorData = JSON.stringify({
                type: 'error',
                error: 'Error durante streaming',
                details: streamError.message,
                request_id: requestId
            }) + '\n';
            
            res.write(errorData);
            res.end();
        }

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

        // Construir mensajes para Azure OpenAI
        const messages = [
            {
                role: "system",
                content: `Eres un asistente educativo experto creado por Vicentegg4212. Responde de forma clara y estructurada.`
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

        // Agregar mensaje actual
        if (imageB64) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: lastMessage || "Analiza esta imagen" },
                    { type: "image_url", image_url: { url: imageB64 } }
                ]
            });
        } else {
            messages.push({
                role: "user",
                content: lastMessage
            });
        }

        // Llamada a Azure OpenAI con streaming
        const response = await client.chat.completions.create({
            messages: messages,
            model: CONFIG.AZURE_OPENAI_DEPLOYMENT_NAME,
            max_tokens: 4096,
            temperature: 0.7,
            stream: true
        });

        // Configurar headers para streaming
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        });

        let fullText = '';

        for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
                fullText += delta;
                
                const chunkData = JSON.stringify({
                    type: 'chunk',
                    content: delta,
                    request_id: requestId
                }) + '\n';
                
                res.write(chunkData);
            }
        }

        // Enviar mensaje final
        const finalData = JSON.stringify({
            type: 'complete',
            guide: fullText,
            timestamp: new Date().toISOString(),
            request_id: requestId,
            processing_time_ms: Date.now() - startTime,
            word_count: fullText.split(/\s+/).length
        }) + '\n';

        res.write(finalData);
        res.end();

    } catch (error) {
        console.error('Error en streaming:', error);
        res.status(500).json({
            error: 'Error en streaming',
            details: error.message,
            request_id: requestId
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