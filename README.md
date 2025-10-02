# 🧠 AI Study Genius - Generador de Guías Inteligente

**👨‍💻 Desarrollado por:** Vicentegg4212  
**📅 Fecha:** 2025-10-02  
**🎯 Propósito:** Aplicación web para generar guías de estudio usando Azure OpenAI

## 🚀 Características

- ✅ **Frontend moderno** con diseño responsive
- ✅ **Backend Express.js** con Azure OpenAI
- ✅ **Detección automática** de entorno (desarrollo/producción)
- ✅ **Sin errores** en hosts externos
- ✅ **Interfaz intuitiva** para generar guías de estudio
- ✅ **Soporte para imágenes** en las consultas

## 🔧 Configuración e Instalación

### 1. **Configurar Backend**
```bash
cd js/backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de Azure OpenAI
```

### 2. **Ejecutar**
```bash
node server.js
# Abrir: http://localhost:3000
```

## 🔑 Variables de Entorno (.env)

```bash
AZURE_OPENAI_API_KEY=tu_api_key_aqui
AZURE_OPENAI_ENDPOINT=https://tu-endpoint.cognitiveservices.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
```

## 🌐 Despliegue

- **Frontend:** Compatible con Netlify, Vercel, GitHub Pages
- **Backend:** Railway, Render, Heroku

**¿Necesitas ayuda?** vicente-17240054@umb.edu.mx
