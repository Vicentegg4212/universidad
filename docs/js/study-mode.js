/* ================================================
   📚 MODO ESTUDIO ESTRUCTURADO - AI STUDY GENIUS
   👨‍💻 Desarrollado por: Vicentegg4212  
   🎯 Sistema de estudio personalizado con técnicas avanzadas
   ================================================ */

class StudyMode {
    constructor() {
        this.isActive = false;
        this.currentSession = null;
        this.sessions = this.loadSessions();
        this.techniques = {
            pomodoro: { work: 25, break: 5, longBreak: 15 },
            flowtime: { minWork: 15, maxWork: 90, breakRatio: 0.2 },
            timeblocking: { blockSize: 30, bufferTime: 5 }
        };
        this.subjects = ['Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 'Literatura', 'Inglés', 'Filosofía', 'Geografía', 'Economía'];
        this.difficultyLevels = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];
        this.init();
    }

    init() {
        this.createFloatingButton();
        this.createModal();
        this.setupEventListeners();
    }

    createFloatingButton() {
        const btn = document.createElement('button');
        btn.className = 'study-floating-btn';
        btn.innerHTML = '📚';
        btn.title = 'Modo Estudio Estructurado';
        btn.onclick = () => this.openModal();
        document.body.appendChild(btn);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'study-modal';
        modal.innerHTML = `
            <div class="study-overlay" onclick="studyMode.closeModal()"></div>
            <div class="study-content">
                <div class="study-header">
                    <h3>📚 Modo Estudio Estructurado</h3>
                    <div class="study-header-actions">
                        <button class="study-stats-btn" onclick="studyMode.showStats()" title="Estadísticas">📊</button>
                        <button class="study-close-btn" onclick="studyMode.closeModal()">✕</button>
                    </div>
                </div>
                
                <div class="study-body">
                    <div class="study-tabs">
                        <button class="study-tab active" onclick="studyMode.switchTab('new')">Nueva Sesión</button>
                        <button class="study-tab" onclick="studyMode.switchTab('active')">Sesión Activa</button>
                        <button class="study-tab" onclick="studyMode.switchTab('history')">Historial</button>
                    </div>
                    
                    <!-- Nueva Sesión -->
                    <div class="study-tab-content" id="study-new-tab">
                        <form class="study-form" onsubmit="studyMode.startSession(event)">
                            <div class="study-field">
                                <label>📖 Materia</label>
                                <select name="subject" required>
                                    <option value="">Seleccionar materia</option>
                                    ${this.subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="study-field">
                                <label>🎯 Tema de Estudio</label>
                                <input type="text" name="topic" placeholder="Ej: Ecuaciones cuadráticas" required>
                            </div>
                            
                            <div class="study-field">
                                <label>📊 Nivel de Dificultad</label>
                                <select name="difficulty" required>
                                    <option value="">Seleccionar nivel</option>
                                    ${this.difficultyLevels.map(d => `<option value="${d}">${d}</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="study-field">
                                <label>⏱️ Técnica de Estudio</label>
                                <select name="technique" required onchange="studyMode.updateTechniqueInfo(this.value)">
                                    <option value="">Seleccionar técnica</option>
                                    <option value="pomodoro">Pomodoro (25min trabajo + 5min descanso)</option>
                                    <option value="flowtime">Flowtime (Adaptativo según concentración)</option>
                                    <option value="timeblocking">Time Blocking (Bloques de tiempo fijos)</option>
                                </select>
                            </div>
                            
                            <div class="study-field" id="study-technique-info"></div>
                            
                            <div class="study-field">
                                <label>🎯 Objetivos de la Sesión</label>
                                <textarea name="goals" placeholder="Ej: Resolver 10 ejercicios, entender conceptos básicos..." rows="3"></textarea>
                            </div>
                            
                            <div class="study-field">
                                <label>⏰ Duración Estimada (minutos)</label>
                                <input type="number" name="duration" min="15" max="240" value="60" required>
                            </div>
                            
                            <button type="submit" class="study-start-btn">🚀 Iniciar Sesión de Estudio</button>
                        </form>
                    </div>
                    
                    <!-- Sesión Activa -->
                    <div class="study-tab-content hidden" id="study-active-tab">
                        <div class="study-active-session">
                            <div class="study-session-info">
                                <h4 id="study-current-topic">No hay sesión activa</h4>
                                <p id="study-current-details"></p>
                            </div>
                            
                            <div class="study-timer-display">
                                <div class="study-timer-circle">
                                    <div class="study-timer-text">
                                        <span id="study-timer">00:00</span>
                                        <span id="study-phase">Preparación</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="study-controls">
                                <button class="study-control-btn" id="study-pause-btn" onclick="studyMode.pauseSession()">⏸️ Pausar</button>
                                <button class="study-control-btn" id="study-break-btn" onclick="studyMode.takeBreak()">☕ Descanso</button>
                                <button class="study-control-btn danger" onclick="studyMode.endSession()">🛑 Finalizar</button>
                            </div>
                            
                            <div class="study-progress">
                                <h5>📈 Progreso de la Sesión</h5>
                                <div class="study-progress-bar">
                                    <div class="study-progress-fill" id="study-progress-fill"></div>
                                </div>
                                <div class="study-session-stats">
                                    <span>Tiempo transcurrido: <span id="study-elapsed">0min</span></span>
                                    <span>Descansos tomados: <span id="study-breaks">0</span></span>
                                </div>
                            </div>
                            
                            <div class="study-notes">
                                <h5>📝 Notas de la Sesión</h5>
                                <textarea id="study-session-notes" placeholder="Escribe aquí tus apuntes, dudas o reflexiones..."></textarea>
                                <button onclick="studyMode.saveNotes()" class="study-save-notes-btn">💾 Guardar Notas</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Historial -->
                    <div class="study-tab-content hidden" id="study-history-tab">
                        <div class="study-history">
                            <div class="study-history-filters">
                                <select id="study-filter-subject" onchange="studyMode.filterHistory()">
                                    <option value="">Todas las materias</option>
                                    ${this.subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                                </select>
                                <select id="study-filter-period" onchange="studyMode.filterHistory()">
                                    <option value="7">Última semana</option>
                                    <option value="30">Último mes</option>
                                    <option value="90">Últimos 3 meses</option>
                                    <option value="all">Todo el tiempo</option>
                                </select>
                            </div>
                            
                            <div class="study-history-list" id="study-history-list">
                                <!-- Las sesiones se cargarán dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Configurar timer si hay sesión activa
        if (this.currentSession) {
            this.resumeSession();
        }
    }

    openModal() {
        const modal = document.querySelector('.study-modal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.study-content').style.transform = 'translateY(0)';
        }, 10);
        
        this.updateActiveTab();
        this.loadHistory();
    }

    closeModal() {
        const modal = document.querySelector('.study-modal');
        modal.style.opacity = '0';
        modal.querySelector('.study-content').style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    switchTab(tabName) {
        // Actualizar botones de tabs
        document.querySelectorAll('.study-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.study-tab[onclick="studyMode.switchTab('${tabName}')"]`).classList.add('active');
        
        // Mostrar contenido correspondiente
        document.querySelectorAll('.study-tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`study-${tabName}-tab`).classList.remove('hidden');
        
        if (tabName === 'active') {
            this.updateActiveTab();
        } else if (tabName === 'history') {
            this.loadHistory();
        }
    }

    updateTechniqueInfo(technique) {
        const infoDiv = document.getElementById('study-technique-info');
        if (!technique) {
            infoDiv.innerHTML = '';
            return;
        }
        
        const info = this.techniques[technique];
        let content = '';
        
        switch (technique) {
            case 'pomodoro':
                content = `
                    <div class="study-technique-details">
                        <h6>🍅 Técnica Pomodoro</h6>
                        <p>• ${info.work} minutos de trabajo concentrado</p>
                        <p>• ${info.break} minutos de descanso corto</p>
                        <p>• ${info.longBreak} minutos de descanso largo cada 4 ciclos</p>
                    </div>
                `;
                break;
            case 'flowtime':
                content = `
                    <div class="study-technique-details">
                        <h6>🌊 Técnica Flowtime</h6>
                        <p>• Mínimo ${info.minWork} minutos de trabajo</p>
                        <p>• Máximo ${info.maxWork} minutos de trabajo</p>
                        <p>• Descanso proporcional (${info.breakRatio * 100}% del tiempo trabajado)</p>
                    </div>
                `;
                break;
            case 'timeblocking':
                content = `
                    <div class="study-technique-details">
                        <h6>📅 Time Blocking</h6>
                        <p>• Bloques de ${info.blockSize} minutos</p>
                        <p>• ${info.bufferTime} minutos de buffer entre bloques</p>
                        <p>• Estructura rígida y planificada</p>
                    </div>
                `;
                break;
        }
        
        infoDiv.innerHTML = content;
    }

    async startSession(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const sessionData = {
            id: Date.now(),
            subject: formData.get('subject'),
            topic: formData.get('topic'),
            difficulty: formData.get('difficulty'),
            technique: formData.get('technique'),
            goals: formData.get('goals'),
            duration: parseInt(formData.get('duration')),
            startTime: Date.now(),
            status: 'active',
            phase: 'work',
            elapsed: 0,
            breaks: 0,
            notes: ''
        };
        
        this.currentSession = sessionData;
        this.sessions.push(sessionData);
        this.saveSessions();
        
        // Cambiar a la tab de sesión activa
        this.switchTab('active');
        this.updateActiveTab();
        this.startTimer();
        
        // Mostrar notificación
        this.showNotification('🚀 Sesión de estudio iniciada', 'success');
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        const technique = this.techniques[this.currentSession.technique];
        let timeRemaining = this.getPhaseTime();
        
        this.timerInterval = setInterval(() => {
            if (this.currentSession.status !== 'active') return;
            
            timeRemaining--;
            this.currentSession.elapsed++;
            
            this.updateTimerDisplay(timeRemaining);
            this.updateProgress();
            
            if (timeRemaining <= 0) {
                this.completePhase();
            }
        }, 1000);
    }

    getPhaseTime() {
        const technique = this.techniques[this.currentSession.technique];
        
        switch (this.currentSession.technique) {
            case 'pomodoro':
                return this.currentSession.phase === 'work' ? technique.work * 60 : technique.break * 60;
            case 'flowtime':
                return this.currentSession.phase === 'work' ? technique.maxWork * 60 : Math.floor(this.currentSession.elapsed * technique.breakRatio);
            case 'timeblocking':
                return technique.blockSize * 60;
            default:
                return 25 * 60;
        }
    }

    completePhase() {
        if (this.currentSession.phase === 'work') {
            this.currentSession.phase = 'break';
            this.currentSession.breaks++;
            this.showNotification('☕ Tiempo de descanso', 'info');
        } else {
            this.currentSession.phase = 'work';
            this.showNotification('🚀 Volvamos al trabajo', 'success');
        }
        
        this.updateActiveTab();
        this.startTimer();
    }

    updateTimerDisplay(timeRemaining) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('study-timer').textContent = timerText;
        document.getElementById('study-phase').textContent = this.currentSession.phase === 'work' ? 'Estudiando' : 'Descansando';
    }

    updateProgress() {
        const progressPercent = (this.currentSession.elapsed / (this.currentSession.duration * 60)) * 100;
        document.getElementById('study-progress-fill').style.width = `${Math.min(progressPercent, 100)}%`;
        document.getElementById('study-elapsed').textContent = `${Math.floor(this.currentSession.elapsed / 60)}min`;
        document.getElementById('study-breaks').textContent = this.currentSession.breaks;
    }

    updateActiveTab() {
        if (!this.currentSession) {
            document.getElementById('study-current-topic').textContent = 'No hay sesión activa';
            document.getElementById('study-current-details').textContent = '';
            return;
        }
        
        document.getElementById('study-current-topic').textContent = this.currentSession.topic;
        document.getElementById('study-current-details').textContent = 
            `${this.currentSession.subject} • ${this.currentSession.difficulty} • ${this.currentSession.technique}`;
        
        this.updateProgress();
    }

    pauseSession() {
        if (this.currentSession.status === 'active') {
            this.currentSession.status = 'paused';
            clearInterval(this.timerInterval);
            document.getElementById('study-pause-btn').innerHTML = '▶️ Reanudar';
            this.showNotification('⏸️ Sesión pausada', 'warning');
        } else {
            this.currentSession.status = 'active';
            this.startTimer();
            document.getElementById('study-pause-btn').innerHTML = '⏸️ Pausar';
            this.showNotification('▶️ Sesión reanudada', 'success');
        }
    }

    takeBreak() {
        this.currentSession.phase = 'break';
        this.currentSession.breaks++;
        this.showNotification('☕ Descanso iniciado', 'info');
        this.updateActiveTab();
        this.startTimer();
    }

    endSession() {
        if (!confirm('¿Estás seguro de que quieres finalizar la sesión?')) return;
        
        this.currentSession.status = 'completed';
        this.currentSession.endTime = Date.now();
        this.currentSession.totalTime = this.currentSession.elapsed;
        
        clearInterval(this.timerInterval);
        this.saveSessions();
        
        this.showSessionSummary();
        this.currentSession = null;
        this.updateActiveTab();
    }

    showSessionSummary() {
        const session = this.currentSession;
        const totalMinutes = Math.floor(session.elapsed / 60);
        
        const summary = `
            📊 Resumen de la Sesión:
            
            📖 Materia: ${session.subject}
            🎯 Tema: ${session.topic}
            ⏰ Tiempo total: ${totalMinutes} minutos
            ☕ Descansos tomados: ${session.breaks}
            📈 Progreso: ${((session.elapsed / (session.duration * 60)) * 100).toFixed(1)}%
        `;
        
        this.showNotification(summary, 'success', 5000);
    }

    saveNotes() {
        if (!this.currentSession) return;
        
        const notes = document.getElementById('study-session-notes').value;
        this.currentSession.notes = notes;
        this.saveSessions();
        this.showNotification('📝 Notas guardadas', 'success');
    }

    loadHistory() {
        const historyList = document.getElementById('study-history-list');
        if (!historyList) return;
        
        const completedSessions = this.sessions.filter(s => s.status === 'completed');
        
        if (completedSessions.length === 0) {
            historyList.innerHTML = `
                <div class="study-no-history">
                    <p>📚 No hay sesiones completadas aún</p>
                    <p>¡Comienza tu primera sesión de estudio!</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = completedSessions
            .sort((a, b) => b.startTime - a.startTime)
            .map(session => this.createHistoryItem(session))
            .join('');
    }

    createHistoryItem(session) {
        const date = new Date(session.startTime).toLocaleDateString();
        const totalMinutes = Math.floor(session.totalTime / 60);
        const efficiency = ((session.totalTime / (session.duration * 60)) * 100).toFixed(1);
        
        return `
            <div class="study-history-item">
                <div class="study-history-header">
                    <h5>${session.topic}</h5>
                    <span class="study-history-date">${date}</span>
                </div>
                <div class="study-history-details">
                    <span class="study-subject">${session.subject}</span>
                    <span class="study-difficulty">${session.difficulty}</span>
                    <span class="study-time">${totalMinutes}min</span>
                    <span class="study-efficiency">${efficiency}%</span>
                </div>
                ${session.notes ? `<div class="study-history-notes">${session.notes}</div>` : ''}
            </div>
        `;
    }

    showStats() {
        const statsData = this.calculateStats();
        
        const modal = document.createElement('div');
        modal.className = 'study-stats-modal';
        modal.innerHTML = `
            <div class="study-overlay" onclick="this.parentElement.remove()"></div>
            <div class="study-stats-content">
                <div class="study-stats-header">
                    <h3>📊 Estadísticas de Estudio</h3>
                    <button onclick="this.closest('.study-stats-modal').remove()">✕</button>
                </div>
                <div class="study-stats-body">
                    <div class="study-stats-grid">
                        <div class="study-stat-card">
                            <div class="study-stat-number">${statsData.totalSessions}</div>
                            <div class="study-stat-label">Sesiones Completadas</div>
                        </div>
                        <div class="study-stat-card">
                            <div class="study-stat-number">${statsData.totalHours}h</div>
                            <div class="study-stat-label">Tiempo Total</div>
                        </div>
                        <div class="study-stat-card">
                            <div class="study-stat-number">${statsData.avgEfficiency}%</div>
                            <div class="study-stat-label">Eficiencia Promedio</div>
                        </div>
                        <div class="study-stat-card">
                            <div class="study-stat-number">${statsData.streak}</div>
                            <div class="study-stat-label">Racha Actual</div>
                        </div>
                    </div>
                    
                    <div class="study-stats-charts">
                        <h4>📈 Por Materia</h4>
                        <div class="study-subject-stats">
                            ${Object.entries(statsData.bySubject).map(([subject, data]) => `
                                <div class="study-subject-stat">
                                    <span>${subject}</span>
                                    <div class="study-subject-bar">
                                        <div class="study-subject-fill" style="width: ${data.percentage}%"></div>
                                    </div>
                                    <span>${data.hours}h</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.style.opacity = '1', 10);
    }

    calculateStats() {
        const completedSessions = this.sessions.filter(s => s.status === 'completed');
        
        const totalTime = completedSessions.reduce((sum, s) => sum + s.totalTime, 0);
        const totalHours = Math.floor(totalTime / 3600);
        const avgEfficiency = completedSessions.length > 0 
            ? (completedSessions.reduce((sum, s) => sum + (s.totalTime / (s.duration * 60)) * 100, 0) / completedSessions.length).toFixed(1)
            : 0;
        
        // Estadísticas por materia
        const bySubject = {};
        completedSessions.forEach(session => {
            if (!bySubject[session.subject]) {
                bySubject[session.subject] = { time: 0, sessions: 0 };
            }
            bySubject[session.subject].time += session.totalTime;
            bySubject[session.subject].sessions++;
        });
        
        // Convertir a formato de porcentajes
        const maxTime = Math.max(...Object.values(bySubject).map(s => s.time));
        Object.keys(bySubject).forEach(subject => {
            bySubject[subject].hours = Math.floor(bySubject[subject].time / 3600);
            bySubject[subject].percentage = maxTime > 0 ? (bySubject[subject].time / maxTime) * 100 : 0;
        });
        
        return {
            totalSessions: completedSessions.length,
            totalHours,
            avgEfficiency,
            streak: this.calculateStreak(),
            bySubject
        };
    }

    calculateStreak() {
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);
        
        while (streak < 365) { // Máximo 365 días
            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            const hasSession = this.sessions.some(s => 
                s.status === 'completed' && 
                s.startTime >= dayStart.getTime() && 
                s.startTime <= dayEnd.getTime()
            );
            
            if (hasSession) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `study-notification ${type}`;
        notification.innerHTML = `
            <div class="study-notification-content">
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

    loadSessions() {
        try {
            const saved = localStorage.getItem('study_sessions');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading study sessions:', error);
            return [];
        }
    }

    saveSessions() {
        try {
            localStorage.setItem('study_sessions', JSON.stringify(this.sessions));
        } catch (error) {
            console.error('Error saving study sessions:', error);
        }
    }

    // Métodos de integración con el chat
    getStudyContext() {
        if (!this.currentSession) return null;
        
        return {
            subject: this.currentSession.subject,
            topic: this.currentSession.topic,
            difficulty: this.currentSession.difficulty,
            phase: this.currentSession.phase,
            elapsed: Math.floor(this.currentSession.elapsed / 60),
            goals: this.currentSession.goals
        };
    }

    addTopicToCurrentSession(topic) {
        if (this.currentSession && this.currentSession.status === 'active') {
            const currentNotes = this.currentSession.notes || '';
            this.currentSession.notes = currentNotes + `\n\n📝 ${new Date().toLocaleTimeString()}: ${topic}`;
            this.saveSessions();
            
            // Actualizar interfaz si está abierta
            const notesTextarea = document.getElementById('study-session-notes');
            if (notesTextarea) {
                notesTextarea.value = this.currentSession.notes;
            }
        }
    }
}

// Inicializar el modo estudio
const studyMode = new StudyMode();

// Exportar para uso global
window.studyMode = studyMode;