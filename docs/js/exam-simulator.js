/* ================================================
   📝 MODO EXAMEN SIMULADO - AI STUDY GENIUS
   👨‍💻 Desarrollado por: Vicentegg4212  
   🎯 Sistema de simulacros de examen con análisis avanzado
   ================================================ */

class ExamSimulator {
    constructor() {
        this.exams = this.loadExams();
        this.currentExam = null;
        this.currentQuestion = 0;
        this.answers = [];
        this.startTime = null;
        this.timerInterval = null;
        
        this.questionTypes = {
            multiple_choice: {
                name: 'Opción Múltiple',
                icon: '🔢',
                description: 'Selecciona la respuesta correcta'
            },
            true_false: {
                name: 'Verdadero/Falso',
                icon: '✅',
                description: 'Determina si la afirmación es correcta'
            },
            fill_blank: {
                name: 'Completar',
                icon: '✏️',
                description: 'Completa los espacios en blanco'
            },
            short_answer: {
                name: 'Respuesta Corta',
                icon: '📝',
                description: 'Responde en pocas palabras'
            },
            essay: {
                name: 'Ensayo',
                icon: '📖',
                description: 'Desarrolla tu respuesta'
            },
            matching: {
                name: 'Relacionar',
                icon: '🔗',
                description: 'Conecta elementos relacionados'
            }
        };
        
        this.subjects = ['Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 'Literatura', 'Inglés', 'Filosofía', 'Geografía', 'Economía'];
        this.difficulties = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];
        
        this.init();
    }

    init() {
        this.createFloatingButton();
        this.createModal();
        this.setupEventListeners();
    }

    createFloatingButton() {
        const btn = document.createElement('button');
        btn.className = 'exam-floating-btn';
        btn.innerHTML = '📝';
        btn.title = 'Modo Examen Simulado';
        btn.onclick = () => this.openModal();
        document.body.appendChild(btn);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'exam-modal';
        modal.innerHTML = `
            <div class="exam-overlay" onclick="examSimulator.closeModal()"></div>
            <div class="exam-content">
                <div class="exam-header">
                    <h3>📝 Modo Examen Simulado</h3>
                    <div class="exam-header-actions">
                        <button class="exam-history-btn" onclick="examSimulator.showHistory()" title="Historial">📊</button>
                        <button class="exam-close-btn" onclick="examSimulator.closeModal()">✕</button>
                    </div>
                </div>
                
                <div class="exam-body">
                    <div class="exam-tabs">
                        <button class="exam-tab active" onclick="examSimulator.switchTab('create')">Crear Examen</button>
                        <button class="exam-tab" onclick="examSimulator.switchTab('templates')">Plantillas</button>
                        <button class="exam-tab" onclick="examSimulator.switchTab('exam')">Examen Activo</button>
                        <button class="exam-tab" onclick="examSimulator.switchTab('results')">Resultados</button>
                    </div>
                    
                    <!-- Crear Examen -->
                    <div class="exam-tab-content" id="exam-create-tab">
                        <div class="exam-create-container">
                            <form class="exam-form" onsubmit="examSimulator.createExam(event)">
                                <div class="exam-field">
                                    <label>📖 Materia</label>
                                    <select name="subject" required>
                                        <option value="">Seleccionar materia</option>
                                        ${this.subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="exam-field">
                                    <label>📝 Nombre del Examen</label>
                                    <input type="text" name="examName" placeholder="Ej: Examen de Álgebra - Unidad 2" required>
                                </div>
                                
                                <div class="exam-field">
                                    <label>📊 Nivel de Dificultad</label>
                                    <select name="difficulty" required>
                                        <option value="">Seleccionar nivel</option>
                                        ${this.difficulties.map(d => `<option value="${d}">${d}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="exam-field">
                                    <label>⏱️ Duración (minutos)</label>
                                    <input type="number" name="duration" min="10" max="180" value="60" required>
                                </div>
                                
                                <div class="exam-field">
                                    <label>🔢 Número de Preguntas</label>
                                    <input type="number" name="questionCount" min="5" max="50" value="20" required>
                                </div>
                                
                                <div class="exam-field">
                                    <label>🎯 Tipos de Preguntas</label>
                                    <div class="exam-question-types">
                                        ${Object.entries(this.questionTypes).map(([key, type]) => `
                                            <label class="exam-type-checkbox">
                                                <input type="checkbox" name="questionTypes" value="${key}">
                                                <div class="exam-type-card">
                                                    <span class="exam-type-icon">${type.icon}</span>
                                                    <span class="exam-type-name">${type.name}</span>
                                                </div>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="exam-field">
                                    <label>📚 Contenido Base (opcional)</label>
                                    <textarea name="content" placeholder="Proporciona el contenido o temas específicos para las preguntas..." rows="4"></textarea>
                                    <small>O deja vacío para generar preguntas automáticamente basadas en la materia</small>
                                </div>
                                
                                <div class="exam-creation-options">
                                    <div class="exam-option">
                                        <label class="exam-checkbox">
                                            <input type="checkbox" name="shuffleQuestions" checked>
                                            <span>🔀 Mezclar preguntas</span>
                                        </label>
                                    </div>
                                    
                                    <div class="exam-option">
                                        <label class="exam-checkbox">
                                            <input type="checkbox" name="showTimer" checked>
                                            <span>⏰ Mostrar cronómetro</span>
                                        </label>
                                    </div>
                                    
                                    <div class="exam-option">
                                        <label class="exam-checkbox">
                                            <input type="checkbox" name="allowReview">
                                            <span>👁️ Permitir revisar respuestas</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <button type="submit" class="exam-create-btn">🚀 Generar Examen</button>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Plantillas de Examen -->
                    <div class="exam-tab-content hidden" id="exam-templates-tab">
                        <div class="exam-templates">
                            <h4>📋 Plantillas Predefinidas</h4>
                            <div class="exam-templates-grid">
                                <div class="exam-template-card" onclick="examSimulator.useTemplate('quick_math')">
                                    <div class="exam-template-icon">🔢</div>
                                    <h5>Matemáticas Rápidas</h5>
                                    <p>15 preguntas • 30 minutos</p>
                                    <p>Álgebra, geometría y cálculo básico</p>
                                </div>
                                
                                <div class="exam-template-card" onclick="examSimulator.useTemplate('science_quiz')">
                                    <div class="exam-template-icon">🧪</div>
                                    <h5>Quiz de Ciencias</h5>
                                    <p>20 preguntas • 45 minutos</p>
                                    <p>Física, química y biología general</p>
                                </div>
                                
                                <div class="exam-template-card" onclick="examSimulator.useTemplate('history_comprehensive')">
                                    <div class="exam-template-icon">🏛️</div>
                                    <h5>Historia Integral</h5>
                                    <p>25 preguntas • 60 minutos</p>
                                    <p>Historia mundial y local</p>
                                </div>
                                
                                <div class="exam-template-card" onclick="examSimulator.useTemplate('language_test')">
                                    <div class="exam-template-icon">🗣️</div>
                                    <h5>Examen de Idioma</h5>
                                    <p>30 preguntas • 50 minutos</p>
                                    <p>Gramática, vocabulario y comprensión</p>
                                </div>
                                
                                <div class="exam-template-card" onclick="examSimulator.useTemplate('mixed_review')">
                                    <div class="exam-template-icon">🎯</div>
                                    <h5>Repaso Mixto</h5>
                                    <p>40 preguntas • 90 minutos</p>
                                    <p>Todas las materias combinadas</p>
                                </div>
                                
                                <div class="exam-template-card" onclick="examSimulator.useTemplate('practice_exam')">
                                    <div class="exam-template-icon">📝</div>
                                    <h5>Examen de Práctica</h5>
                                    <p>50 preguntas • 120 minutos</p>
                                    <p>Simulacro completo estilo oficial</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Examen Activo -->
                    <div class="exam-tab-content hidden" id="exam-exam-tab">
                        <div class="exam-interface">
                            <div class="exam-progress-header">
                                <div class="exam-progress-info">
                                    <h4 id="exam-title">No hay examen activo</h4>
                                    <div class="exam-progress-bar">
                                        <div class="exam-progress-fill" id="exam-progress-fill"></div>
                                    </div>
                                    <span id="exam-progress-text">0/0</span>
                                </div>
                                
                                <div class="exam-timer-display" id="exam-timer-display">
                                    <div class="exam-timer" id="exam-timer">00:00</div>
                                    <div class="exam-timer-label">Tiempo restante</div>
                                </div>
                            </div>
                            
                            <div class="exam-question-container" id="exam-question-container">
                                <div class="exam-no-active">
                                    <p>📝 No hay examen activo</p>
                                    <p>Crea un nuevo examen o usa una plantilla para comenzar</p>
                                </div>
                            </div>
                            
                            <div class="exam-navigation" id="exam-navigation" style="display: none;">
                                <button onclick="examSimulator.previousQuestion()" class="exam-nav-btn" id="exam-prev-btn">⬅️ Anterior</button>
                                
                                <div class="exam-question-numbers" id="exam-question-numbers">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                                
                                <button onclick="examSimulator.nextQuestion()" class="exam-nav-btn" id="exam-next-btn">Siguiente ➡️</button>
                                
                                <button onclick="examSimulator.finishExam()" class="exam-finish-btn" id="exam-finish-btn" style="display: none;">✅ Finalizar Examen</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Resultados -->
                    <div class="exam-tab-content hidden" id="exam-results-tab">
                        <div class="exam-results">
                            <div class="exam-results-header">
                                <h4>📊 Resultados del Examen</h4>
                                <div class="exam-results-actions">
                                    <button onclick="examSimulator.exportResults()" class="exam-export-btn">📄 Exportar</button>
                                    <button onclick="examSimulator.reviewExam()" class="exam-review-btn">🔍 Revisar</button>
                                </div>
                            </div>
                            
                            <div class="exam-results-summary" id="exam-results-summary">
                                <!-- Se llenará dinámicamente -->
                            </div>
                            
                            <div class="exam-results-analysis" id="exam-results-analysis">
                                <!-- Se llenará dinámicamente -->
                            </div>
                            
                            <div class="exam-results-recommendations" id="exam-results-recommendations">
                                <!-- Se llenarán dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Atajos de teclado durante el examen
        document.addEventListener('keydown', (e) => {
            if (this.currentExam && document.querySelector('.exam-modal').style.display !== 'none') {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousQuestion();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextQuestion();
                        break;
                    case 'Enter':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            this.finishExam();
                        }
                        break;
                }
            }
        });
    }

    openModal() {
        const modal = document.querySelector('.exam-modal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.exam-content').style.transform = 'translateY(0)';
        }, 10);
    }

    closeModal() {
        if (this.currentExam && !confirm('¿Estás seguro de que quieres salir del examen? Se perderá el progreso.')) {
            return;
        }
        
        const modal = document.querySelector('.exam-modal');
        modal.style.opacity = '0';
        modal.querySelector('.exam-content').style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        if (this.currentExam) {
            this.endExam();
        }
    }

    switchTab(tabName) {
        // Actualizar botones de tabs
        document.querySelectorAll('.exam-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.exam-tab[onclick="examSimulator.switchTab('${tabName}')"]`).classList.add('active');
        
        // Mostrar contenido correspondiente
        document.querySelectorAll('.exam-tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`exam-${tabName}-tab`).classList.remove('hidden');
    }

    async createExam(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const questionTypes = Array.from(formData.getAll('questionTypes'));
        
        if (questionTypes.length === 0) {
            this.showNotification('❌ Selecciona al menos un tipo de pregunta', 'error');
            return;
        }
        
        const examConfig = {
            subject: formData.get('subject'),
            examName: formData.get('examName'),
            difficulty: formData.get('difficulty'),
            duration: parseInt(formData.get('duration')),
            questionCount: parseInt(formData.get('questionCount')),
            questionTypes: questionTypes,
            content: formData.get('content'),
            shuffleQuestions: formData.has('shuffleQuestions'),
            showTimer: formData.has('showTimer'),
            allowReview: formData.has('allowReview')
        };
        
        this.showLoading('Generando examen con IA...');
        
        try {
            const exam = await this.generateExamQuestions(examConfig);
            this.currentExam = exam;
            this.startExam();
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            this.showNotification('❌ Error al generar el examen', 'error');
        }
    }

    async generateExamQuestions(config) {
        // Simular generación de preguntas con IA
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const questions = [];
        
        for (let i = 0; i < config.questionCount; i++) {
            const questionType = config.questionTypes[Math.floor(Math.random() * config.questionTypes.length)];
            const question = this.generateQuestionByType(questionType, config);
            questions.push(question);
        }
        
        if (config.shuffleQuestions) {
            this.shuffleArray(questions);
        }
        
        return {
            id: Date.now(),
            ...config,
            questions: questions,
            createdAt: Date.now(),
            status: 'active'
        };
    }

    generateQuestionByType(type, config) {
        const questionBank = this.getQuestionBank(config.subject, config.difficulty);
        const baseQuestion = questionBank[Math.floor(Math.random() * questionBank.length)];
        
        const question = {
            id: Date.now() + Math.random(),
            type: type,
            subject: config.subject,
            difficulty: config.difficulty,
            question: baseQuestion.question,
            points: this.getPointsByDifficulty(config.difficulty),
            answered: false,
            userAnswer: null,
            timeSpent: 0
        };
        
        switch (type) {
            case 'multiple_choice':
                question.options = baseQuestion.options || this.generateOptions(baseQuestion);
                question.correctAnswer = baseQuestion.correctAnswer || 0;
                break;
                
            case 'true_false':
                question.options = ['Verdadero', 'Falso'];
                question.correctAnswer = baseQuestion.correctAnswer || 0;
                break;
                
            case 'fill_blank':
                question.blanks = baseQuestion.blanks || this.extractBlanks(baseQuestion.question);
                question.correctAnswers = baseQuestion.correctAnswers || [];
                break;
                
            case 'short_answer':
                question.maxLength = 100;
                question.correctAnswer = baseQuestion.correctAnswer || 'Respuesta ejemplo';
                break;
                
            case 'essay':
                question.maxLength = 500;
                question.rubric = baseQuestion.rubric || this.generateRubric();
                break;
                
            case 'matching':
                question.leftItems = baseQuestion.leftItems || [];
                question.rightItems = baseQuestion.rightItems || [];
                question.correctMatches = baseQuestion.correctMatches || {};
                break;
        }
        
        return question;
    }

    getQuestionBank(subject, difficulty) {
        // Base de preguntas simulada
        const questionBanks = {
            'Matemáticas': {
                'Básico': [
                    { question: '¿Cuál es el resultado de 15 + 27?', options: ['42', '41', '43', '40'], correctAnswer: 0 },
                    { question: '¿Cuántos lados tiene un triángulo?', options: ['2', '3', '4', '5'], correctAnswer: 1 },
                    { question: 'Si x = 5, ¿cuál es el valor de 2x + 3?', options: ['13', '12', '11', '10'], correctAnswer: 0 }
                ],
                'Intermedio': [
                    { question: 'Resuelve: x² - 5x + 6 = 0', options: ['x = 2, 3', 'x = 1, 6', 'x = -2, -3', 'x = 0, 5'], correctAnswer: 0 },
                    { question: '¿Cuál es la derivada de x³?', options: ['3x²', '2x³', 'x²', '3x'], correctAnswer: 0 }
                ]
            },
            'Física': {
                'Básico': [
                    { question: '¿Cuál es la unidad de fuerza en el SI?', options: ['Newton', 'Joule', 'Pascal', 'Watt'], correctAnswer: 0 },
                    { question: '¿Qué es la velocidad?', options: ['Distancia/tiempo', 'Fuerza/masa', 'Trabajo/tiempo', 'Masa × aceleración'], correctAnswer: 0 }
                ]
            }
        };
        
        return questionBanks[subject]?.[difficulty] || [
            { question: `Pregunta de ${subject} nivel ${difficulty}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 0 }
        ];
    }

    getPointsByDifficulty(difficulty) {
        const points = {
            'Básico': 1,
            'Intermedio': 2,
            'Avanzado': 3,
            'Experto': 4
        };
        return points[difficulty] || 1;
    }

    generateOptions(baseQuestion) {
        return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
    }

    extractBlanks(question) {
        // Detectar espacios en blanco en formato [____]
        const blanks = question.match(/\[____\]/g) || [];
        return blanks.length;
    }

    generateRubric() {
        return {
            criteria: ['Comprensión del tema', 'Argumentación', 'Estructura', 'Gramática'],
            maxPoints: 4
        };
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    useTemplate(templateId) {
        const templates = {
            quick_math: {
                subject: 'Matemáticas',
                examName: 'Matemáticas Rápidas',
                difficulty: 'Básico',
                duration: 30,
                questionCount: 15,
                questionTypes: ['multiple_choice', 'short_answer']
            },
            science_quiz: {
                subject: 'Física',
                examName: 'Quiz de Ciencias',
                difficulty: 'Intermedio',
                duration: 45,
                questionCount: 20,
                questionTypes: ['multiple_choice', 'true_false']
            }
            // Más plantillas...
        };
        
        const template = templates[templateId];
        if (template) {
            this.showLoading('Preparando examen desde plantilla...');
            
            setTimeout(async () => {
                try {
                    const exam = await this.generateExamQuestions({
                        ...template,
                        shuffleQuestions: true,
                        showTimer: true,
                        allowReview: false
                    });
                    
                    this.currentExam = exam;
                    this.startExam();
                    this.hideLoading();
                    
                } catch (error) {
                    this.hideLoading();
                    this.showNotification('❌ Error al cargar la plantilla', 'error');
                }
            }, 1000);
        }
    }

    startExam() {
        this.currentQuestion = 0;
        this.answers = [];
        this.startTime = Date.now();
        
        // Cambiar a la tab del examen
        this.switchTab('exam');
        
        // Configurar interfaz del examen
        this.setupExamInterface();
        
        // Iniciar cronómetro si está habilitado
        if (this.currentExam.showTimer) {
            this.startTimer();
        }
        
        // Mostrar primera pregunta
        this.showQuestion(0);
        
        this.showNotification('🚀 Examen iniciado. ¡Buena suerte!', 'success');
    }

    setupExamInterface() {
        const exam = this.currentExam;
        
        // Configurar título y progreso
        document.getElementById('exam-title').textContent = exam.examName;
        
        // Configurar navegación
        document.getElementById('exam-navigation').style.display = 'flex';
        
        // Configurar números de preguntas
        const numbersContainer = document.getElementById('exam-question-numbers');
        numbersContainer.innerHTML = exam.questions.map((_, index) => `
            <button class="exam-question-number" onclick="examSimulator.goToQuestion(${index})" data-question="${index}">
                ${index + 1}
            </button>
        `).join('');
        
        // Configurar timer si está habilitado
        if (exam.showTimer) {
            document.getElementById('exam-timer-display').style.display = 'block';
        } else {
            document.getElementById('exam-timer-display').style.display = 'none';
        }
    }

    startTimer() {
        const duration = this.currentExam.duration * 60; // Convertir a segundos
        let timeLeft = duration;
        
        this.timerInterval = setInterval(() => {
            timeLeft--;
            
            if (timeLeft <= 0) {
                this.timeUp();
                return;
            }
            
            this.updateTimerDisplay(timeLeft);
            
            // Advertencia cuando queda poco tiempo
            if (timeLeft === 300) { // 5 minutos
                this.showNotification('⚠️ Quedan 5 minutos', 'warning');
            } else if (timeLeft === 60) { // 1 minuto
                this.showNotification('🚨 Queda 1 minuto', 'error');
            }
            
        }, 1000);
    }

    updateTimerDisplay(timeLeft) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('exam-timer').textContent = timeString;
        
        // Cambiar color cuando queda poco tiempo
        const timerElement = document.getElementById('exam-timer');
        if (timeLeft < 300) { // Menos de 5 minutos
            timerElement.style.color = '#ef4444';
        } else if (timeLeft < 600) { // Menos de 10 minutos
            timerElement.style.color = '#f59e0b';
        }
    }

    timeUp() {
        clearInterval(this.timerInterval);
        this.showNotification('⏰ Tiempo agotado. El examen se enviará automáticamente.', 'warning');
        
        setTimeout(() => {
            this.finishExam();
        }, 2000);
    }

    showQuestion(questionIndex) {
        const question = this.currentExam.questions[questionIndex];
        const container = document.getElementById('exam-question-container');
        
        // Actualizar progreso
        this.updateProgress();
        
        // Actualizar navegación
        this.updateNavigation();
        
        // Renderizar pregunta según su tipo
        container.innerHTML = this.renderQuestion(question, questionIndex);
        
        // Marcar pregunta actual en la navegación
        document.querySelectorAll('.exam-question-number').forEach(btn => btn.classList.remove('current'));
        document.querySelector(`[data-question="${questionIndex}"]`).classList.add('current');
    }

    renderQuestion(question, index) {
        let questionHTML = `
            <div class="exam-question">
                <div class="exam-question-header">
                    <h5>Pregunta ${index + 1} de ${this.currentExam.questions.length}</h5>
                    <span class="exam-question-points">${question.points} punto${question.points !== 1 ? 's' : ''}</span>
                    <span class="exam-question-type">${this.questionTypes[question.type].name}</span>
                </div>
                
                <div class="exam-question-text">
                    ${question.question}
                </div>
                
                <div class="exam-question-content">
        `;
        
        switch (question.type) {
            case 'multiple_choice':
                questionHTML += this.renderMultipleChoice(question, index);
                break;
            case 'true_false':
                questionHTML += this.renderTrueFalse(question, index);
                break;
            case 'fill_blank':
                questionHTML += this.renderFillBlank(question, index);
                break;
            case 'short_answer':
                questionHTML += this.renderShortAnswer(question, index);
                break;
            case 'essay':
                questionHTML += this.renderEssay(question, index);
                break;
            case 'matching':
                questionHTML += this.renderMatching(question, index);
                break;
        }
        
        questionHTML += `
                </div>
            </div>
        `;
        
        return questionHTML;
    }

    renderMultipleChoice(question, index) {
        return `
            <div class="exam-multiple-choice">
                ${question.options.map((option, optionIndex) => `
                    <label class="exam-option">
                        <input type="radio" name="question_${index}" value="${optionIndex}" 
                               ${this.answers[index] === optionIndex ? 'checked' : ''}
                               onchange="examSimulator.saveAnswer(${index}, ${optionIndex})">
                        <span class="exam-option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    renderTrueFalse(question, index) {
        return `
            <div class="exam-true-false">
                <label class="exam-option">
                    <input type="radio" name="question_${index}" value="0" 
                           ${this.answers[index] === 0 ? 'checked' : ''}
                           onchange="examSimulator.saveAnswer(${index}, 0)">
                    <span class="exam-option-text">✅ Verdadero</span>
                </label>
                <label class="exam-option">
                    <input type="radio" name="question_${index}" value="1" 
                           ${this.answers[index] === 1 ? 'checked' : ''}
                           onchange="examSimulator.saveAnswer(${index}, 1)">
                    <span class="exam-option-text">❌ Falso</span>
                </label>
            </div>
        `;
    }

    renderShortAnswer(question, index) {
        return `
            <div class="exam-short-answer">
                <textarea name="question_${index}" 
                          placeholder="Escribe tu respuesta aquí..." 
                          maxlength="${question.maxLength}"
                          onchange="examSimulator.saveAnswer(${index}, this.value)"
                          class="exam-textarea">${this.answers[index] || ''}</textarea>
                <div class="exam-char-count">
                    <span id="char-count-${index}">${(this.answers[index] || '').length}</span>/${question.maxLength} caracteres
                </div>
            </div>
        `;
    }

    renderEssay(question, index) {
        return `
            <div class="exam-essay">
                <textarea name="question_${index}" 
                          placeholder="Desarrolla tu respuesta completa aquí..." 
                          maxlength="${question.maxLength}"
                          onchange="examSimulator.saveAnswer(${index}, this.value)"
                          class="exam-textarea large">${this.answers[index] || ''}</textarea>
                <div class="exam-char-count">
                    <span id="char-count-${index}">${(this.answers[index] || '').length}</span>/${question.maxLength} caracteres
                </div>
                <div class="exam-essay-rubric">
                    <h6>Criterios de evaluación:</h6>
                    <ul>
                        ${question.rubric.criteria.map(criterion => `<li>${criterion}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    renderFillBlank(question, index) {
        return `
            <div class="exam-fill-blank">
                <p>Completa los espacios en blanco:</p>
                <div class="exam-blanks-container">
                    ${Array.from({length: question.blanks}, (_, i) => `
                        <input type="text" 
                               placeholder="Respuesta ${i + 1}"
                               value="${(this.answers[index] && this.answers[index][i]) || ''}"
                               onchange="examSimulator.saveFillBlankAnswer(${index}, ${i}, this.value)"
                               class="exam-blank-input">
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderMatching(question, index) {
        return `
            <div class="exam-matching">
                <p>Relaciona los elementos de la columna izquierda con los de la derecha:</p>
                <div class="exam-matching-container">
                    <div class="exam-matching-left">
                        ${question.leftItems.map((item, i) => `
                            <div class="exam-matching-item" data-left="${i}">
                                ${item}
                            </div>
                        `).join('')}
                    </div>
                    <div class="exam-matching-right">
                        ${question.rightItems.map((item, i) => `
                            <div class="exam-matching-item" data-right="${i}">
                                ${item}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    saveAnswer(questionIndex, answer) {
        this.answers[questionIndex] = answer;
        this.currentExam.questions[questionIndex].answered = true;
        this.currentExam.questions[questionIndex].userAnswer = answer;
        
        // Actualizar indicador visual
        const questionBtn = document.querySelector(`[data-question="${questionIndex}"]`);
        if (questionBtn) {
            questionBtn.classList.add('answered');
        }
        
        // Actualizar progreso
        this.updateProgress();
    }

    saveFillBlankAnswer(questionIndex, blankIndex, answer) {
        if (!this.answers[questionIndex]) {
            this.answers[questionIndex] = [];
        }
        this.answers[questionIndex][blankIndex] = answer;
        
        this.currentExam.questions[questionIndex].userAnswer = this.answers[questionIndex];
        this.currentExam.questions[questionIndex].answered = this.answers[questionIndex].some(a => a && a.trim());
        
        // Actualizar indicador visual
        const questionBtn = document.querySelector(`[data-question="${questionIndex}"]`);
        if (questionBtn && this.currentExam.questions[questionIndex].answered) {
            questionBtn.classList.add('answered');
        }
    }

    updateProgress() {
        const answeredQuestions = this.currentExam.questions.filter(q => q.answered).length;
        const totalQuestions = this.currentExam.questions.length;
        const progressPercent = (answeredQuestions / totalQuestions) * 100;
        
        document.getElementById('exam-progress-fill').style.width = `${progressPercent}%`;
        document.getElementById('exam-progress-text').textContent = `${answeredQuestions}/${totalQuestions}`;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('exam-prev-btn');
        const nextBtn = document.getElementById('exam-next-btn');
        const finishBtn = document.getElementById('exam-finish-btn');
        
        prevBtn.disabled = this.currentQuestion === 0;
        
        if (this.currentQuestion === this.currentExam.questions.length - 1) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            finishBtn.style.display = 'none';
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.currentExam.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        }
    }

    goToQuestion(questionIndex) {
        this.currentQuestion = questionIndex;
        this.showQuestion(questionIndex);
    }

    finishExam() {
        const answeredQuestions = this.currentExam.questions.filter(q => q.answered).length;
        const totalQuestions = this.currentExam.questions.length;
        
        if (answeredQuestions < totalQuestions) {
            const unanswered = totalQuestions - answeredQuestions;
            if (!confirm(`Tienes ${unanswered} pregunta${unanswered !== 1 ? 's' : ''} sin responder. ¿Quieres finalizar el examen?`)) {
                return;
            }
        }
        
        this.endExam();
        this.calculateResults();
        this.switchTab('results');
    }

    endExam() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.currentExam) {
            this.currentExam.endTime = Date.now();
            this.currentExam.duration = Math.floor((this.currentExam.endTime - this.startTime) / 1000 / 60);
            this.currentExam.status = 'completed';
            
            // Guardar examen completado
            this.exams.push(this.currentExam);
            this.saveExams();
        }
    }

    calculateResults() {
        if (!this.currentExam) return;
        
        let totalPoints = 0;
        let earnedPoints = 0;
        let correctAnswers = 0;
        const analysis = {
            byType: {},
            bySubject: {},
            timeAnalysis: {},
            strengths: [],
            weaknesses: []
        };
        
        this.currentExam.questions.forEach((question, index) => {
            totalPoints += question.points;
            
            const isCorrect = this.isAnswerCorrect(question, this.answers[index]);
            if (isCorrect) {
                earnedPoints += question.points;
                correctAnswers++;
            }
            
            // Análisis por tipo
            if (!analysis.byType[question.type]) {
                analysis.byType[question.type] = { total: 0, correct: 0 };
            }
            analysis.byType[question.type].total++;
            if (isCorrect) analysis.byType[question.type].correct++;
        });
        
        const score = Math.round((earnedPoints / totalPoints) * 100);
        const accuracy = Math.round((correctAnswers / this.currentExam.questions.length) * 100);
        
        this.currentExam.results = {
            score: score,
            accuracy: accuracy,
            totalPoints: totalPoints,
            earnedPoints: earnedPoints,
            correctAnswers: correctAnswers,
            totalQuestions: this.currentExam.questions.length,
            analysis: analysis,
            grade: this.calculateGrade(score),
            completionTime: this.currentExam.duration,
            recommendations: this.generateRecommendations(analysis, score)
        };
        
        this.displayResults();
    }

    isAnswerCorrect(question, userAnswer) {
        if (userAnswer === null || userAnswer === undefined) return false;
        
        switch (question.type) {
            case 'multiple_choice':
            case 'true_false':
                return userAnswer === question.correctAnswer;
                
            case 'short_answer':
                // Comparación básica (en implementación real sería más sofisticada)
                return userAnswer.toLowerCase().trim().includes(question.correctAnswer.toLowerCase().trim());
                
            case 'fill_blank':
                if (!Array.isArray(userAnswer)) return false;
                return question.correctAnswers.every((correct, index) => 
                    userAnswer[index] && userAnswer[index].toLowerCase().trim() === correct.toLowerCase().trim()
                );
                
            case 'essay':
                // Para ensayos, se necesitaría evaluación manual o IA más avanzada
                return true; // Placeholder
                
            case 'matching':
                // Verificar que las coincidencias sean correctas
                return Object.keys(question.correctMatches).every(left => 
                    userAnswer[left] === question.correctMatches[left]
                );
                
            default:
                return false;
        }
    }

    calculateGrade(score) {
        if (score >= 90) return { letter: 'A', description: 'Excelente' };
        if (score >= 80) return { letter: 'B', description: 'Bueno' };
        if (score >= 70) return { letter: 'C', description: 'Regular' };
        if (score >= 60) return { letter: 'D', description: 'Suficiente' };
        return { letter: 'F', description: 'Insuficiente' };
    }

    generateRecommendations(analysis, score) {
        const recommendations = [];
        
        if (score < 70) {
            recommendations.push({
                type: 'study_more',
                title: 'Reforzar Conocimientos',
                description: 'Dedica más tiempo al estudio de los temas evaluados',
                priority: 'high'
            });
        }
        
        // Analizar tipos de pregunta débiles
        Object.entries(analysis.byType).forEach(([type, stats]) => {
            const accuracy = (stats.correct / stats.total) * 100;
            if (accuracy < 60) {
                recommendations.push({
                    type: 'question_type',
                    title: `Mejorar en ${this.questionTypes[type].name}`,
                    description: `Practica más con preguntas de tipo ${this.questionTypes[type].name}`,
                    priority: 'medium'
                });
            }
        });
        
        if (score >= 80) {
            recommendations.push({
                type: 'challenge',
                title: 'Aumentar Dificultad',
                description: 'Considera intentar exámenes de mayor dificultad',
                priority: 'low'
            });
        }
        
        return recommendations;
    }

    displayResults() {
        const results = this.currentExam.results;
        
        // Resumen principal
        const summaryContainer = document.getElementById('exam-results-summary');
        summaryContainer.innerHTML = `
            <div class="exam-results-score-card">
                <div class="exam-score-display">
                    <div class="exam-score-value">${results.score}%</div>
                    <div class="exam-score-grade">${results.grade.letter}</div>
                    <div class="exam-score-description">${results.grade.description}</div>
                </div>
                
                <div class="exam-score-stats">
                    <div class="exam-stat">
                        <span class="exam-stat-label">Precisión</span>
                        <span class="exam-stat-value">${results.accuracy}%</span>
                    </div>
                    <div class="exam-stat">
                        <span class="exam-stat-label">Correctas</span>
                        <span class="exam-stat-value">${results.correctAnswers}/${results.totalQuestions}</span>
                    </div>
                    <div class="exam-stat">
                        <span class="exam-stat-label">Puntuación</span>
                        <span class="exam-stat-value">${results.earnedPoints}/${results.totalPoints}</span>
                    </div>
                    <div class="exam-stat">
                        <span class="exam-stat-label">Tiempo</span>
                        <span class="exam-stat-value">${results.completionTime}min</span>
                    </div>
                </div>
            </div>
        `;
        
        // Análisis detallado
        const analysisContainer = document.getElementById('exam-results-analysis');
        analysisContainer.innerHTML = `
            <div class="exam-analysis-section">
                <h5>📊 Análisis por Tipo de Pregunta</h5>
                <div class="exam-analysis-chart">
                    ${Object.entries(results.analysis.byType).map(([type, stats]) => {
                        const accuracy = Math.round((stats.correct / stats.total) * 100);
                        return `
                            <div class="exam-analysis-bar">
                                <span class="exam-analysis-label">${this.questionTypes[type].name}</span>
                                <div class="exam-analysis-progress">
                                    <div class="exam-analysis-fill" style="width: ${accuracy}%"></div>
                                </div>
                                <span class="exam-analysis-percent">${accuracy}%</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        // Recomendaciones
        const recommendationsContainer = document.getElementById('exam-results-recommendations');
        recommendationsContainer.innerHTML = `
            <div class="exam-recommendations-section">
                <h5>💡 Recomendaciones</h5>
                <div class="exam-recommendations-list">
                    ${results.recommendations.map(rec => `
                        <div class="exam-recommendation-card ${rec.priority}">
                            <h6>${rec.title}</h6>
                            <p>${rec.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.showNotification(`🎯 Examen completado: ${results.score}% (${results.grade.letter})`, 'success', 5000);
    }

    exportResults() {
        if (!this.currentExam || !this.currentExam.results) {
            this.showNotification('❌ No hay resultados para exportar', 'error');
            return;
        }
        
        this.showNotification('📄 Exportando resultados...', 'info');
        
        // Simular exportación
        setTimeout(() => {
            this.showNotification('✅ Resultados exportados exitosamente', 'success');
        }, 1500);
    }

    reviewExam() {
        if (!this.currentExam) {
            this.showNotification('❌ No hay examen para revisar', 'error');
            return;
        }
        
        this.showNotification('🔍 Función de revisión próximamente disponible', 'info');
    }

    showHistory() {
        this.showNotification('📊 Historial de exámenes próximamente disponible', 'info');
    }

    showLoading(message = 'Cargando...') {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'exam-loading';
        loadingDiv.innerHTML = `
            <div class="exam-loading-content">
                <div class="exam-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loading = document.querySelector('.exam-loading');
        if (loading) {
            loading.remove();
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `exam-notification ${type}`;
        notification.innerHTML = `
            <div class="exam-notification-content">
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

    loadExams() {
        try {
            const saved = localStorage.getItem('exam_simulator_data');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading exams:', error);
            return [];
        }
    }

    saveExams() {
        try {
            localStorage.setItem('exam_simulator_data', JSON.stringify(this.exams));
        } catch (error) {
            console.error('Error saving exams:', error);
        }
    }
}

// Inicializar el simulador de exámenes
const examSimulator = new ExamSimulator();

// Exportar para uso global
window.examSimulator = examSimulator;