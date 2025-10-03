// Serverless Function para Azure OpenAI - Compatible con Vercel y GitHub Pages
import { AzureOpenAI } from '@azure/openai';

// Configuración de Azure OpenAI
const azureOpenAI = new AzureOpenAI({
    endpoint: 'https://ceinnova05162-5325-resource.cognitiveservices.azure.com',
    apiKey: process.env.AZURE_OPENAI_API_KEY || '5e7a3c7ba6724f8a9b0e2d5f4c8a1b6e',
    apiVersion: '2024-02-15-preview',
    deployment: 'gpt-4o'
});

export default async function handler(req, res) {
    // Configurar CORS para GitHub Pages
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // Health check
        res.status(200).json({
            status: 'online',
            model: 'gpt-4o',
            mode: 'serverless-function',
            timestamp: new Date().toISOString(),
            azure_openai: {
                deployment: 'gpt-4o',
                endpoint: 'https://ceinnova05162-5325-resource.cognitiveservices.azure.com'
            }
        });
        return;
    }

    if (req.method === 'POST') {
        try {
            const { history, lastMessage, imageB64 } = req.body;

            console.log(`📨 Nueva petición recibida: "${lastMessage}"`);

            // Preparar mensajes para Azure OpenAI
            const messages = [
                {
                    role: "system",
                    content: "Eres un asistente de estudio inteligente y amigable. Ayudas a estudiantes con sus preguntas académicas, proporcionas explicaciones claras y útiles. Responde de manera natural y conversacional en español."
                },
                ...history.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }))
            ];

            const startTime = Date.now();

            // Llamar a Azure OpenAI
            const response = await azureOpenAI.getChatCompletions(
                'gpt-4o',
                messages,
                {
                    maxTokens: 1000,
                    temperature: 0.7,
                    topP: 0.9,
                    frequencyPenalty: 0,
                    presencePenalty: 0
                }
            );

            const endTime = Date.now();
            const processingTime = endTime - startTime;

            const aiResponse = response.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

            console.log(`✅ Respuesta generada exitosamente en ${processingTime}ms`);

            res.status(200).json({
                response: aiResponse,
                model: 'gpt-4o',
                processing_time: processingTime,
                usage: {
                    prompt_tokens: response.usage?.promptTokens || 0,
                    completion_tokens: response.usage?.completionTokens || 0,
                    total_tokens: response.usage?.totalTokens || 0
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Error en serverless function:', error);
            res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}