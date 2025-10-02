/* ================================================
   🎨 GENERADOR DE INFOGRAFÍAS - AI STUDY GENIUS
   👨‍💻 Desarrollado por: Vicentegg4212  
   📊 Sistema de creación automática de infografías educativas
   ================================================ */

class InfographicsGenerator {
    constructor() {
        this.templates = {
            concept_map: {
                name: "Mapa Conceptual",
                icon: "🗺️",
                description: "Visualiza relaciones entre conceptos",
                structure: "hierarchical"
            },
            timeline: {
                name: "Línea de Tiempo",
                icon: "⏰",
                description: "Eventos cronológicos",
                structure: "linear"
            },
            process_flow: {
                name: "Diagrama de Proceso",
                icon: "🔄",
                description: "Pasos secuenciales",
                structure: "flow"
            },
            comparison: {
                name: "Tabla Comparativa",
                icon: "⚖️",
                description: "Comparar elementos",
                structure: "grid"
            },
            statistics: {
                name: "Gráfico Estadístico",
                icon: "📊",
                description: "Datos y estadísticas",
                structure: "chart"
            },
            summary: {
                name: "Resumen Visual",
                icon: "📋",
                description: "Puntos clave resumidos",
                structure: "list"
            }
        };
        
        this.colorSchemes = {
            academic: ['#3b82f6', '#1e40af', '#60a5fa', '#93c5fd'],
            science: ['#10b981', '#059669', '#34d399', '#6ee7b7'],
            history: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d'],
            literature: ['#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd'],
            mathematics: ['#ef4444', '#dc2626', '#f87171', '#fca5a5']
        };
        
        this.fonts = {
            title: 'Inter',
            subtitle: 'Inter',
            body: 'Inter',
            accent: 'JetBrains Mono'
        };
        
        this.currentInfographic = null;
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }

    init() {
        this.createFloatingButton();
        this.createModal();
        this.setupEventListeners();
    }

    createFloatingButton() {
        const btn = document.createElement('button');
        btn.className = 'infographics-floating-btn';
        btn.innerHTML = '🎨';
        btn.title = 'Generador de Infografías';
        btn.onclick = () => this.openModal();
        document.body.appendChild(btn);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'infographics-modal';
        modal.innerHTML = `
            <div class="infographics-overlay" onclick="infographicsGenerator.closeModal()"></div>
            <div class="infographics-content">
                <div class="infographics-header">
                    <h3>🎨 Generador de Infografías</h3>
                    <div class="infographics-header-actions">
                        <button class="infographics-gallery-btn" onclick="infographicsGenerator.showGallery()" title="Galería">🖼️</button>
                        <button class="infographics-close-btn" onclick="infographicsGenerator.closeModal()">✕</button>
                    </div>
                </div>
                
                <div class="infographics-body">
                    <div class="infographics-tabs">
                        <button class="infographics-tab active" onclick="infographicsGenerator.switchTab('create')">Crear</button>
                        <button class="infographics-tab" onclick="infographicsGenerator.switchTab('templates')">Plantillas</button>
                        <button class="infographics-tab" onclick="infographicsGenerator.switchTab('preview')">Vista Previa</button>
                    </div>
                    
                    <!-- Crear Infografía -->
                    <div class="infographics-tab-content" id="infographics-create-tab">
                        <form class="infographics-form" onsubmit="infographicsGenerator.generateFromText(event)">
                            <div class="infographics-field">
                                <label>📝 Contenido para la Infografía</label>
                                <textarea name="content" placeholder="Ingresa el texto, datos o información que quieres convertir en infografía..." rows="6" required></textarea>
                                <small>Ejemplo: "Proceso de fotosíntesis: 1. Absorción de luz solar, 2. Absorción de CO2, 3. Producción de glucosa..."</small>
                            </div>
                            
                            <div class="infographics-field">
                                <label>🎯 Tipo de Infografía</label>
                                <div class="infographics-template-grid">
                                    ${Object.entries(this.templates).map(([key, template]) => `
                                        <label class="infographics-template-option">
                                            <input type="radio" name="template" value="${key}" required>
                                            <div class="infographics-template-card">
                                                <div class="infographics-template-icon">${template.icon}</div>
                                                <div class="infographics-template-name">${template.name}</div>
                                                <div class="infographics-template-desc">${template.description}</div>
                                            </div>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="infographics-field">
                                <label>🎨 Esquema de Colores</label>
                                <div class="infographics-color-schemes">
                                    ${Object.entries(this.colorSchemes).map(([scheme, colors]) => `
                                        <label class="infographics-color-option">
                                            <input type="radio" name="colorScheme" value="${scheme}" required>
                                            <div class="infographics-color-preview">
                                                ${colors.map(color => `<div class="infographics-color-sample" style="background: ${color}"></div>`).join('')}
                                            </div>
                                            <span>${scheme.charAt(0).toUpperCase() + scheme.slice(1)}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="infographics-field">
                                <label>📏 Tamaño</label>
                                <select name="size" required>
                                    <option value="instagram">Instagram Post (1080x1080)</option>
                                    <option value="story">Instagram Story (1080x1920)</option>
                                    <option value="facebook">Facebook Post (1200x630)</option>
                                    <option value="twitter">Twitter Post (1024x512)</option>
                                    <option value="presentation">Presentación (1920x1080)</option>
                                    <option value="print">Impresión A4 (2480x3508)</option>
                                </select>
                            </div>
                            
                            <button type="submit" class="infographics-generate-btn">🚀 Generar Infografía</button>
                        </form>
                    </div>
                    
                    <!-- Plantillas -->
                    <div class="infographics-tab-content hidden" id="infographics-templates-tab">
                        <div class="infographics-templates-grid">
                            ${Object.entries(this.templates).map(([key, template]) => `
                                <div class="infographics-template-large" onclick="infographicsGenerator.selectTemplate('${key}')">
                                    <div class="infographics-template-preview">
                                        <div class="infographics-template-icon-large">${template.icon}</div>
                                    </div>
                                    <div class="infographics-template-info">
                                        <h4>${template.name}</h4>
                                        <p>${template.description}</p>
                                        <button class="infographics-use-template-btn">Usar Plantilla</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Vista Previa -->
                    <div class="infographics-tab-content hidden" id="infographics-preview-tab">
                        <div class="infographics-preview-container">
                            <div class="infographics-preview-header">
                                <h4>Vista Previa</h4>
                                <div class="infographics-preview-actions">
                                    <button onclick="infographicsGenerator.editInfographic()" class="infographics-edit-btn">✏️ Editar</button>
                                    <button onclick="infographicsGenerator.downloadInfographic()" class="infographics-download-btn">💾 Descargar</button>
                                    <button onclick="infographicsGenerator.shareInfographic()" class="infographics-share-btn">🔗 Compartir</button>
                                </div>
                            </div>
                            <div class="infographics-canvas-container">
                                <canvas id="infographics-canvas"></canvas>
                            </div>
                            <div class="infographics-preview-info">
                                <p id="infographics-preview-details">No hay infografía generada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        this.canvas = document.getElementById('infographics-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        // Event listeners para el canvas y otros elementos
    }

    openModal() {
        const modal = document.querySelector('.infographics-modal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.infographics-content').style.transform = 'translateY(0)';
        }, 10);
    }

    closeModal() {
        const modal = document.querySelector('.infographics-modal');
        modal.style.opacity = '0';
        modal.querySelector('.infographics-content').style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    switchTab(tabName) {
        // Actualizar botones de tabs
        document.querySelectorAll('.infographics-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.infographics-tab[onclick="infographicsGenerator.switchTab('${tabName}')"]`).classList.add('active');
        
        // Mostrar contenido correspondiente
        document.querySelectorAll('.infographics-tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`infographics-${tabName}-tab`).classList.remove('hidden');
    }

    async generateFromText(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const content = formData.get('content');
        const template = formData.get('template');
        const colorScheme = formData.get('colorScheme');
        const size = formData.get('size');
        
        this.showLoading();
        
        try {
            // Analizar el contenido con IA
            const analysisResult = await this.analyzeContent(content);
            
            // Crear la infografía
            const infographic = await this.createInfographic({
                content: analysisResult,
                template,
                colorScheme,
                size
            });
            
            this.currentInfographic = infographic;
            
            // Cambiar a vista previa
            this.switchTab('preview');
            this.renderInfographic(infographic);
            
            this.hideLoading();
            this.showNotification('✅ Infografía generada exitosamente', 'success');
            
        } catch (error) {
            console.error('Error generating infographic:', error);
            this.hideLoading();
            this.showNotification('❌ Error al generar la infografía', 'error');
        }
    }

    async analyzeContent(content) {
        // Simular análisis de IA para extraer estructura del contenido
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Detectar tipo de contenido y extraer elementos clave
        const lines = content.split('\n').filter(line => line.trim());
        const elements = [];
        
        lines.forEach((line, index) => {
            // Detectar títulos
            if (line.match(/^#\s+/) || line.match(/^\d+\.\s+[A-Z]/)) {
                elements.push({
                    type: 'title',
                    content: line.replace(/^[#\d.\s]+/, ''),
                    level: 1,
                    order: index
                });
            }
            // Detectar subtítulos
            else if (line.match(/^##\s+/) || line.match(/^\s*-\s+[A-Z]/)) {
                elements.push({
                    type: 'subtitle',
                    content: line.replace(/^[#\-\s]+/, ''),
                    level: 2,
                    order: index
                });
            }
            // Detectar puntos clave
            else if (line.match(/^\s*[\-\*]\s+/) || line.match(/^\d+\)\s+/)) {
                elements.push({
                    type: 'bullet',
                    content: line.replace(/^[\s\-\*\d\)]+/, ''),
                    order: index
                });
            }
            // Texto normal
            else if (line.trim()) {
                elements.push({
                    type: 'text',
                    content: line.trim(),
                    order: index
                });
            }
        });
        
        return {
            elements,
            mainTitle: elements.find(e => e.type === 'title')?.content || 'Infografía',
            keyPoints: elements.filter(e => e.type === 'bullet').map(e => e.content),
            totalElements: elements.length
        };
    }

    async createInfographic(config) {
        const { content, template, colorScheme, size } = config;
        const colors = this.colorSchemes[colorScheme];
        const dimensions = this.getSizeDimensions(size);
        
        return {
            id: Date.now(),
            title: content.mainTitle,
            template,
            colorScheme,
            size,
            dimensions,
            colors,
            content,
            createdAt: new Date().toISOString()
        };
    }

    getSizeDimensions(size) {
        const sizes = {
            instagram: { width: 1080, height: 1080 },
            story: { width: 1080, height: 1920 },
            facebook: { width: 1200, height: 630 },
            twitter: { width: 1024, height: 512 },
            presentation: { width: 1920, height: 1080 },
            print: { width: 2480, height: 3508 }
        };
        return sizes[size] || sizes.instagram;
    }

    renderInfographic(infographic) {
        const { dimensions, colors, content, template } = infographic;
        
        // Configurar canvas
        this.canvas.width = dimensions.width;
        this.canvas.height = dimensions.height;
        
        // Escalar para mostrar en el contenedor
        const containerWidth = 400;
        const scale = containerWidth / dimensions.width;
        this.canvas.style.width = containerWidth + 'px';
        this.canvas.style.height = (dimensions.height * scale) + 'px';
        
        // Limpiar canvas
        this.ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        
        // Renderizar según la plantilla
        switch (template) {
            case 'concept_map':
                this.renderConceptMap(infographic);
                break;
            case 'timeline':
                this.renderTimeline(infographic);
                break;
            case 'process_flow':
                this.renderProcessFlow(infographic);
                break;
            case 'comparison':
                this.renderComparison(infographic);
                break;
            case 'statistics':
                this.renderStatistics(infographic);
                break;
            case 'summary':
                this.renderSummary(infographic);
                break;
            default:
                this.renderDefault(infographic);
        }
        
        // Actualizar información de vista previa
        document.getElementById('infographics-preview-details').textContent = 
            `${infographic.title} • ${template} • ${dimensions.width}x${dimensions.height}`;
    }

    renderConceptMap(infographic) {
        const { dimensions, colors, content } = infographic;
        const { width, height } = dimensions;
        
        // Fondo degradado
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, colors[0] + '20');
        gradient.addColorStop(1, colors[1] + '20');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        
        // Título principal
        this.ctx.fillStyle = colors[0];
        this.ctx.font = `bold ${width * 0.04}px ${this.fonts.title}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(content.mainTitle, width / 2, height * 0.1);
        
        // Nodos conceptuales
        const nodeRadius = width * 0.08;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.25;
        
        content.keyPoints.forEach((point, index) => {
            const angle = (index / content.keyPoints.length) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Línea conectora
            this.ctx.strokeStyle = colors[1];
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            
            // Nodo
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.beginPath();
            this.ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Texto del nodo
            this.ctx.fillStyle = 'white';
            this.ctx.font = `${width * 0.015}px ${this.fonts.body}`;
            this.ctx.textAlign = 'center';
            this.wrapText(point, x, y, nodeRadius * 1.5);
        });
        
        // Nodo central
        this.ctx.fillStyle = colors[0];
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, nodeRadius * 0.7, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    renderTimeline(infographic) {
        const { dimensions, colors, content } = infographic;
        const { width, height } = dimensions;
        
        // Fondo
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.fillRect(0, 0, width, height);
        
        // Título
        this.ctx.fillStyle = colors[0];
        this.ctx.font = `bold ${width * 0.04}px ${this.fonts.title}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(content.mainTitle, width / 2, height * 0.1);
        
        // Línea principal de tiempo
        const timelineY = height / 2;
        const startX = width * 0.1;
        const endX = width * 0.9;
        
        this.ctx.strokeStyle = colors[1];
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, timelineY);
        this.ctx.lineTo(endX, timelineY);
        this.ctx.stroke();
        
        // Eventos
        const stepWidth = (endX - startX) / (content.keyPoints.length - 1);
        
        content.keyPoints.forEach((point, index) => {
            const x = startX + index * stepWidth;
            const isEven = index % 2 === 0;
            const textY = isEven ? timelineY - height * 0.15 : timelineY + height * 0.15;
            
            // Punto en la línea
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.beginPath();
            this.ctx.arc(x, timelineY, 15, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Línea conectora
            this.ctx.strokeStyle = colors[index % colors.length];
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(x, timelineY);
            this.ctx.lineTo(x, textY + (isEven ? 30 : -30));
            this.ctx.stroke();
            
            // Texto del evento
            this.ctx.fillStyle = colors[0];
            this.ctx.font = `${width * 0.02}px ${this.fonts.body}`;
            this.ctx.textAlign = 'center';
            this.wrapText(point, x, textY, width * 0.15);
        });
    }

    renderSummary(infographic) {
        const { dimensions, colors, content } = infographic;
        const { width, height } = dimensions;
        
        // Fondo
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, width, height);
        
        // Header con gradiente
        const headerGradient = this.ctx.createLinearGradient(0, 0, width, height * 0.2);
        headerGradient.addColorStop(0, colors[0]);
        headerGradient.addColorStop(1, colors[1]);
        this.ctx.fillStyle = headerGradient;
        this.ctx.fillRect(0, 0, width, height * 0.2);
        
        // Título
        this.ctx.fillStyle = 'white';
        this.ctx.font = `bold ${width * 0.035}px ${this.fonts.title}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(content.mainTitle, width / 2, height * 0.12);
        
        // Puntos clave
        const cardHeight = (height * 0.7) / content.keyPoints.length;
        const margin = width * 0.05;
        
        content.keyPoints.forEach((point, index) => {
            const y = height * 0.25 + index * cardHeight;
            
            // Tarjeta
            this.ctx.fillStyle = colors[index % colors.length] + '20';
            this.ctx.fillRect(margin, y, width - margin * 2, cardHeight * 0.8);
            
            // Borde izquierdo
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.fillRect(margin, y, 8, cardHeight * 0.8);
            
            // Número
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.font = `bold ${width * 0.025}px ${this.fonts.accent}`;
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${index + 1}`, margin + 30, y + cardHeight * 0.3);
            
            // Texto
            this.ctx.fillStyle = '#1f2937';
            this.ctx.font = `${width * 0.02}px ${this.fonts.body}`;
            this.wrapText(point, margin + 80, y + cardHeight * 0.4, width - margin * 2 - 100);
        });
    }

    wrapText(text, x, y, maxWidth) {
        const words = text.split(' ');
        let line = '';
        let lineHeight = parseInt(this.ctx.font) * 1.2;
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, currentY);
    }

    selectTemplate(templateKey) {
        // Marcar template seleccionado
        const radioButton = document.querySelector(`input[name="template"][value="${templateKey}"]`);
        if (radioButton) {
            radioButton.checked = true;
        }
        
        // Cambiar a tab de crear
        this.switchTab('create');
        
        this.showNotification(`📋 Plantilla "${this.templates[templateKey].name}" seleccionada`, 'success');
    }

    downloadInfographic() {
        if (!this.currentInfographic) {
            this.showNotification('❌ No hay infografía para descargar', 'error');
            return;
        }
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.download = `infografia-${this.currentInfographic.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        
        this.showNotification('💾 Infografía descargada', 'success');
    }

    shareInfographic() {
        if (!this.currentInfographic) {
            this.showNotification('❌ No hay infografía para compartir', 'error');
            return;
        }
        
        // Convertir canvas a blob y usar Web Share API si está disponible
        this.canvas.toBlob(blob => {
            const file = new File([blob], 'infografia.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: this.currentInfographic.title,
                    text: 'Infografía creada con AI Study Genius',
                    files: [file]
                });
            } else {
                // Fallback: copiar al portapapeles
                this.copyToClipboard();
            }
        });
    }

    async copyToClipboard() {
        try {
            const blob = await new Promise(resolve => this.canvas.toBlob(resolve));
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            this.showNotification('📋 Infografía copiada al portapapeles', 'success');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showNotification('❌ Error al copiar al portapapeles', 'error');
        }
    }

    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'infographics-loading';
        loadingDiv.innerHTML = `
            <div class="infographics-loading-content">
                <div class="infographics-spinner"></div>
                <p>Generando infografía...</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loading = document.querySelector('.infographics-loading');
        if (loading) {
            loading.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `infographics-notification ${type}`;
        notification.innerHTML = `
            <div class="infographics-notification-content">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showGallery() {
        // Implementar galería de infografías guardadas
        this.showNotification('🖼️ Galería próximamente disponible', 'info');
    }

    editInfographic() {
        if (!this.currentInfographic) {
            this.showNotification('❌ No hay infografía para editar', 'error');
            return;
        }
        
        this.switchTab('create');
        this.showNotification('✏️ Modo edición activado', 'info');
    }

    // Métodos adicionales para otros tipos de plantillas
    renderProcessFlow(infographic) {
        // Implementar diagrama de proceso
        this.renderDefault(infographic);
    }

    renderComparison(infographic) {
        // Implementar tabla comparativa
        this.renderDefault(infographic);
    }

    renderStatistics(infographic) {
        // Implementar gráfico estadístico
        this.renderDefault(infographic);
    }

    renderDefault(infographic) {
        const { dimensions, colors, content } = infographic;
        const { width, height } = dimensions;
        
        // Fondo básico
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.fillRect(0, 0, width, height);
        
        // Título
        this.ctx.fillStyle = colors[0];
        this.ctx.font = `bold ${width * 0.04}px ${this.fonts.title}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(content.mainTitle, width / 2, height * 0.15);
        
        // Contenido básico
        this.ctx.fillStyle = '#374151';
        this.ctx.font = `${width * 0.025}px ${this.fonts.body}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Infografía generada con AI Study Genius', width / 2, height / 2);
    }
}

// Inicializar el generador de infografías
const infographicsGenerator = new InfographicsGenerator();

// Exportar para uso global
window.infographicsGenerator = infographicsGenerator;