// ================================================
// 📚 BIBLIOTECA PERSONAL - AI STUDY GENIUS
// 👨‍💻 Desarrollado por: Vicentegg4212  
// 📱 Sistema de gestión de conocimiento personal
// ================================================

class PersonalLibrary {
    constructor() {
        this.library = JSON.parse(localStorage.getItem('personalLibrary') || '{}');
        this.subjects = ['Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 'Literatura', 'Inglés', 'Filosofía', 'Programación', 'Otros'];
        this.init();
    }
    
    init() {
        this.ensureLibraryStructure();
        this.bindEvents();
    }
    
    ensureLibraryStructure() {
        if (!this.library.subjects) {
            this.library.subjects = {};
            this.subjects.forEach(subject => {
                this.library.subjects[subject] = {
                    topics: {},
                    totalQuestions: 0,
                    lastAccessed: null,
                    studyTime: 0
                };
            });
        }
        if (!this.library.metadata) {
            this.library.metadata = {
                totalTopics: 0,
                createdAt: new Date().toISOString(),
                lastUpdate: new Date().toISOString(),
                version: '1.0'
            };
        }
        this.saveLibrary();
    }
    
    bindEvents() {
        // Agregar evento de escape para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    // ============== GESTIÓN DE TEMAS ==============
    
    addTopic(question, answer, images = []) {
        const subject = this.detectSubject(question + ' ' + answer);
        const topicId = this.generateTopicId();
        const topic = {
            id: topicId,
            question: question,
            answer: answer,
            images: images,
            subject: subject,
            createdAt: new Date().toISOString(),
            accessCount: 0,
            lastAccessed: new Date().toISOString(),
            tags: this.extractTags(question + ' ' + answer),
            difficulty: this.assessDifficulty(answer),
            studyTime: 0
        };
        
        this.library.subjects[subject].topics[topicId] = topic;
        this.library.subjects[subject].totalQuestions++;
        this.library.metadata.totalTopics++;
        this.library.metadata.lastUpdate = new Date().toISOString();
        
        this.saveLibrary();
        return topicId;
    }
    
    detectSubject(content) {
        const patterns = {
            'Matemáticas': /matemática|álgebra|cálculo|geometría|trigonometría|derivada|integral|ecuación|función|matriz/i,
            'Física': /física|fuerza|energía|velocidad|aceleración|newton|momento|onda|electricidad|magnetismo/i,
            'Química': /química|elemento|molécula|átomo|reacción|enlace|ácido|base|orgánica|inorgánica/i,
            'Biología': /biología|célula|organismo|genética|evolución|ecosistema|anatomía|fisiología|DNA|proteína/i,
            'Historia': /historia|histórico|siglo|guerra|revolución|civilización|época|periodo|antiguo|medieval/i,
            'Literatura': /literatura|novela|poesía|autor|obra|literario|narrativa|género|estilo|crítica/i,
            'Inglés': /english|grammar|vocabulary|tense|pronunciation|speaking|writing|reading|listening/i,
            'Filosofía': /filosofía|ética|moral|existencia|pensamiento|lógica|epistemología|metafísica|filósofo/i,
            'Programación': /programación|código|algoritmo|variable|función|clase|objeto|software|desarrollo|debugging/i
        };
        
        for (const [subject, pattern] of Object.entries(patterns)) {
            if (pattern.test(content)) {
                return subject;
            }
        }
        return 'Otros';
    }
    
    extractTags(content) {
        const commonTags = [
            'definición', 'fórmula', 'ejemplo', 'problema', 'teoría', 'práctica',
            'concepto', 'proceso', 'análisis', 'síntesis', 'comparación', 'aplicación'
        ];
        
        const foundTags = [];
        commonTags.forEach(tag => {
            if (content.toLowerCase().includes(tag)) {
                foundTags.push(tag);
            }
        });
        
        // Agregar tags específicos basados en patrones
        if (/paso\s+a\s+paso|procedimiento|método/i.test(content)) foundTags.push('procedimiento');
        if (/verificación|comprobación|demostración/i.test(content)) foundTags.push('verificación');
        if (/gráfico|diagrama|imagen/i.test(content)) foundTags.push('visual');
        
        return foundTags.length > 0 ? foundTags : ['general'];
    }
    
    assessDifficulty(content) {
        let difficulty = 'Básico';
        const advancedPatterns = /integral|derivada|matriz|complejo|avanzado|profundo|especializado/i;
        const intermediatePatterns = /análisis|síntesis|aplicación|comparación|evaluación/i;
        
        if (advancedPatterns.test(content)) {
            difficulty = 'Avanzado';
        } else if (intermediatePatterns.test(content)) {
            difficulty = 'Intermedio';
        }
        
        return difficulty;
    }
    
    generateTopicId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // ============== BÚSQUEDA INTELIGENTE ==============
    
    searchTopics(query, filters = {}) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const [subject, data] of Object.entries(this.library.subjects)) {
            if (filters.subject && filters.subject !== subject) continue;
            
            for (const [topicId, topic] of Object.entries(data.topics)) {
                let score = 0;
                
                // Búsqueda en pregunta
                if (topic.question.toLowerCase().includes(queryLower)) score += 10;
                
                // Búsqueda en respuesta
                if (topic.answer.toLowerCase().includes(queryLower)) score += 5;
                
                // Búsqueda en tags
                topic.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(queryLower)) score += 3;
                });
                
                // Filtros adicionales
                if (filters.difficulty && topic.difficulty !== filters.difficulty) continue;
                if (filters.tags && !filters.tags.some(tag => topic.tags.includes(tag))) continue;
                
                if (score > 0) {
                    results.push({ ...topic, score });
                }
            }
        }
        
        return results.sort((a, b) => b.score - a.score);
    }
    
    // ============== EXPORTACIÓN PDF ==============
    
    async exportToPDF(topics, title = 'Mi Biblioteca de Estudio') {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            throw new Error('jsPDF no está disponible. Asegúrate de incluir la biblioteca.');
        }
        
        const doc = new jsPDF();
        let yPosition = 20;
        const pageHeight = 280;
        
        // Título
        doc.setFontSize(20);
        doc.text(title, 20, yPosition);
        yPosition += 15;
        
        // Información general
        doc.setFontSize(12);
        doc.text(`Generado: ${new Date().toLocaleDateString()}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Total de temas: ${topics.length}`, 20, yPosition);
        yPosition += 20;
        
        topics.forEach((topic, index) => {
            // Verificar si necesitamos nueva página
            if (yPosition > pageHeight) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Número de tema
            doc.setFontSize(16);
            doc.text(`${index + 1}. ${topic.subject}`, 20, yPosition);
            yPosition += 10;
            
            // Pregunta
            doc.setFontSize(12);
            doc.text('Pregunta:', 20, yPosition);
            yPosition += 7;
            const questionLines = doc.splitTextToSize(topic.question, 170);
            doc.text(questionLines, 25, yPosition);
            yPosition += questionLines.length * 5 + 5;
            
            // Respuesta (resumida)
            doc.text('Respuesta:', 20, yPosition);
            yPosition += 7;
            const answerPreview = topic.answer.substring(0, 300) + (topic.answer.length > 300 ? '...' : '');
            const answerLines = doc.splitTextToSize(answerPreview, 170);
            doc.text(answerLines, 25, yPosition);
            yPosition += answerLines.length * 5 + 10;
            
            // Tags y dificultad
            doc.setFontSize(10);
            doc.text(`Tags: ${topic.tags.join(', ')}`, 20, yPosition);
            yPosition += 5;
            doc.text(`Dificultad: ${topic.difficulty}`, 20, yPosition);
            yPosition += 15;
        });
        
        // Descargar PDF
        doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    }
    
    // ============== INTERFAZ UI ==============
    
    showLibrary() {
        const modal = this.createLibraryModal();
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.library-content').style.transform = 'scale(1)';
        }, 10);
    }
    
    createLibraryModal() {
        const modal = document.createElement('div');
        modal.className = 'library-modal';
        modal.innerHTML = `
            <div class="library-overlay" onclick="personalLibrary.closeLibrary()"></div>
            <div class="library-content">
                <div class="library-header">
                    <h2>📚 Mi Biblioteca Personal</h2>
                    <button class="close-btn" onclick="personalLibrary.closeLibrary()">✕</button>
                </div>
                
                <div class="library-stats">
                    <div class="stat-card">
                        <span class="stat-number">${this.library.metadata.totalTopics}</span>
                        <span class="stat-label">Temas Guardados</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${Object.keys(this.library.subjects).filter(s => this.library.subjects[s].totalQuestions > 0).length}</span>
                        <span class="stat-label">Materias Estudiadas</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${Math.round(Object.values(this.library.subjects).reduce((total, s) => total + s.studyTime, 0) / 60)}</span>
                        <span class="stat-label">Horas de Estudio</span>
                    </div>
                </div>
                
                <div class="library-search">
                    <input type="text" id="library-search-input" placeholder="🔍 Buscar en tu biblioteca..." />
                    <select id="library-subject-filter">
                        <option value="">Todas las materias</option>
                        ${this.subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                
                <div class="library-subjects">
                    ${this.renderSubjects()}
                </div>
                
                <div class="library-actions">
                    <button class="export-btn" onclick="personalLibrary.exportAllToPDF()">
                        📄 Exportar Todo a PDF
                    </button>
                    <button class="clear-btn" onclick="personalLibrary.clearLibrary()">
                        🗑️ Limpiar Biblioteca
                    </button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    renderSubjects() {
        return this.subjects.map(subject => {
            const subjectData = this.library.subjects[subject];
            const topicCount = subjectData.totalQuestions;
            
            if (topicCount === 0) return '';
            
            return `
                <div class="subject-card" data-subject="${subject}">
                    <div class="subject-header" onclick="personalLibrary.toggleSubject('${subject}')">
                        <h3>${this.getSubjectIcon(subject)} ${subject}</h3>
                        <span class="topic-count">${topicCount} temas</span>
                        <span class="expand-icon">▼</span>
                    </div>
                    <div class="subject-topics" id="topics-${subject}" style="display: none;">
                        ${this.renderTopics(subject)}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderTopics(subject) {
        const topics = Object.values(this.library.subjects[subject].topics);
        return topics.map(topic => `
            <div class="topic-item" onclick="personalLibrary.showTopic('${topic.id}')">
                <div class="topic-preview">
                    <strong>${topic.question.substring(0, 80)}${topic.question.length > 80 ? '...' : ''}</strong>
                    <p>${topic.answer.substring(0, 120)}${topic.answer.length > 120 ? '...' : ''}</p>
                </div>
                <div class="topic-meta">
                    <span class="difficulty ${topic.difficulty.toLowerCase()}">${topic.difficulty}</span>
                    <span class="access-count">${topic.accessCount} veces vista</span>
                </div>
            </div>
        `).join('');
    }
    
    getSubjectIcon(subject) {
        const icons = {
            'Matemáticas': '🧮',
            'Física': '⚛️',
            'Química': '🧪',
            'Biología': '🧬',
            'Historia': '📜',
            'Literatura': '📖',
            'Inglés': '🇺🇸',
            'Filosofía': '🤔',
            'Programación': '💻',
            'Otros': '📚'
        };
        return icons[subject] || '📚';
    }
    
    // ============== EVENTOS DE UI ==============
    
    toggleSubject(subject) {
        const topicsDiv = document.getElementById(`topics-${subject}`);
        const expandIcon = document.querySelector(`[data-subject="${subject}"] .expand-icon`);
        
        if (topicsDiv.style.display === 'none') {
            topicsDiv.style.display = 'block';
            expandIcon.textContent = '▲';
        } else {
            topicsDiv.style.display = 'none';
            expandIcon.textContent = '▼';
        }
    }
    
    showTopic(topicId) {
        const topic = this.findTopic(topicId);
        if (!topic) return;
        
        // Incrementar contador de acceso
        topic.accessCount++;
        topic.lastAccessed = new Date().toISOString();
        this.saveLibrary();
        
        const modal = this.createTopicModal(topic);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.topic-detail-content').style.transform = 'scale(1)';
        }, 10);
    }
    
    createTopicModal(topic) {
        const modal = document.createElement('div');
        modal.className = 'topic-detail-modal';
        modal.innerHTML = `
            <div class="topic-detail-overlay" onclick="personalLibrary.closeTopicDetail()"></div>
            <div class="topic-detail-content">
                <div class="topic-detail-header">
                    <h2>${this.getSubjectIcon(topic.subject)} ${topic.subject}</h2>
                    <button class="close-btn" onclick="personalLibrary.closeTopicDetail()">✕</button>
                </div>
                
                <div class="topic-detail-body">
                    <div class="topic-question">
                        <h3>📝 Pregunta:</h3>
                        <p>${topic.question}</p>
                    </div>
                    
                    <div class="topic-answer">
                        <h3>💡 Respuesta:</h3>
                        <div class="formatted-answer">${topic.answer}</div>
                    </div>
                    
                    ${topic.images.length > 0 ? `
                        <div class="topic-images">
                            <h3>🖼️ Imágenes:</h3>
                            ${topic.images.map(img => `<img src="${img}" alt="Imagen del tema" />`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="topic-metadata">
                        <div class="meta-item">
                            <strong>🏷️ Tags:</strong> ${topic.tags.join(', ')}
                        </div>
                        <div class="meta-item">
                            <strong>📊 Dificultad:</strong> <span class="difficulty ${topic.difficulty.toLowerCase()}">${topic.difficulty}</span>
                        </div>
                        <div class="meta-item">
                            <strong>📅 Creado:</strong> ${new Date(topic.createdAt).toLocaleDateString()}
                        </div>
                        <div class="meta-item">
                            <strong>👁️ Visto:</strong> ${topic.accessCount} veces
                        </div>
                    </div>
                </div>
                
                <div class="topic-detail-actions">
                    <button onclick="personalLibrary.exportTopicToPDF('${topic.id}')">📄 Exportar PDF</button>
                    <button onclick="personalLibrary.deleteTopic('${topic.id}')" class="delete-btn">🗑️ Eliminar</button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    // ============== UTILIDADES ==============
    
    findTopic(topicId) {
        for (const subject of Object.values(this.library.subjects)) {
            if (subject.topics[topicId]) {
                return subject.topics[topicId];
            }
        }
        return null;
    }
    
    deleteTopic(topicId) {
        if (confirm('¿Estás seguro de que quieres eliminar este tema?')) {
            const topic = this.findTopic(topicId);
            if (topic) {
                delete this.library.subjects[topic.subject].topics[topicId];
                this.library.subjects[topic.subject].totalQuestions--;
                this.library.metadata.totalTopics--;
                this.saveLibrary();
                this.closeTopicDetail();
                this.refreshLibrary();
            }
        }
    }
    
    async exportTopicToPDF(topicId) {
        const topic = this.findTopic(topicId);
        if (topic) {
            await this.exportToPDF([topic], `Tema: ${topic.question.substring(0, 50)}`);
        }
    }
    
    async exportAllToPDF() {
        const allTopics = [];
        for (const subject of Object.values(this.library.subjects)) {
            allTopics.push(...Object.values(subject.topics));
        }
        
        if (allTopics.length > 0) {
            await this.exportToPDF(allTopics, 'Mi Biblioteca Completa');
        } else {
            alert('No hay temas para exportar.');
        }
    }
    
    clearLibrary() {
        if (confirm('⚠️ ¿Estás seguro de que quieres limpiar toda tu biblioteca? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('personalLibrary');
            this.library = {};
            this.ensureLibraryStructure();
            this.closeLibrary();
            alert('✅ Biblioteca limpiada correctamente.');
        }
    }
    
    closeLibrary() {
        const modal = document.querySelector('.library-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    closeTopicDetail() {
        const modal = document.querySelector('.topic-detail-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    closeAllModals() {
        this.closeLibrary();
        this.closeTopicDetail();
    }
    
    refreshLibrary() {
        const libraryContent = document.querySelector('.library-subjects');
        if (libraryContent) {
            libraryContent.innerHTML = this.renderSubjects();
        }
    }
    
    saveLibrary() {
        localStorage.setItem('personalLibrary', JSON.stringify(this.library));
    }
    
    // ============== INTEGRACIÓN CON CHAT ==============
    
    saveFromChat(question, answer, images = []) {
        const topicId = this.addTopic(question, answer, images);
        this.showSaveNotification(topicId);
        return topicId;
    }
    
    showSaveNotification(topicId) {
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>📚 Tema guardado en tu biblioteca</span>
                <button onclick="personalLibrary.showTopic('${topicId}')">Ver</button>
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
        }, 5000);
    }
}

// Inicializar biblioteca global
let personalLibrary;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        personalLibrary = new PersonalLibrary();
    });
} else {
    personalLibrary = new PersonalLibrary();
}