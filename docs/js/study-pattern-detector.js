/* ================================================
   🔍 DETECTOR DE PATRONES DE ESTUDIO - AI STUDY GENIUS
   👨‍💻 Desarrollado por: Vicentegg4212  
   📊 Sistema IA para análisis de hábitos y optimización de estudio
   ================================================ */

class StudyPatternDetector {
    constructor() {
        this.studyData = this.loadStudyData();
        this.patterns = {
            timePatterns: [],
            subjectPatterns: [],
            performancePatterns: [],
            concentrationPatterns: [],
            difficultyPatterns: []
        };
        this.recommendations = [];
        this.analytics = {
            totalStudyTime: 0,
            averageSessionLength: 0,
            bestPerformanceTime: null,
            strongestSubject: null,
            weakestSubject: null,
            studyStreak: 0,
            focusScore: 0
        };
        
        this.init();
    }

    init() {
        this.createFloatingButton();
        this.createModal();
        this.setupEventListeners();
        this.startDataCollection();
        this.scheduleAnalysis();
    }

    createFloatingButton() {
        const btn = document.createElement('button');
        btn.className = 'patterns-floating-btn';
        btn.innerHTML = '🔍';
        btn.title = 'Detector de Patrones de Estudio';
        btn.onclick = () => this.openModal();
        document.body.appendChild(btn);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'patterns-modal';
        modal.innerHTML = `
            <div class="patterns-overlay" onclick="studyPatternDetector.closeModal()"></div>
            <div class="patterns-content">
                <div class="patterns-header">
                    <h3>🔍 Detector de Patrones de Estudio</h3>
                    <div class="patterns-header-actions">
                        <button class="patterns-refresh-btn" onclick="studyPatternDetector.analyzePatterns()" title="Actualizar Análisis">🔄</button>
                        <button class="patterns-close-btn" onclick="studyPatternDetector.closeModal()">✕</button>
                    </div>
                </div>
                
                <div class="patterns-body">
                    <div class="patterns-tabs">
                        <button class="patterns-tab active" onclick="studyPatternDetector.switchTab('overview')">Resumen</button>
                        <button class="patterns-tab" onclick="studyPatternDetector.switchTab('patterns')">Patrones</button>
                        <button class="patterns-tab" onclick="studyPatternDetector.switchTab('recommendations')">Recomendaciones</button>
                        <button class="patterns-tab" onclick="studyPatternDetector.switchTab('insights')">Insights</button>
                    </div>
                    
                    <!-- Resumen -->
                    <div class="patterns-tab-content" id="patterns-overview-tab">
                        <div class="patterns-overview">
                            <div class="patterns-metrics-grid">
                                <div class="patterns-metric-card">
                                    <div class="patterns-metric-icon">⏱️</div>
                                    <div class="patterns-metric-info">
                                        <div class="patterns-metric-value" id="patterns-total-time">0h</div>
                                        <div class="patterns-metric-label">Tiempo Total</div>
                                    </div>
                                </div>
                                
                                <div class="patterns-metric-card">
                                    <div class="patterns-metric-icon">📊</div>
                                    <div class="patterns-metric-info">
                                        <div class="patterns-metric-value" id="patterns-avg-session">0min</div>
                                        <div class="patterns-metric-label">Sesión Promedio</div>
                                    </div>
                                </div>
                                
                                <div class="patterns-metric-card">
                                    <div class="patterns-metric-icon">🎯</div>
                                    <div class="patterns-metric-info">
                                        <div class="patterns-metric-value" id="patterns-focus-score">0%</div>
                                        <div class="patterns-metric-label">Puntuación Foco</div>
                                    </div>
                                </div>
                                
                                <div class="patterns-metric-card">
                                    <div class="patterns-metric-icon">🔥</div>
                                    <div class="patterns-metric-info">
                                        <div class="patterns-metric-value" id="patterns-streak">0</div>
                                        <div class="patterns-metric-label">Racha Días</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="patterns-charts-section">
                                <div class="patterns-chart-container">
                                    <h4>📈 Productividad por Hora del Día</h4>
                                    <canvas id="patterns-time-chart" width="400" height="200"></canvas>
                                </div>
                                
                                <div class="patterns-chart-container">
                                    <h4>📚 Rendimiento por Materia</h4>
                                    <div id="patterns-subject-chart" class="patterns-subject-bars"></div>
                                </div>
                            </div>
                            
                            <div class="patterns-quick-insights">
                                <h4>💡 Insights Rápidos</h4>
                                <div id="patterns-quick-insights-list">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Patrones Detectados -->
                    <div class="patterns-tab-content hidden" id="patterns-patterns-tab">
                        <div class="patterns-detected">
                            <div class="patterns-section">
                                <h4>⏰ Patrones Temporales</h4>
                                <div id="patterns-time-patterns" class="patterns-list">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                            
                            <div class="patterns-section">
                                <h4>📖 Patrones por Materia</h4>
                                <div id="patterns-subject-patterns" class="patterns-list">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                            
                            <div class="patterns-section">
                                <h4>🎯 Patrones de Rendimiento</h4>
                                <div id="patterns-performance-patterns" class="patterns-list">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                            
                            <div class="patterns-section">
                                <h4>🧠 Patrones de Concentración</h4>
                                <div id="patterns-concentration-patterns" class="patterns-list">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recomendaciones -->
                    <div class="patterns-tab-content hidden" id="patterns-recommendations-tab">
                        <div class="patterns-recommendations">
                            <div class="patterns-recommendations-header">
                                <h4>🚀 Recomendaciones Personalizadas</h4>
                                <p>Basadas en tus patrones de estudio detectados</p>
                            </div>
                            
                            <div id="patterns-recommendations-list" class="patterns-recommendations-grid">
                                <!-- Se llenarán dinámicamente -->
                            </div>
                            
                            <div class="patterns-action-plan">
                                <h5>📋 Plan de Acción Semanal</h5>
                                <div id="patterns-action-plan" class="patterns-plan-steps">
                                    <!-- Se llenará dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Insights Avanzados -->
                    <div class="patterns-tab-content hidden" id="patterns-insights-tab">
                        <div class="patterns-insights">
                            <div class="patterns-ai-analysis">
                                <h4>🤖 Análisis IA Avanzado</h4>
                                <div id="patterns-ai-insights" class="patterns-ai-content">
                                    <!-- Se llenará dinámicamente -->
                                </div>
                            </div>
                            
                            <div class="patterns-predictions">
                                <h4>🔮 Predicciones</h4>
                                <div id="patterns-predictions-list" class="patterns-prediction-cards">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                            
                            <div class="patterns-optimization">
                                <h4>⚡ Optimizaciones Sugeridas</h4>
                                <div id="patterns-optimizations" class="patterns-optimization-list">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Escuchar eventos de estudio para recopilar datos
        document.addEventListener('studySessionStart', (e) => {
            this.trackStudyEvent('session_start', e.detail);
        });
        
        document.addEventListener('studySessionEnd', (e) => {
            this.trackStudyEvent('session_end', e.detail);
        });
        
        document.addEventListener('chatMessage', (e) => {
            this.trackStudyEvent('chat_interaction', e.detail);
        });
        
        document.addEventListener('flashcardReview', (e) => {
            this.trackStudyEvent('flashcard_review', e.detail);
        });
    }

    startDataCollection() {
        // Iniciar recopilación automática de datos
        this.dataCollectionInterval = setInterval(() => {
            this.collectActiveData();
        }, 60000); // Cada minuto
    }

    collectActiveData() {
        const now = Date.now();
        const hour = new Date(now).getHours();
        
        // Detectar si el usuario está estudiando activamente
        const isStudying = this.detectActiveStudy();
        
        if (isStudying) {
            this.studyData.activities.push({
                timestamp: now,
                hour: hour,
                type: 'active_study',
                focus_level: this.calculateFocusLevel(),
                subject: this.detectCurrentSubject(),
                activity_type: this.detectActivityType()
            });
            
            this.saveStudyData();
        }
    }

    detectActiveStudy() {
        // Detectar actividad de estudio basada en interacciones
        const recentActivities = this.studyData.activities.filter(
            activity => Date.now() - activity.timestamp < 300000 // Últimos 5 minutos
        );
        
        return recentActivities.length > 0;
    }

    calculateFocusLevel() {
        // Calcular nivel de concentración basado en patrones de interacción
        const recentInteractions = this.studyData.activities.slice(-10);
        
        if (recentInteractions.length === 0) return 50;
        
        const avgTimeBetweenInteractions = this.calculateAvgTimeBetweenInteractions(recentInteractions);
        const consistencyScore = this.calculateConsistencyScore(recentInteractions);
        
        // Focus score entre 0-100
        return Math.min(100, Math.max(0, 100 - (avgTimeBetweenInteractions / 1000) + consistencyScore));
    }

    calculateAvgTimeBetweenInteractions(interactions) {
        if (interactions.length < 2) return 0;
        
        const intervals = [];
        for (let i = 1; i < interactions.length; i++) {
            intervals.push(interactions[i].timestamp - interactions[i-1].timestamp);
        }
        
        return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    }

    calculateConsistencyScore(interactions) {
        // Puntaje basado en la consistencia de las actividades
        const types = interactions.map(i => i.type);
        const uniqueTypes = [...new Set(types)];
        
        return Math.min(50, uniqueTypes.length * 10);
    }

    detectCurrentSubject() {
        // Detectar la materia actual basada en actividades recientes
        const recentActivities = this.studyData.activities.slice(-5);
        const subjects = recentActivities
            .filter(a => a.subject)
            .map(a => a.subject);
        
        if (subjects.length === 0) return 'General';
        
        // Retornar la materia más común
        const subjectCounts = {};
        subjects.forEach(subject => {
            subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });
        
        return Object.keys(subjectCounts).reduce((a, b) => 
            subjectCounts[a] > subjectCounts[b] ? a : b
        );
    }

    detectActivityType() {
        // Detectar el tipo de actividad actual
        const modalVisible = document.querySelector('.study-modal:not([style*="none"])') ||
                           document.querySelector('.flashcards-modal:not([style*="none"])') ||
                           document.querySelector('.calc-modal:not([style*="none"])');
        
        if (modalVisible) {
            if (modalVisible.classList.contains('study-modal')) return 'structured_study';
            if (modalVisible.classList.contains('flashcards-modal')) return 'flashcard_review';
            if (modalVisible.classList.contains('calc-modal')) return 'calculation';
        }
        
        return 'chat_learning';
    }

    trackStudyEvent(eventType, data) {
        const event = {
            timestamp: Date.now(),
            hour: new Date().getHours(),
            type: eventType,
            data: data,
            subject: data?.subject || this.detectCurrentSubject(),
            duration: data?.duration || 0,
            performance: data?.performance || null
        };
        
        this.studyData.activities.push(event);
        this.saveStudyData();
        
        // Análisis en tiempo real
        if (this.studyData.activities.length % 10 === 0) {
            this.quickAnalysis();
        }
    }

    async analyzePatterns() {
        this.showLoading('Analizando patrones de estudio...');
        
        try {
            // Simular análisis de IA
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.detectTimePatterns();
            this.detectSubjectPatterns();
            this.detectPerformancePatterns();
            this.detectConcentrationPatterns();
            this.generateRecommendations();
            this.calculateAnalytics();
            
            this.updateInterface();
            this.hideLoading();
            
            this.showNotification('✅ Análisis de patrones completado', 'success');
            
        } catch (error) {
            this.hideLoading();
            this.showNotification('❌ Error en el análisis de patrones', 'error');
        }
    }

    detectTimePatterns() {
        const hourlyData = {};
        
        // Agrupar actividades por hora
        this.studyData.activities.forEach(activity => {
            const hour = activity.hour;
            if (!hourlyData[hour]) {
                hourlyData[hour] = {
                    count: 0,
                    totalFocus: 0,
                    totalDuration: 0,
                    performance: []
                };
            }
            
            hourlyData[hour].count++;
            hourlyData[hour].totalFocus += activity.focus_level || 50;
            hourlyData[hour].totalDuration += activity.duration || 1;
            if (activity.performance) {
                hourlyData[hour].performance.push(activity.performance);
            }
        });
        
        // Analizar patrones
        const patterns = [];
        const bestHours = Object.entries(hourlyData)
            .map(([hour, data]) => ({
                hour: parseInt(hour),
                avgFocus: data.totalFocus / data.count,
                avgPerformance: data.performance.length > 0 
                    ? data.performance.reduce((sum, p) => sum + p, 0) / data.performance.length 
                    : 0,
                frequency: data.count
            }))
            .sort((a, b) => (b.avgFocus + b.avgPerformance) - (a.avgFocus + a.avgPerformance));
        
        if (bestHours.length > 0) {
            const bestHour = bestHours[0];
            patterns.push({
                type: 'peak_performance',
                title: 'Hora de Mayor Rendimiento',
                description: `Tu mejor rendimiento es a las ${bestHour.hour}:00`,
                confidence: Math.min(95, bestHour.frequency * 10),
                recommendation: `Programa tus actividades más importantes a las ${bestHour.hour}:00`
            });
        }
        
        // Detectar patrones de consistencia
        const morningActivities = Object.keys(hourlyData).filter(h => h >= 6 && h <= 12).length;
        const afternoonActivities = Object.keys(hourlyData).filter(h => h >= 13 && h <= 18).length;
        const nightActivities = Object.keys(hourlyData).filter(h => h >= 19 || h <= 5).length;
        
        const totalPeriods = morningActivities + afternoonActivities + nightActivities;
        if (totalPeriods > 0) {
            let preferredPeriod = 'mañana';
            let maxActivities = morningActivities;
            
            if (afternoonActivities > maxActivities) {
                preferredPeriod = 'tarde';
                maxActivities = afternoonActivities;
            }
            if (nightActivities > maxActivities) {
                preferredPeriod = 'noche';
                maxActivities = nightActivities;
            }
            
            patterns.push({
                type: 'time_preference',
                title: 'Preferencia Temporal',
                description: `Prefieres estudiar en la ${preferredPeriod}`,
                confidence: Math.round((maxActivities / totalPeriods) * 100),
                recommendation: `Optimiza tu horario para aprovechar las ${preferredPeriod}s`
            });
        }
        
        this.patterns.timePatterns = patterns;
    }

    detectSubjectPatterns() {
        const subjectData = {};
        
        // Agrupar por materia
        this.studyData.activities.forEach(activity => {
            if (!activity.subject) return;
            
            if (!subjectData[activity.subject]) {
                subjectData[activity.subject] = {
                    sessions: 0,
                    totalTime: 0,
                    performance: [],
                    focus: []
                };
            }
            
            subjectData[activity.subject].sessions++;
            subjectData[activity.subject].totalTime += activity.duration || 1;
            if (activity.performance) {
                subjectData[activity.subject].performance.push(activity.performance);
            }
            if (activity.focus_level) {
                subjectData[activity.subject].focus.push(activity.focus_level);
            }
        });
        
        const patterns = [];
        const subjects = Object.entries(subjectData)
            .map(([subject, data]) => ({
                subject,
                avgPerformance: data.performance.length > 0 
                    ? data.performance.reduce((sum, p) => sum + p, 0) / data.performance.length 
                    : 0,
                avgFocus: data.focus.length > 0
                    ? data.focus.reduce((sum, f) => sum + f, 0) / data.focus.length
                    : 0,
                totalTime: data.totalTime,
                sessions: data.sessions
            }))
            .filter(s => s.sessions > 2);
        
        if (subjects.length > 0) {
            // Materia más fuerte
            const strongest = subjects.reduce((prev, current) => 
                (prev.avgPerformance > current.avgPerformance) ? prev : current
            );
            
            patterns.push({
                type: 'strongest_subject',
                title: 'Materia Más Fuerte',
                description: `Tienes mejor rendimiento en ${strongest.subject}`,
                confidence: Math.min(95, strongest.sessions * 5),
                recommendation: `Usa tu fortaleza en ${strongest.subject} para motivarte en otras materias`
            });
            
            // Materia que necesita más atención
            const weakest = subjects.reduce((prev, current) => 
                (prev.avgPerformance < current.avgPerformance) ? prev : current
            );
            
            if (weakest.subject !== strongest.subject) {
                patterns.push({
                    type: 'needs_attention',
                    title: 'Necesita Más Atención',
                    description: `${weakest.subject} requiere más práctica`,
                    confidence: Math.min(90, weakest.sessions * 5),
                    recommendation: `Dedica sesiones más cortas pero frecuentes a ${weakest.subject}`
                });
            }
        }
        
        this.patterns.subjectPatterns = patterns;
    }

    detectPerformancePatterns() {
        const patterns = [];
        
        // Analizar tendencia de rendimiento
        const recentPerformance = this.studyData.activities
            .filter(a => a.performance && Date.now() - a.timestamp < 604800000) // Última semana
            .map(a => a.performance);
        
        if (recentPerformance.length >= 5) {
            const firstHalf = recentPerformance.slice(0, Math.floor(recentPerformance.length / 2));
            const secondHalf = recentPerformance.slice(Math.floor(recentPerformance.length / 2));
            
            const firstAvg = firstHalf.reduce((sum, p) => sum + p, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, p) => sum + p, 0) / secondHalf.length;
            
            const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
            
            if (Math.abs(improvement) > 10) {
                patterns.push({
                    type: 'performance_trend',
                    title: improvement > 0 ? 'Mejora Constante' : 'Necesita Atención',
                    description: `Tu rendimiento ha ${improvement > 0 ? 'mejorado' : 'disminuido'} ${Math.abs(improvement).toFixed(1)}%`,
                    confidence: Math.min(90, recentPerformance.length * 2),
                    recommendation: improvement > 0 
                        ? 'Mantén tu rutina actual, está funcionando bien'
                        : 'Considera ajustar tu estrategia de estudio'
                });
            }
        }
        
        this.patterns.performancePatterns = patterns;
    }

    detectConcentrationPatterns() {
        const patterns = [];
        
        // Analizar patrones de concentración
        const focusData = this.studyData.activities
            .filter(a => a.focus_level)
            .map(a => ({
                focus: a.focus_level,
                hour: a.hour,
                duration: a.duration || 1,
                timestamp: a.timestamp
            }));
        
        if (focusData.length >= 10) {
            // Duración óptima de sesión
            const sessions = this.groupIntoSessions(focusData);
            const sessionAnalysis = sessions.map(session => ({
                duration: session.length,
                avgFocus: session.reduce((sum, d) => sum + d.focus, 0) / session.length,
                focusDecline: this.calculateFocusDecline(session)
            }));
            
            const optimalDuration = this.findOptimalSessionDuration(sessionAnalysis);
            
            if (optimalDuration > 0) {
                patterns.push({
                    type: 'optimal_duration',
                    title: 'Duración Óptima de Sesión',
                    description: `Tu concentración es mejor en sesiones de ${optimalDuration} minutos`,
                    confidence: 85,
                    recommendation: `Programa sesiones de estudio de ${optimalDuration} minutos con descansos regulares`
                });
            }
        }
        
        this.patterns.concentrationPatterns = patterns;
    }

    groupIntoSessions(focusData) {
        // Agrupar datos en sesiones basándose en gaps de tiempo
        const sessions = [];
        let currentSession = [];
        
        focusData.sort((a, b) => a.timestamp - b.timestamp);
        
        focusData.forEach((data, index) => {
            if (index === 0) {
                currentSession = [data];
            } else {
                const timeSinceLastActivity = data.timestamp - focusData[index - 1].timestamp;
                if (timeSinceLastActivity > 1800000) { // 30 minutos de gap
                    sessions.push(currentSession);
                    currentSession = [data];
                } else {
                    currentSession.push(data);
                }
            }
        });
        
        if (currentSession.length > 0) {
            sessions.push(currentSession);
        }
        
        return sessions.filter(session => session.length >= 3);
    }

    calculateFocusDecline(session) {
        if (session.length < 3) return 0;
        
        const firstThird = session.slice(0, Math.floor(session.length / 3));
        const lastThird = session.slice(-Math.floor(session.length / 3));
        
        const firstAvg = firstThird.reduce((sum, d) => sum + d.focus, 0) / firstThird.length;
        const lastAvg = lastThird.reduce((sum, d) => sum + d.focus, 0) / lastThird.length;
        
        return ((firstAvg - lastAvg) / firstAvg) * 100;
    }

    findOptimalSessionDuration(sessionAnalysis) {
        // Encontrar la duración que maximiza el foco promedio
        const durationGroups = {};
        
        sessionAnalysis.forEach(session => {
            const duration = Math.round(session.duration / 5) * 5; // Redondear a múltiplos de 5
            if (!durationGroups[duration]) {
                durationGroups[duration] = [];
            }
            durationGroups[duration].push(session);
        });
        
        let bestDuration = 0;
        let bestScore = 0;
        
        Object.entries(durationGroups).forEach(([duration, sessions]) => {
            if (sessions.length >= 2) { // Al menos 2 sesiones para considerar
                const avgFocus = sessions.reduce((sum, s) => sum + s.avgFocus, 0) / sessions.length;
                const avgDecline = sessions.reduce((sum, s) => sum + s.focusDecline, 0) / sessions.length;
                const score = avgFocus - (avgDecline * 0.5); // Penalizar decline
                
                if (score > bestScore) {
                    bestScore = score;
                    bestDuration = parseInt(duration);
                }
            }
        });
        
        return bestDuration;
    }

    generateRecommendations() {
        this.recommendations = [];
        
        // Combinar todos los patrones para generar recomendaciones
        const allPatterns = [
            ...this.patterns.timePatterns,
            ...this.patterns.subjectPatterns,
            ...this.patterns.performancePatterns,
            ...this.patterns.concentrationPatterns
        ];
        
        // Generar recomendaciones basadas en patrones
        allPatterns.forEach(pattern => {
            if (pattern.confidence > 60) {
                this.recommendations.push({
                    id: Date.now() + Math.random(),
                    title: pattern.title,
                    description: pattern.recommendation,
                    priority: this.calculatePriority(pattern),
                    category: this.categorizeRecommendation(pattern.type),
                    confidence: pattern.confidence,
                    actionable: true
                });
            }
        });
        
        // Recomendaciones adicionales basadas en analytics
        if (this.analytics.averageSessionLength < 25) {
            this.recommendations.push({
                id: Date.now() + Math.random(),
                title: 'Aumentar Duración de Sesiones',
                description: 'Intenta sesiones de estudio más largas para mejor retención',
                priority: 'medium',
                category: 'duration',
                confidence: 75,
                actionable: true
            });
        }
        
        if (this.analytics.focusScore < 60) {
            this.recommendations.push({
                id: Date.now() + Math.random(),
                title: 'Mejorar Concentración',
                description: 'Elimina distracciones y usa técnicas de mindfulness',
                priority: 'high',
                category: 'focus',
                confidence: 80,
                actionable: true
            });
        }
        
        // Ordenar por prioridad
        this.recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    calculatePriority(pattern) {
        if (pattern.confidence > 80) return 'high';
        if (pattern.confidence > 60) return 'medium';
        return 'low';
    }

    categorizeRecommendation(type) {
        const categories = {
            'peak_performance': 'timing',
            'time_preference': 'timing',
            'strongest_subject': 'subject',
            'needs_attention': 'subject',
            'performance_trend': 'performance',
            'optimal_duration': 'duration'
        };
        
        return categories[type] || 'general';
    }

    calculateAnalytics() {
        // Calcular métricas analíticas
        const totalTime = this.studyData.activities
            .reduce((sum, activity) => sum + (activity.duration || 0), 0);
        
        const sessionDurations = this.studyData.activities
            .filter(a => a.duration && a.duration > 5)
            .map(a => a.duration);
        
        const avgSessionLength = sessionDurations.length > 0
            ? sessionDurations.reduce((sum, d) => sum + d, 0) / sessionDurations.length
            : 0;
        
        const focusScores = this.studyData.activities
            .filter(a => a.focus_level)
            .map(a => a.focus_level);
        
        const avgFocusScore = focusScores.length > 0
            ? focusScores.reduce((sum, f) => sum + f, 0) / focusScores.length
            : 0;
        
        // Calcular racha de días
        const studyDays = [...new Set(
            this.studyData.activities.map(a => 
                new Date(a.timestamp).toDateString()
            )
        )].sort();
        
        let streak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (studyDays.includes(today) || studyDays.includes(yesterday)) {
            let currentDate = new Date();
            while (studyDays.includes(currentDate.toDateString())) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            }
        }
        
        this.analytics = {
            totalStudyTime: Math.round(totalTime),
            averageSessionLength: Math.round(avgSessionLength),
            focusScore: Math.round(avgFocusScore),
            studyStreak: streak,
            totalSessions: sessionDurations.length,
            bestPerformanceTime: this.findBestPerformanceTime(),
            strongestSubject: this.findStrongestSubject(),
            weakestSubject: this.findWeakestSubject()
        };
    }

    findBestPerformanceTime() {
        // Encontrar la hora con mejor rendimiento
        const hourlyPerformance = {};
        
        this.studyData.activities
            .filter(a => a.performance && a.hour !== undefined)
            .forEach(activity => {
                if (!hourlyPerformance[activity.hour]) {
                    hourlyPerformance[activity.hour] = [];
                }
                hourlyPerformance[activity.hour].push(activity.performance);
            });
        
        let bestHour = null;
        let bestAvg = 0;
        
        Object.entries(hourlyPerformance).forEach(([hour, performances]) => {
            if (performances.length >= 3) {
                const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
                if (avg > bestAvg) {
                    bestAvg = avg;
                    bestHour = parseInt(hour);
                }
            }
        });
        
        return bestHour;
    }

    findStrongestSubject() {
        // Encontrar la materia con mejor rendimiento
        const subjectPerformance = {};
        
        this.studyData.activities
            .filter(a => a.performance && a.subject)
            .forEach(activity => {
                if (!subjectPerformance[activity.subject]) {
                    subjectPerformance[activity.subject] = [];
                }
                subjectPerformance[activity.subject].push(activity.performance);
            });
        
        let strongest = null;
        let bestAvg = 0;
        
        Object.entries(subjectPerformance).forEach(([subject, performances]) => {
            if (performances.length >= 3) {
                const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
                if (avg > bestAvg) {
                    bestAvg = avg;
                    strongest = subject;
                }
            }
        });
        
        return strongest;
    }

    findWeakestSubject() {
        // Encontrar la materia que necesita más atención
        const subjectPerformance = {};
        
        this.studyData.activities
            .filter(a => a.performance && a.subject)
            .forEach(activity => {
                if (!subjectPerformance[activity.subject]) {
                    subjectPerformance[activity.subject] = [];
                }
                subjectPerformance[activity.subject].push(activity.performance);
            });
        
        let weakest = null;
        let worstAvg = 100;
        
        Object.entries(subjectPerformance).forEach(([subject, performances]) => {
            if (performances.length >= 3) {
                const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
                if (avg < worstAvg) {
                    worstAvg = avg;
                    weakest = subject;
                }
            }
        });
        
        return weakest;
    }

    scheduleAnalysis() {
        // Programar análisis automáticos
        setInterval(() => {
            this.quickAnalysis();
        }, 1800000); // Cada 30 minutos
        
        // Análisis profundo diario
        setInterval(() => {
            this.analyzePatterns();
        }, 86400000); // Cada 24 horas
    }

    quickAnalysis() {
        // Análisis rápido para insights inmediatos
        const recentActivities = this.studyData.activities.slice(-20);
        
        if (recentActivities.length >= 5) {
            const insights = this.generateQuickInsights(recentActivities);
            this.displayQuickInsights(insights);
        }
    }

    generateQuickInsights(activities) {
        const insights = [];
        
        // Analizar concentración reciente
        const recentFocus = activities
            .filter(a => a.focus_level)
            .map(a => a.focus_level);
        
        if (recentFocus.length >= 3) {
            const avgFocus = recentFocus.reduce((sum, f) => sum + f, 0) / recentFocus.length;
            
            if (avgFocus > 80) {
                insights.push({
                    type: 'focus_high',
                    message: '🔥 Tu concentración está excelente',
                    suggestion: 'Aprovecha este momento para tareas complejas'
                });
            } else if (avgFocus < 50) {
                insights.push({
                    type: 'focus_low',
                    message: '😴 Tu concentración ha bajado',
                    suggestion: 'Considera tomar un descanso o cambiar de actividad'
                });
            }
        }
        
        // Analizar consistencia
        const hoursStudied = [...new Set(activities.map(a => a.hour))];
        if (hoursStudied.length <= 2 && activities.length >= 5) {
            insights.push({
                type: 'consistency',
                message: '⏱️ Estás siendo muy consistente',
                suggestion: 'Mantén este ritmo de estudio'
            });
        }
        
        return insights;
    }

    displayQuickInsights(insights) {
        insights.forEach(insight => {
            setTimeout(() => {
                this.showNotification(
                    `${insight.message}\n💡 ${insight.suggestion}`,
                    'info',
                    5000
                );
            }, Math.random() * 2000);
        });
    }

    openModal() {
        const modal = document.querySelector('.patterns-modal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.patterns-content').style.transform = 'translateY(0)';
        }, 10);
        
        this.analyzePatterns();
    }

    closeModal() {
        const modal = document.querySelector('.patterns-modal');
        modal.style.opacity = '0';
        modal.querySelector('.patterns-content').style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    switchTab(tabName) {
        // Actualizar botones de tabs
        document.querySelectorAll('.patterns-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.patterns-tab[onclick="studyPatternDetector.switchTab('${tabName}')"]`).classList.add('active');
        
        // Mostrar contenido correspondiente
        document.querySelectorAll('.patterns-tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`patterns-${tabName}-tab`).classList.remove('hidden');
    }

    updateInterface() {
        this.updateMetrics();
        this.updateCharts();
        this.updatePatternsList();
        this.updateRecommendations();
        this.updateInsights();
    }

    updateMetrics() {
        document.getElementById('patterns-total-time').textContent = `${Math.floor(this.analytics.totalStudyTime / 60)}h`;
        document.getElementById('patterns-avg-session').textContent = `${this.analytics.averageSessionLength}min`;
        document.getElementById('patterns-focus-score').textContent = `${this.analytics.focusScore}%`;
        document.getElementById('patterns-streak').textContent = this.analytics.studyStreak;
    }

    updateCharts() {
        this.renderTimeChart();
        this.renderSubjectChart();
    }

    renderTimeChart() {
        const canvas = document.getElementById('patterns-time-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Datos por hora
        const hourlyData = new Array(24).fill(0);
        const hourlyFocus = new Array(24).fill(0);
        const hourlyCounts = new Array(24).fill(0);
        
        this.studyData.activities.forEach(activity => {
            if (activity.hour !== undefined) {
                hourlyData[activity.hour] += activity.duration || 1;
                hourlyFocus[activity.hour] += activity.focus_level || 50;
                hourlyCounts[activity.hour]++;
            }
        });
        
        // Calcular promedios
        for (let i = 0; i < 24; i++) {
            if (hourlyCounts[i] > 0) {
                hourlyFocus[i] = hourlyFocus[i] / hourlyCounts[i];
            }
        }
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar gráfico simple
        const maxValue = Math.max(...hourlyData);
        const barWidth = canvas.width / 24;
        
        ctx.fillStyle = '#4facfe';
        for (let i = 0; i < 24; i++) {
            const barHeight = (hourlyData[i] / maxValue) * (canvas.height * 0.8);
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
        }
        
        // Etiquetas
        ctx.fillStyle = '#374151';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        for (let i = 0; i < 24; i += 4) {
            ctx.fillText(`${i}h`, i * barWidth + barWidth/2, canvas.height - 5);
        }
    }

    renderSubjectChart() {
        const container = document.getElementById('patterns-subject-chart');
        if (!container) return;
        
        const subjectData = {};
        this.studyData.activities.forEach(activity => {
            if (activity.subject) {
                if (!subjectData[activity.subject]) {
                    subjectData[activity.subject] = 0;
                }
                subjectData[activity.subject] += activity.duration || 1;
            }
        });
        
        const subjects = Object.entries(subjectData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        const maxValue = subjects.length > 0 ? subjects[0][1] : 1;
        
        container.innerHTML = subjects.map(([subject, time]) => {
            const percentage = (time / maxValue) * 100;
            return `
                <div class="patterns-subject-bar">
                    <span class="patterns-subject-name">${subject}</span>
                    <div class="patterns-subject-progress">
                        <div class="patterns-subject-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="patterns-subject-time">${Math.round(time)}min</span>
                </div>
            `;
        }).join('');
    }

    updatePatternsList() {
        // Actualizar listas de patrones
        this.updatePatternSection('patterns-time-patterns', this.patterns.timePatterns);
        this.updatePatternSection('patterns-subject-patterns', this.patterns.subjectPatterns);
        this.updatePatternSection('patterns-performance-patterns', this.patterns.performancePatterns);
        this.updatePatternSection('patterns-concentration-patterns', this.patterns.concentrationPatterns);
    }

    updatePatternSection(elementId, patterns) {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        if (patterns.length === 0) {
            container.innerHTML = '<p class="patterns-no-data">No hay patrones detectados aún</p>';
            return;
        }
        
        container.innerHTML = patterns.map(pattern => `
            <div class="patterns-pattern-item">
                <div class="patterns-pattern-header">
                    <h6>${pattern.title}</h6>
                    <span class="patterns-confidence">${pattern.confidence}%</span>
                </div>
                <p class="patterns-pattern-description">${pattern.description}</p>
                <p class="patterns-pattern-recommendation">💡 ${pattern.recommendation}</p>
            </div>
        `).join('');
    }

    updateRecommendations() {
        const container = document.getElementById('patterns-recommendations-list');
        if (!container) return;
        
        if (this.recommendations.length === 0) {
            container.innerHTML = '<p class="patterns-no-data">No hay recomendaciones disponibles</p>';
            return;
        }
        
        container.innerHTML = this.recommendations.map(rec => `
            <div class="patterns-recommendation-card ${rec.priority}">
                <div class="patterns-recommendation-header">
                    <h5>${rec.title}</h5>
                    <span class="patterns-recommendation-priority">${rec.priority}</span>
                </div>
                <p class="patterns-recommendation-description">${rec.description}</p>
                <div class="patterns-recommendation-footer">
                    <span class="patterns-recommendation-confidence">${rec.confidence}% confianza</span>
                    <button onclick="studyPatternDetector.applyRecommendation('${rec.id}')" class="patterns-apply-btn">Aplicar</button>
                </div>
            </div>
        `).join('');
    }

    updateInsights() {
        const container = document.getElementById('patterns-ai-insights');
        if (!container) return;
        
        // Generar insights avanzados con IA simulada
        const insights = [
            `Basado en ${this.studyData.activities.length} actividades de estudio analizadas`,
            `Tu patrón de estudio muestra una preferencia por sesiones ${this.analytics.averageSessionLength > 45 ? 'largas' : 'cortas'}`,
            `La consistencia en tu horario ha ${this.analytics.studyStreak > 5 ? 'mejorado significativamente' : 'fluctuado'} recientemente`,
            `Tu rendimiento peak ocurre ${this.analytics.bestPerformanceTime ? `a las ${this.analytics.bestPerformanceTime}:00` : 'en horarios variables'}`
        ];
        
        container.innerHTML = insights.map(insight => `
            <div class="patterns-insight-item">
                <span class="patterns-insight-icon">🤖</span>
                <p>${insight}</p>
            </div>
        `).join('');
    }

    applyRecommendation(recommendationId) {
        const recommendation = this.recommendations.find(r => r.id === recommendationId);
        if (!recommendation) return;
        
        // Simular aplicación de recomendación
        this.showNotification(`✅ Recomendación "${recommendation.title}" aplicada`, 'success');
        
        // Marcar como aplicada
        recommendation.applied = true;
        this.updateRecommendations();
    }

    showLoading(message = 'Analizando...') {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'patterns-loading';
        loadingDiv.innerHTML = `
            <div class="patterns-loading-content">
                <div class="patterns-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loading = document.querySelector('.patterns-loading');
        if (loading) {
            loading.remove();
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `patterns-notification ${type}`;
        notification.innerHTML = `
            <div class="patterns-notification-content">
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

    loadStudyData() {
        try {
            const saved = localStorage.getItem('study_pattern_data');
            return saved ? JSON.parse(saved) : { activities: [], patterns: {}, analytics: {} };
        } catch (error) {
            console.error('Error loading study pattern data:', error);
            return { activities: [], patterns: {}, analytics: {} };
        }
    }

    saveStudyData() {
        try {
            localStorage.setItem('study_pattern_data', JSON.stringify(this.studyData));
        } catch (error) {
            console.error('Error saving study pattern data:', error);
        }
    }
}

// Inicializar el detector de patrones
const studyPatternDetector = new StudyPatternDetector();

// Exportar para uso global
window.studyPatternDetector = studyPatternDetector;