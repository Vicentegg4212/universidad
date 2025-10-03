/* ================================================
   🃏 SISTEMA DE FLASHCARDS AUTOMÁTICO - AI STUDY GENIUS
   👨‍💻 Desarrollado por: Vicentegg4212  
   🧠 Sistema inteligente de flashcards con spaced repetition
   ================================================ */

class FlashcardSystem {
    constructor() {
        this.flashcards = this.loadFlashcards();
        this.currentDeck = null;
        this.currentCard = null;
        this.currentIndex = 0;
        this.sessionStats = {
            correct: 0,
            incorrect: 0,
            total: 0,
            startTime: null
        };
        
        // Algoritmo de repetición espaciada (Anki-style)
        this.spacedRepetition = {
            intervals: [1, 6, 1440, 8640], // minutos: 1min, 6min, 1día, 6días
            easeFactor: 2.5,
            minEase: 1.3,
            maxEase: 4.0
        };
        
        this.subjects = ['Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 'Literatura', 'Inglés', 'Filosofía', 'Geografía', 'Economía'];
        this.cardTypes = {
            basic: { name: 'Básica', icon: '📝', description: 'Pregunta y respuesta simple' },
            multiple: { name: 'Opción Múltiple', icon: '🔢', description: 'Pregunta con varias opciones' },
            definition: { name: 'Definición', icon: '📖', description: 'Término y definición' },
            image: { name: 'Visual', icon: '🖼️', description: 'Pregunta con imagen' },
            fill: { name: 'Completar', icon: '✏️', description: 'Completar espacios en blanco' }
        };
        
        this.init();
    }

    init() {
        this.createFloatingButton();
        this.createModal();
        this.setupEventListeners();
        this.scheduleNotifications();
    }

    createFloatingButton() {
        const btn = document.createElement('button');
        btn.className = 'flashcards-floating-btn';
        btn.innerHTML = '🃏';
        btn.title = 'Sistema de Flashcards';
        btn.onclick = () => this.openModal();
        document.body.appendChild(btn);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'flashcards-modal';
        modal.innerHTML = `
            <div class="flashcards-overlay" onclick="flashcardSystem.closeModal()"></div>
            <div class="flashcards-content">
                <div class="flashcards-header">
                    <h3>🃏 Sistema de Flashcards</h3>
                    <div class="flashcards-header-actions">
                        <button class="flashcards-stats-btn" onclick="flashcardSystem.showStats()" title="Estadísticas">📊</button>
                        <button class="flashcards-close-btn" onclick="flashcardSystem.closeModal()">✕</button>
                    </div>
                </div>
                
                <div class="flashcards-body">
                    <div class="flashcards-tabs">
                        <button class="flashcards-tab active" onclick="flashcardSystem.switchTab('decks')">Mazos</button>
                        <button class="flashcards-tab" onclick="flashcardSystem.switchTab('create')">Crear</button>
                        <button class="flashcards-tab" onclick="flashcardSystem.switchTab('study')">Estudiar</button>
                        <button class="flashcards-tab" onclick="flashcardSystem.switchTab('review')">Repasar</button>
                    </div>
                    
                    <!-- Mazos -->
                    <div class="flashcards-tab-content" id="flashcards-decks-tab">
                        <div class="flashcards-decks-header">
                            <h4>📚 Mis Mazos de Flashcards</h4>
                            <button onclick="flashcardSystem.createFromChat()" class="flashcards-auto-btn">🤖 Crear desde Chat</button>
                        </div>
                        
                        <div class="flashcards-filters">
                            <select id="flashcards-filter-subject" onchange="flashcardSystem.filterDecks()">
                                <option value="">Todas las materias</option>
                                ${this.subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                            <select id="flashcards-filter-status" onchange="flashcardSystem.filterDecks()">
                                <option value="">Todos los estados</option>
                                <option value="new">Nuevos</option>
                                <option value="learning">Aprendiendo</option>
                                <option value="review">Para repasar</option>
                                <option value="mastered">Dominados</option>
                            </select>
                        </div>
                        
                        <div class="flashcards-decks-grid" id="flashcards-decks-list">
                            <!-- Los mazos se cargarán dinámicamente -->
                        </div>
                    </div>
                    
                    <!-- Crear Flashcard -->
                    <div class="flashcards-tab-content hidden" id="flashcards-create-tab">
                        <form class="flashcards-form" onsubmit="flashcardSystem.createFlashcard(event)">
                            <div class="flashcards-field">
                                <label>📖 Materia</label>
                                <select name="subject" required>
                                    <option value="">Seleccionar materia</option>
                                    ${this.subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="flashcards-field">
                                <label>📚 Mazo</label>
                                <input type="text" name="deckName" placeholder="Nombre del mazo (ej: Ecuaciones Cuadráticas)" required>
                            </div>
                            
                            <div class="flashcards-field">
                                <label>🃏 Tipo de Tarjeta</label>
                                <div class="flashcards-type-grid">
                                    ${Object.entries(this.cardTypes).map(([key, type]) => `
                                        <label class="flashcards-type-option">
                                            <input type="radio" name="cardType" value="${key}" required>
                                            <div class="flashcards-type-card">
                                                <div class="flashcards-type-icon">${type.icon}</div>
                                                <div class="flashcards-type-name">${type.name}</div>
                                                <div class="flashcards-type-desc">${type.description}</div>
                                            </div>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="flashcards-field">
                                <label>❓ Pregunta/Frente</label>
                                <textarea name="front" placeholder="Escribe la pregunta o el frente de la tarjeta..." rows="3" required></textarea>
                            </div>
                            
                            <div class="flashcards-field">
                                <label>✅ Respuesta/Dorso</label>
                                <textarea name="back" placeholder="Escribe la respuesta o el dorso de la tarjeta..." rows="3" required></textarea>
                            </div>
                            
                            <div class="flashcards-field" id="flashcards-options-field" style="display: none;">
                                <label>🔢 Opciones (una por línea)</label>
                                <textarea name="options" placeholder="Opción A: ...\nOpción B: ...\nOpción C: ...\nOpción D: ..." rows="4"></textarea>
                            </div>
                            
                            <div class="flashcards-field">
                                <label>💡 Pista (opcional)</label>
                                <input type="text" name="hint" placeholder="Pista que ayude a recordar la respuesta">
                            </div>
                            
                            <div class="flashcards-field">
                                <label>🏷️ Etiquetas (separadas por comas)</label>
                                <input type="text" name="tags" placeholder="ej: matemáticas, álgebra, ecuaciones">
                            </div>
                            
                            <button type="submit" class="flashcards-create-btn">✨ Crear Flashcard</button>
                        </form>
                    </div>
                    
                    <!-- Estudiar -->
                    <div class="flashcards-tab-content hidden" id="flashcards-study-tab">
                        <div class="flashcards-study-container">
                            <div class="flashcards-study-header">
                                <div class="flashcards-study-info">
                                    <h4 id="flashcards-study-deck">Selecciona un mazo</h4>
                                    <p id="flashcards-study-progress">0/0 tarjetas</p>
                                </div>
                                <div class="flashcards-study-controls">
                                    <button onclick="flashcardSystem.pauseStudy()" class="flashcards-control-btn">⏸️</button>
                                    <button onclick="flashcardSystem.endStudy()" class="flashcards-control-btn danger">🛑</button>
                                </div>
                            </div>
                            
                            <div class="flashcards-card-container" id="flashcards-card-container">
                                <div class="flashcards-card" id="flashcards-current-card" onclick="flashcardSystem.flipCard()">
                                    <div class="flashcards-card-inner">
                                        <div class="flashcards-card-front">
                                            <div class="flashcards-card-content" id="flashcards-card-front-content">
                                                Selecciona un mazo para comenzar
                                            </div>
                                            <div class="flashcards-card-hint" id="flashcards-card-hint"></div>
                                        </div>
                                        <div class="flashcards-card-back">
                                            <div class="flashcards-card-content" id="flashcards-card-back-content">
                                                Respuesta aparecerá aquí
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flashcards-response-buttons" id="flashcards-response-buttons" style="display: none;">
                                <button onclick="flashcardSystem.rateCard(1)" class="flashcards-response-btn difficulty-1">😞 Difícil</button>
                                <button onclick="flashcardSystem.rateCard(2)" class="flashcards-response-btn difficulty-2">😐 Bien</button>
                                <button onclick="flashcardSystem.rateCard(3)" class="flashcards-response-btn difficulty-3">😊 Fácil</button>
                                <button onclick="flashcardSystem.rateCard(4)" class="flashcards-response-btn difficulty-4">🎯 Perfecto</button>
                            </div>
                            
                            <div class="flashcards-study-stats">
                                <div class="flashcards-stat">
                                    <span class="flashcards-stat-label">Correctas</span>
                                    <span class="flashcards-stat-value" id="flashcards-correct">0</span>
                                </div>
                                <div class="flashcards-stat">
                                    <span class="flashcards-stat-label">Incorrectas</span>
                                    <span class="flashcards-stat-value" id="flashcards-incorrect">0</span>
                                </div>
                                <div class="flashcards-stat">
                                    <span class="flashcards-stat-label">Precisión</span>
                                    <span class="flashcards-stat-value" id="flashcards-accuracy">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Repasar -->
                    <div class="flashcards-tab-content hidden" id="flashcards-review-tab">
                        <div class="flashcards-review-container">
                            <h4>📅 Repaso Programado</h4>
                            <p>Tarjetas que necesitan repaso según el algoritmo de repetición espaciada</p>
                            
                            <div class="flashcards-review-schedule">
                                <div class="flashcards-review-section">
                                    <h5>🔥 Urgente (Vencidas)</h5>
                                    <div class="flashcards-review-cards" id="flashcards-overdue"></div>
                                </div>
                                
                                <div class="flashcards-review-section">
                                    <h5>📅 Hoy</h5>
                                    <div class="flashcards-review-cards" id="flashcards-today"></div>
                                </div>
                                
                                <div class="flashcards-review-section">
                                    <h5>📆 Próximos días</h5>
                                    <div class="flashcards-review-cards" id="flashcards-upcoming"></div>
                                </div>
                            </div>
                            
                            <button onclick="flashcardSystem.startReview()" class="flashcards-start-review-btn">🚀 Comenzar Repaso</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Event listener para cambio de tipo de tarjeta
        document.addEventListener('change', (e) => {
            if (e.target.name === 'cardType') {
                this.updateCardTypeFields(e.target.value);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.currentDeck && document.querySelector('.flashcards-modal').style.display !== 'none') {
                switch (e.key) {
                    case ' ':
                        e.preventDefault();
                        this.flipCard();
                        break;
                    case '1':
                        if (e.ctrlKey) this.rateCard(1);
                        break;
                    case '2':
                        if (e.ctrlKey) this.rateCard(2);
                        break;
                    case '3':
                        if (e.ctrlKey) this.rateCard(3);
                        break;
                    case '4':
                        if (e.ctrlKey) this.rateCard(4);
                        break;
                }
            }
        });
    }

    openModal() {
        const modal = document.querySelector('.flashcards-modal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.flashcards-content').style.transform = 'translateY(0)';
        }, 10);
        
        this.loadDecks();
        this.updateReviewSchedule();
    }

    closeModal() {
        const modal = document.querySelector('.flashcards-modal');
        modal.style.opacity = '0';
        modal.querySelector('.flashcards-content').style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    switchTab(tabName) {
        // Actualizar botones de tabs
        document.querySelectorAll('.flashcards-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.flashcards-tab[onclick="flashcardSystem.switchTab('${tabName}')"]`).classList.add('active');
        
        // Mostrar contenido correspondiente
        document.querySelectorAll('.flashcards-tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`flashcards-${tabName}-tab`).classList.remove('hidden');
        
        if (tabName === 'decks') {
            this.loadDecks();
        } else if (tabName === 'review') {
            this.updateReviewSchedule();
        }
    }

    updateCardTypeFields(cardType) {
        const optionsField = document.getElementById('flashcards-options-field');
        if (cardType === 'multiple') {
            optionsField.style.display = 'block';
        } else {
            optionsField.style.display = 'none';
        }
    }

    async createFlashcard(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const flashcard = {
            id: Date.now(),
            subject: formData.get('subject'),
            deckName: formData.get('deckName'),
            cardType: formData.get('cardType'),
            front: formData.get('front'),
            back: formData.get('back'),
            options: formData.get('options')?.split('\n').filter(o => o.trim()) || [],
            hint: formData.get('hint') || '',
            tags: formData.get('tags')?.split(',').map(t => t.trim()).filter(t => t) || [],
            createdAt: Date.now(),
            lastReviewed: null,
            nextReview: Date.now(),
            interval: 0,
            easeFactor: this.spacedRepetition.easeFactor,
            repetitions: 0,
            status: 'new' // new, learning, review, mastered
        };
        
        this.flashcards.push(flashcard);
        this.saveFlashcards();
        
        // Limpiar formulario
        event.target.reset();
        
        this.showNotification('✅ Flashcard creada exitosamente', 'success');
        this.loadDecks();
    }

    async createFromChat() {
        // Obtener el último mensaje del chat para crear flashcards automáticamente
        const chatMessages = document.querySelectorAll('.message.assistant');
        if (chatMessages.length === 0) {
            this.showNotification('❌ No hay mensajes del chat para procesar', 'error');
            return;
        }
        
        const lastMessage = chatMessages[chatMessages.length - 1].textContent;
        
        try {
            this.showLoading('Analizando contenido y creando flashcards...');
            
            // Simular análisis de IA para extraer información
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const flashcardsData = this.extractFlashcardsFromText(lastMessage);
            
            if (flashcardsData.length === 0) {
                this.hideLoading();
                this.showNotification('❌ No se pudo extraer información para flashcards', 'error');
                return;
            }
            
            // Crear flashcards automáticamente
            flashcardsData.forEach(data => {
                const flashcard = {
                    id: Date.now() + Math.random(),
                    subject: data.subject,
                    deckName: data.deckName,
                    cardType: 'basic',
                    front: data.front,
                    back: data.back,
                    options: [],
                    hint: data.hint || '',
                    tags: data.tags || [],
                    createdAt: Date.now(),
                    lastReviewed: null,
                    nextReview: Date.now(),
                    interval: 0,
                    easeFactor: this.spacedRepetition.easeFactor,
                    repetitions: 0,
                    status: 'new'
                };
                
                this.flashcards.push(flashcard);
            });
            
            this.saveFlashcards();
            this.hideLoading();
            
            this.showNotification(`✅ ${flashcardsData.length} flashcards creadas automáticamente`, 'success');
            this.loadDecks();
            
        } catch (error) {
            this.hideLoading();
            this.showNotification('❌ Error al crear flashcards automáticamente', 'error');
        }
    }

    extractFlashcardsFromText(text) {
        const flashcards = [];
        
        // Detectar definiciones
        const definitionPattern = /(.+?):\s*(.+?)(?=\n|$)/g;
        let match;
        
        while ((match = definitionPattern.exec(text)) !== null) {
            const term = match[1].trim();
            const definition = match[2].trim();
            
            if (term.length > 3 && definition.length > 10) {
                flashcards.push({
                    subject: this.detectSubject(text),
                    deckName: 'Definiciones - ' + new Date().toLocaleDateString(),
                    front: `¿Qué es ${term}?`,
                    back: definition,
                    hint: term,
                    tags: ['definicion', 'auto-generado']
                });
            }
        }
        
        // Detectar fórmulas matemáticas
        const formulaPattern = /([A-Za-z]+)\s*=\s*([^.]+)/g;
        while ((match = formulaPattern.exec(text)) !== null) {
            flashcards.push({
                subject: 'Matemáticas',
                deckName: 'Fórmulas - ' + new Date().toLocaleDateString(),
                front: `¿Cuál es la fórmula de ${match[1]}?`,
                back: match[0],
                tags: ['formula', 'matemáticas', 'auto-generado']
            });
        }
        
        // Detectar fechas históricas
        const datePattern = /(\d{4})\s*[:-]\s*(.+?)(?=\n|\.)/g;
        while ((match = datePattern.exec(text)) !== null) {
            flashcards.push({
                subject: 'Historia',
                deckName: 'Fechas Históricas - ' + new Date().toLocaleDateString(),
                front: `¿Qué ocurrió en ${match[1]}?`,
                back: match[2].trim(),
                tags: ['historia', 'fecha', 'auto-generado']
            });
        }
        
        return flashcards;
    }

    detectSubject(text) {
        const keywords = {
            'Matemáticas': ['ecuación', 'fórmula', 'teorema', 'función', 'derivada', 'integral'],
            'Física': ['fuerza', 'energía', 'masa', 'velocidad', 'aceleración', 'newton'],
            'Química': ['elemento', 'átomo', 'molécula', 'reacción', 'valencia', 'ph'],
            'Biología': ['célula', 'organismo', 'gen', 'especie', 'evolución', 'adn'],
            'Historia': ['año', 'siglo', 'guerra', 'rey', 'imperio', 'revolución'],
            'Literatura': ['autor', 'obra', 'poema', 'novela', 'verso', 'estrofa']
        };
        
        const textLower = text.toLowerCase();
        let maxMatches = 0;
        let detectedSubject = 'General';
        
        Object.entries(keywords).forEach(([subject, words]) => {
            const matches = words.filter(word => textLower.includes(word)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedSubject = subject;
            }
        });
        
        return detectedSubject;
    }

    loadDecks() {
        const decksList = document.getElementById('flashcards-decks-list');
        if (!decksList) return;
        
        // Agrupar flashcards por mazo
        const decks = {};
        this.flashcards.forEach(card => {
            const key = `${card.subject} - ${card.deckName}`;
            if (!decks[key]) {
                decks[key] = {
                    name: card.deckName,
                    subject: card.subject,
                    cards: [],
                    newCards: 0,
                    learningCards: 0,
                    reviewCards: 0,
                    masteredCards: 0
                };
            }
            decks[key].cards.push(card);
            decks[key][card.status + 'Cards']++;
        });
        
        if (Object.keys(decks).length === 0) {
            decksList.innerHTML = `
                <div class="flashcards-no-decks">
                    <p>🃏 No tienes mazos de flashcards aún</p>
                    <p>¡Crea tu primer mazo o genera uno automáticamente desde el chat!</p>
                </div>
            `;
            return;
        }
        
        decksList.innerHTML = Object.entries(decks)
            .map(([key, deck]) => this.createDeckCard(deck))
            .join('');
    }

    createDeckCard(deck) {
        const totalCards = deck.cards.length;
        const dueCards = deck.cards.filter(card => card.nextReview <= Date.now()).length;
        
        return `
            <div class="flashcards-deck-card" onclick="flashcardSystem.selectDeck('${deck.subject}', '${deck.name}')">
                <div class="flashcards-deck-header">
                    <h5>${deck.name}</h5>
                    <span class="flashcards-deck-subject">${deck.subject}</span>
                </div>
                <div class="flashcards-deck-stats">
                    <div class="flashcards-deck-stat">
                        <span class="flashcards-deck-stat-label">Total</span>
                        <span class="flashcards-deck-stat-value">${totalCards}</span>
                    </div>
                    <div class="flashcards-deck-stat">
                        <span class="flashcards-deck-stat-label">Nuevas</span>
                        <span class="flashcards-deck-stat-value new">${deck.newCards}</span>
                    </div>
                    <div class="flashcards-deck-stat">
                        <span class="flashcards-deck-stat-label">Repasar</span>
                        <span class="flashcards-deck-stat-value due">${dueCards}</span>
                    </div>
                </div>
                <div class="flashcards-deck-progress">
                    <div class="flashcards-deck-progress-bar">
                        <div class="flashcards-deck-progress-fill" style="width: ${(deck.masteredCards / totalCards) * 100}%"></div>
                    </div>
                    <span class="flashcards-deck-progress-text">${Math.round((deck.masteredCards / totalCards) * 100)}% dominado</span>
                </div>
            </div>
        `;
    }

    selectDeck(subject, deckName) {
        const deckCards = this.flashcards.filter(card => 
            card.subject === subject && card.deckName === deckName
        );
        
        this.currentDeck = {
            subject,
            name: deckName,
            cards: deckCards
        };
        
        this.switchTab('study');
        this.startStudySession();
    }

    startStudySession() {
        if (!this.currentDeck) return;
        
        // Filtrar tarjetas que necesitan estudio
        const cardsToStudy = this.currentDeck.cards.filter(card => 
            card.nextReview <= Date.now() || card.status === 'new'
        );
        
        if (cardsToStudy.length === 0) {
            this.showNotification('🎉 ¡No hay tarjetas para estudiar en este mazo!', 'success');
            return;
        }
        
        this.currentDeck.studyCards = this.shuffleArray([...cardsToStudy]);
        this.currentIndex = 0;
        this.sessionStats = {
            correct: 0,
            incorrect: 0,
            total: cardsToStudy.length,
            startTime: Date.now()
        };
        
        document.getElementById('flashcards-study-deck').textContent = this.currentDeck.name;
        this.showNextCard();
    }

    showNextCard() {
        if (!this.currentDeck || this.currentIndex >= this.currentDeck.studyCards.length) {
            this.endStudySession();
            return;
        }
        
        this.currentCard = this.currentDeck.studyCards[this.currentIndex];
        
        // Actualizar interfaz
        document.getElementById('flashcards-study-progress').textContent = 
            `${this.currentIndex + 1}/${this.currentDeck.studyCards.length} tarjetas`;
        
        document.getElementById('flashcards-card-front-content').textContent = this.currentCard.front;
        document.getElementById('flashcards-card-back-content').textContent = this.currentCard.back;
        document.getElementById('flashcards-card-hint').textContent = this.currentCard.hint || '';
        
        // Resetear tarjeta
        document.getElementById('flashcards-current-card').classList.remove('flipped');
        document.getElementById('flashcards-response-buttons').style.display = 'none';
        
        this.updateStudyStats();
    }

    flipCard() {
        if (!this.currentCard) return;
        
        const card = document.getElementById('flashcards-current-card');
        card.classList.add('flipped');
        
        setTimeout(() => {
            document.getElementById('flashcards-response-buttons').style.display = 'flex';
        }, 300);
    }

    rateCard(difficulty) {
        if (!this.currentCard) return;
        
        // Actualizar estadísticas
        if (difficulty >= 3) {
            this.sessionStats.correct++;
        } else {
            this.sessionStats.incorrect++;
        }
        
        // Aplicar algoritmo de repetición espaciada
        this.updateCardSchedule(this.currentCard, difficulty);
        
        // Guardar cambios
        this.saveFlashcards();
        
        // Siguiente tarjeta
        this.currentIndex++;
        this.showNextCard();
    }

    updateCardSchedule(card, difficulty) {
        const now = Date.now();
        card.lastReviewed = now;
        
        if (difficulty >= 3) {
            // Respuesta correcta
            if (card.repetitions === 0) {
                card.interval = 1;
            } else if (card.repetitions === 1) {
                card.interval = 6;
            } else {
                card.interval = Math.round(card.interval * card.easeFactor);
            }
            
            card.repetitions++;
            card.easeFactor += (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02));
            
            if (card.easeFactor < this.spacedRepetition.minEase) {
                card.easeFactor = this.spacedRepetition.minEase;
            }
            
            if (card.repetitions >= 3 && card.interval >= 1440) {
                card.status = 'mastered';
            } else {
                card.status = 'review';
            }
            
        } else {
            // Respuesta incorrecta
            card.repetitions = 0;
            card.interval = 1;
            card.status = 'learning';
        }
        
        card.nextReview = now + (card.interval * 60 * 1000);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    updateStudyStats() {
        document.getElementById('flashcards-correct').textContent = this.sessionStats.correct;
        document.getElementById('flashcards-incorrect').textContent = this.sessionStats.incorrect;
        
        const total = this.sessionStats.correct + this.sessionStats.incorrect;
        const accuracy = total > 0 ? Math.round((this.sessionStats.correct / total) * 100) : 0;
        document.getElementById('flashcards-accuracy').textContent = accuracy + '%';
    }

    endStudySession() {
        if (!this.sessionStats.startTime) return;
        
        const duration = Math.round((Date.now() - this.sessionStats.startTime) / 1000 / 60);
        const accuracy = Math.round((this.sessionStats.correct / this.sessionStats.total) * 100);
        
        this.showNotification(
            `🎉 Sesión completada!\n${this.sessionStats.total} tarjetas • ${accuracy}% precisión • ${duration}min`,
            'success',
            5000
        );
        
        this.currentDeck = null;
        this.currentCard = null;
        this.switchTab('decks');
    }

    updateReviewSchedule() {
        const now = Date.now();
        const overdueCards = this.flashcards.filter(card => card.nextReview < now - 86400000); // 1 día
        const todayCards = this.flashcards.filter(card => 
            card.nextReview >= now - 86400000 && card.nextReview <= now
        );
        const upcomingCards = this.flashcards.filter(card => 
            card.nextReview > now && card.nextReview <= now + 604800000 // 7 días
        );
        
        this.renderReviewCards('flashcards-overdue', overdueCards);
        this.renderReviewCards('flashcards-today', todayCards);
        this.renderReviewCards('flashcards-upcoming', upcomingCards);
    }

    renderReviewCards(containerId, cards) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (cards.length === 0) {
            container.innerHTML = '<p>No hay tarjetas en esta categoría</p>';
            return;
        }
        
        container.innerHTML = cards
            .slice(0, 5) // Mostrar solo las primeras 5
            .map(card => `
                <div class="flashcards-review-card">
                    <div class="flashcards-review-card-content">
                        <h6>${card.front}</h6>
                        <span class="flashcards-review-card-deck">${card.deckName}</span>
                    </div>
                    <div class="flashcards-review-card-date">
                        ${new Date(card.nextReview).toLocaleDateString()}
                    </div>
                </div>
            `).join('') + 
            (cards.length > 5 ? `<p class="flashcards-review-more">+${cards.length - 5} más</p>` : '');
    }

    startReview() {
        const overdueCards = this.flashcards.filter(card => card.nextReview <= Date.now());
        
        if (overdueCards.length === 0) {
            this.showNotification('🎉 ¡No hay tarjetas para repasar!', 'success');
            return;
        }
        
        // Crear mazo temporal para repaso
        this.currentDeck = {
            name: 'Repaso Programado',
            subject: 'Mixto',
            cards: overdueCards,
            studyCards: this.shuffleArray([...overdueCards])
        };
        
        this.switchTab('study');
        this.startStudySession();
    }

    scheduleNotifications() {
        // Programar notificaciones para recordar repasos
        setInterval(() => {
            const overdueCards = this.flashcards.filter(card => card.nextReview <= Date.now());
            
            if (overdueCards.length > 0) {
                this.showNotification(
                    `📚 Tienes ${overdueCards.length} flashcards para repasar`,
                    'info'
                );
            }
        }, 3600000); // Cada hora
    }

    showLoading(message = 'Cargando...') {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'flashcards-loading';
        loadingDiv.innerHTML = `
            <div class="flashcards-loading-content">
                <div class="flashcards-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loading = document.querySelector('.flashcards-loading');
        if (loading) {
            loading.remove();
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `flashcards-notification ${type}`;
        notification.innerHTML = `
            <div class="flashcards-notification-content">
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
        }, duration);
    }

    showStats() {
        // Implementar estadísticas detalladas
        this.showNotification('📊 Estadísticas detalladas próximamente', 'info');
    }

    loadFlashcards() {
        try {
            const saved = localStorage.getItem('flashcards_data');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading flashcards:', error);
            return [];
        }
    }

    saveFlashcards() {
        try {
            localStorage.setItem('flashcards_data', JSON.stringify(this.flashcards));
        } catch (error) {
            console.error('Error saving flashcards:', error);
        }
    }
}

// Inicializar el sistema de flashcards
const flashcardSystem = new FlashcardSystem();

// Exportar para uso global
window.flashcardSystem = flashcardSystem;