export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        res.status(200).json({
            status: 'online',
            message: 'AI Chatbot Serverless Function is running!',
            model: 'gpt-4o',
            mode: 'serverless-function',
            timestamp: new Date().toISOString(),
            azure_openai: {
                deployment: 'gpt-4o',
                endpoint: 'https://ceinnova05162-5325-resource.cognitiveservices.azure.com'
            }
        });
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}