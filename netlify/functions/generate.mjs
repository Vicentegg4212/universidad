import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("GEMINI_API_KEY no está definida");
      return new Response(
        JSON.stringify({ 
          error: "Error de configuración",
          details: "GEMINI_API_KEY no está configurada"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const { history = [], lastMessage, imageB64 } = JSON.parse(req.body || '{}');

    if (!lastMessage && !imageB64) {
      return new Response(
        JSON.stringify({ error: "Se requiere un mensaje o una imagen" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let userContent = [];
    
    if (lastMessage) {
      userContent.push(lastMessage);
    }

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
        console.warn("Error procesando imagen:", imgError.message);
      }
    }

    const chatHistory = (history || [])
      .filter(msg => msg && msg.text && msg.text.trim() !== '')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    const SYSTEM_PROMPT = `Eres un asistente educativo EXPERTO creado por Vicentegg4212. Tu misión es ayudar estudiantes a dominar temas académicos.

**REGLAS FUNDAMENTALES:**
1. 🎯 SIGUE LAS INSTRUCCIONES DEL USUARIO AL PIE DE LA LETRA
2. 📚 SÉ PRECISO Y DIRECTO - no divagues
3. 🔍 ANALIZA EL CONTEXTO COMPLETAMENTE
4. ✅ RESPONDE EXACTAMENTE LO QUE SE TE PIDE`;

    let messageContent = [SYSTEM_PROMPT, ...userContent];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.05,
        topP: 0.5
      }
    });

    const result = await chat.sendMessage(messageContent);
    const fullText = result.response.text();

    return new Response(
      JSON.stringify({
        type: 'complete',
        guide: fullText,
        text: fullText,
        timestamp: new Date().toISOString(),
        word_count: fullText.split(/\s+/).length,
        model_used: "gemini-2.0-flash",
        user: "Vicentegg4212"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Error al generar respuesta",
        details: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
