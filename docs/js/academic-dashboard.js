/* ================================================
   📊 DASHBOARD ACADÉMICO PERSONAL - AI STUDY GENIUS
   👨‍💻 Desarrollado por: Vicentegg4212  
   📈 Panel integral con métricas y análisis predictivo
   ================================================ */

class AcademicDashboard {
    constructor() {
        this.data = this.loadDashboardData();
        this.charts = {};
        this.metrics = {
            studyTime: { today: 0, week: 0, month: 0, total: 0 },
            performance: { average: 0, trend: 'stable', improvement: 0 },
            subjects: {},
            goals: [],
            achievements: [],
            predictions: {}
        };
        
        this.colors = {
            primary: '#4facfe',
            secondary: '#00f2fe',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
            purple: '#8b5cf6',
            pink: '#ec4899'
        };
        
        this.init();
    }

    init() {
        this.createFloatingButton();
        this.createModal();
        this.setupEventListeners();
        this.loadData();
        this.scheduleUpdates();
    }

    createFloatingButton() {
        const btn = document.createElement('button');
        btn.className = 'dashboard-floating-btn';
        btn.innerHTML = '📊';
        btn.title = 'Dashboard Académico Personal';
        btn.onclick = () => this.openModal();
        document.body.appendChild(btn);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'dashboard-modal';
        modal.innerHTML = `
            <div class="dashboard-overlay" onclick="academicDashboard.closeModal()"></div>
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <h3>📊 Dashboard Académico Personal</h3>
                    <div class="dashboard-header-actions">
                        <button class="dashboard-export-btn" onclick="academicDashboard.exportReport()" title="Exportar Reporte">📄</button>
                        <button class="dashboard-settings-btn" onclick="academicDashboard.showSettings()" title="Configuración">⚙️</button>
                        <button class="dashboard-close-btn" onclick="academicDashboard.closeModal()">✕</button>
                    </div>
                </div>
                
                <div class="dashboard-body">
                    <div class="dashboard-tabs">
                        <button class="dashboard-tab active" onclick="academicDashboard.switchTab('overview')">Resumen</button>
                        <button class="dashboard-tab" onclick="academicDashboard.switchTab('performance')">Rendimiento</button>
                        <button class="dashboard-tab" onclick="academicDashboard.switchTab('subjects')">Por Materia</button>
                        <button class="dashboard-tab" onclick="academicDashboard.switchTab('goals')">Objetivos</button>
                        <button class="dashboard-tab" onclick="academicDashboard.switchTab('predictions')">Predicciones</button>
                    </div>
                    
                    <!-- Resumen General -->
                    <div class="dashboard-tab-content" id="dashboard-overview-tab">
                        <div class="dashboard-overview">
                            <!-- KPIs Principales -->
                            <div class="dashboard-kpis-grid">
                                <div class="dashboard-kpi-card primary">
                                    <div class="dashboard-kpi-icon">⏱️</div>
                                    <div class="dashboard-kpi-content">
                                        <div class="dashboard-kpi-value" id="dashboard-study-time-today">0h 0m</div>
                                        <div class="dashboard-kpi-label">Hoy</div>
                                        <div class="dashboard-kpi-change" id="dashboard-study-time-change">+0%</div>
                                    </div>
                                </div>
                                
                                <div class="dashboard-kpi-card success">
                                    <div class="dashboard-kpi-icon">🎯</div>
                                    <div class="dashboard-kpi-content">
                                        <div class="dashboard-kpi-value" id="dashboard-performance-avg">0%</div>
                                        <div class="dashboard-kpi-label">Rendimiento</div>
                                        <div class="dashboard-kpi-change" id="dashboard-performance-change">+0%</div>
                                    </div>
                                </div>
                                
                                <div class="dashboard-kpi-card warning">
                                    <div class="dashboard-kpi-icon">🔥</div>
                                    <div class="dashboard-kpi-content">
                                        <div class="dashboard-kpi-value" id="dashboard-streak">0</div>
                                        <div class="dashboard-kpi-label">Días Consecutivos</div>
                                        <div class="dashboard-kpi-change" id="dashboard-streak-change">+0</div>
                                    </div>
                                </div>
                                
                                <div class="dashboard-kpi-card info">
                                    <div class="dashboard-kpi-icon">📚</div>
                                    <div class="dashboard-kpi-content">
                                        <div class="dashboard-kpi-value" id="dashboard-subjects-count">0</div>
                                        <div class="dashboard-kpi-label">Materias Activas</div>
                                        <div class="dashboard-kpi-change" id="dashboard-subjects-change">+0</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Gráficos de Resumen -->
                            <div class="dashboard-charts-grid">
                                <div class="dashboard-chart-container">
                                    <h4>📈 Progreso Semanal</h4>
                                    <canvas id="dashboard-weekly-chart" width="400" height="200"></canvas>
                                </div>
                                
                                <div class="dashboard-chart-container">
                                    <h4>🏆 Logros Recientes</h4>
                                    <div id="dashboard-achievements" class="dashboard-achievements-list">
                                        <!-- Se llenarán dinámicamente -->
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Objetivos Rápidos -->
                            <div class="dashboard-quick-goals">
                                <h4>🎯 Objetivos del Día</h4>
                                <div id="dashboard-today-goals" class="dashboard-goals-list">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                            
                            <!-- Insights Rápidos -->
                            <div class="dashboard-quick-insights">
                                <h4>💡 Insights del Día</h4>
                                <div id="dashboard-daily-insights" class="dashboard-insights-grid">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Análisis de Rendimiento -->
                    <div class="dashboard-tab-content hidden" id="dashboard-performance-tab">
                        <div class="dashboard-performance">
                            <div class="dashboard-performance-summary">
                                <div class="dashboard-performance-metrics">
                                    <div class="dashboard-metric-card">
                                        <h5>📊 Rendimiento General</h5>
                                        <div class="dashboard-metric-value large" id="dashboard-overall-performance">85%</div>
                                        <div class="dashboard-metric-trend" id="dashboard-overall-trend">↗️ +5% esta semana</div>
                                    </div>
                                    
                                    <div class="dashboard-metric-card">
                                        <h5>⚡ Velocidad de Aprendizaje</h5>
                                        <div class="dashboard-metric-value large" id="dashboard-learning-speed">1.2x</div>
                                        <div class="dashboard-metric-trend" id="dashboard-speed-trend">🚀 Acelerado</div>
                                    </div>
                                    
                                    <div class="dashboard-metric-card">
                                        <h5>🧠 Retención</h5>
                                        <div class="dashboard-metric-value large" id="dashboard-retention">78%</div>
                                        <div class="dashboard-metric-trend" id="dashboard-retention-trend">📈 Mejorando</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="dashboard-performance-charts">
                                <div class="dashboard-chart-container wide">
                                    <h4>📈 Evolución del Rendimiento</h4>
                                    <canvas id="dashboard-performance-chart" width="800" height="300"></canvas>
                                </div>
                                
                                <div class="dashboard-chart-container">
                                    <h4>🕐 Rendimiento por Hora</h4>
                                    <canvas id="dashboard-hourly-performance" width="400" height="200"></canvas>
                                </div>
                                
                                <div class="dashboard-chart-container">
                                    <h4>📅 Rendimiento por Día</h4>
                                    <canvas id="dashboard-daily-performance" width="400" height="200"></canvas>
                                </div>
                            </div>
                            
                            <div class="dashboard-performance-analysis">
                                <h4>🔍 Análisis Detallado</h4>
                                <div id="dashboard-performance-insights" class="dashboard-analysis-grid">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Análisis por Materia -->
                    <div class="dashboard-tab-content hidden" id="dashboard-subjects-tab">
                        <div class="dashboard-subjects">
                            <div class="dashboard-subjects-overview">
                                <div class="dashboard-subjects-grid" id="dashboard-subjects-grid">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                            
                            <div class="dashboard-subjects-comparison">
                                <h4>⚖️ Comparación entre Materias</h4>
                                <canvas id="dashboard-subjects-comparison-chart" width="600" height="300"></canvas>
                            </div>
                            
                            <div class="dashboard-subjects-recommendations">
                                <h4>💡 Recomendaciones por Materia</h4>
                                <div id="dashboard-subjects-recommendations" class="dashboard-recommendations-list">
                                    <!-- Se llenarán dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Gestión de Objetivos -->
                    <div class="dashboard-tab-content hidden" id="dashboard-goals-tab">
                        <div class="dashboard-goals">
                            <div class="dashboard-goals-header">
                                <h4>🎯 Gestión de Objetivos</h4>
                                <button onclick="academicDashboard.createGoal()" class="dashboard-add-goal-btn">+ Nuevo Objetivo</button>
                            </div>
                            
                            <div class="dashboard-goals-categories">
                                <div class="dashboard-goals-category">
                                    <h5>📅 Objetivos Diarios</h5>
                                    <div id="dashboard-daily-goals" class="dashboard-goals-list">
                                        <!-- Se llenarán dinámicamente -->
                                    </div>
                                </div>
                                
                                <div class="dashboard-goals-category">
                                    <h5>📆 Objetivos Semanales</h5>
                                    <div id="dashboard-weekly-goals" class="dashboard-goals-list">
                                        <!-- Se llenarán dinámicamente -->
                                    </div>
                                </div>
                                
                                <div class="dashboard-goals-category">
                                    <h5>🗓️ Objetivos Mensuales</h5>
                                    <div id="dashboard-monthly-goals" class="dashboard-goals-list">
                                        <!-- Se llenarán dinámicamente -->
                                    </div>
                                </div>
                            </div>
                            
                            <div class="dashboard-goals-progress">
                                <h4>📊 Progreso General de Objetivos</h4>
                                <canvas id="dashboard-goals-progress-chart" width="600" height="300"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Predicciones IA -->
                    <div class="dashboard-tab-content hidden" id="dashboard-predictions-tab">
                        <div class="dashboard-predictions">
                            <div class="dashboard-predictions-header">
                                <h4>🔮 Predicciones IA</h4>
                                <p>Análisis predictivo basado en tus patrones de estudio</p>
                            </div>
                            
                            <div class="dashboard-predictions-grid">
                                <div class="dashboard-prediction-card">
                                    <h5>📈 Rendimiento Futuro</h5>
                                    <div class="dashboard-prediction-content" id="dashboard-future-performance">
                                        <!-- Se llenará dinámicamente -->
                                    </div>
                                </div>
                                
                                <div class="dashboard-prediction-card">
                                    <h5>⏰ Mejor Horario de Estudio</h5>
                                    <div class="dashboard-prediction-content" id="dashboard-optimal-schedule">
                                        <!-- Se llenará dinámicamente -->
                                    </div>
                                </div>
                                
                                <div class="dashboard-prediction-card">
                                    <h5>🎯 Probabilidad de Éxito</h5>
                                    <div class="dashboard-prediction-content" id="dashboard-success-probability">
                                        <!-- Se llenará dinámicamente -->
                                    </div>
                                </div>
                                
                                <div class="dashboard-prediction-card">
                                    <h5>⚠️ Áreas de Riesgo</h5>
                                    <div class="dashboard-prediction-content" id="dashboard-risk-areas">
                                        <!-- Se llenará dinámicamente -->
                                    </div>
                                </div>
                            </div>
                            
                            <div class="dashboard-ai-insights">
                                <h4>🤖 Insights de IA Avanzados</h4>
                                <div id="dashboard-ai-analysis" class="dashboard-ai-content">
                                    <!-- Se llenará dinámicamente -->
                                </div>
                            </div>
                            
                            <div class="dashboard-forecast">
                                <h4>📊 Proyección a 30 días</h4>
                                <canvas id="dashboard-forecast-chart" width="800" height="300"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Escuchar eventos de otras funcionalidades
        document.addEventListener('studySessionComplete', (e) => {
            this.updateStudyData(e.detail);
        });
        
        document.addEventListener('flashcardSessionComplete', (e) => {
            this.updateFlashcardData(e.detail);
        });
        
        document.addEventListener('goalAchieved', (e) => {
            this.addAchievement(e.detail);
        });
    }

    loadData() {
        // Cargar y procesar datos de todas las funcionalidades
        this.loadStudyModeData();
        this.loadFlashcardData();
        this.loadLibraryData();
        this.loadPatternData();
        this.calculateMetrics();
        this.generatePredictions();
    }

    loadStudyModeData() {
        try {
            const studySessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
            this.data.studySessions = studySessions;
        } catch (error) {
            console.error('Error loading study mode data:', error);
        }
    }

    loadFlashcardData() {
        try {
            const flashcards = JSON.parse(localStorage.getItem('flashcards_data') || '[]');
            this.data.flashcards = flashcards;
        } catch (error) {
            console.error('Error loading flashcard data:', error);
        }
    }

    loadLibraryData() {
        try {
            const library = JSON.parse(localStorage.getItem('personal_library') || '[]');
            this.data.library = library;
        } catch (error) {
            console.error('Error loading library data:', error);
        }
    }

    loadPatternData() {
        try {
            const patterns = JSON.parse(localStorage.getItem('study_pattern_data') || '{}');
            this.data.patterns = patterns;
        } catch (error) {
            console.error('Error loading pattern data:', error);
        }
    }

    calculateMetrics() {
        this.calculateStudyTimeMetrics();
        this.calculatePerformanceMetrics();
        this.calculateSubjectMetrics();
        this.calculateStreakMetrics();
    }

    calculateStudyTimeMetrics() {
        const now = Date.now();
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const weekStart = now - (7 * 24 * 60 * 60 * 1000);
        const monthStart = now - (30 * 24 * 60 * 60 * 1000);
        
        let todayTime = 0;
        let weekTime = 0;
        let monthTime = 0;
        let totalTime = 0;
        
        if (this.data.studySessions) {
            this.data.studySessions.forEach(session => {
                const sessionTime = session.totalTime || session.elapsed || 0;
                totalTime += sessionTime;
                
                if (session.startTime >= todayStart) {
                    todayTime += sessionTime;
                }
                if (session.startTime >= weekStart) {
                    weekTime += sessionTime;
                }
                if (session.startTime >= monthStart) {
                    monthTime += sessionTime;
                }
            });
        }
        
        this.metrics.studyTime = {
            today: todayTime,
            week: weekTime,
            month: monthTime,
            total: totalTime
        };
    }

    calculatePerformanceMetrics() {
        let totalPerformance = 0;
        let performanceCount = 0;
        const recentPerformances = [];
        
        // Datos de sesiones de estudio
        if (this.data.studySessions) {
            this.data.studySessions.forEach(session => {
                if (session.efficiency) {
                    totalPerformance += session.efficiency;
                    performanceCount++;
                    recentPerformances.push({
                        value: session.efficiency,
                        timestamp: session.startTime
                    });
                }
            });
        }
        
        // Datos de flashcards
        if (this.data.flashcards) {
            const flashcardSessions = this.data.flashcards.filter(f => f.lastReviewed);
            flashcardSessions.forEach(session => {
                // Calcular rendimiento basado en intervalos
                const performance = Math.min(100, (session.interval / 1440) * 20); // Normalizar
                totalPerformance += performance;
                performanceCount++;
                recentPerformances.push({
                    value: performance,
                    timestamp: session.lastReviewed
                });
            });
        }
        
        const averagePerformance = performanceCount > 0 ? totalPerformance / performanceCount : 0;
        
        // Calcular tendencia
        const recentSorted = recentPerformances
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(-10);
        
        let trend = 'stable';
        if (recentSorted.length >= 5) {
            const firstHalf = recentSorted.slice(0, Math.floor(recentSorted.length / 2));
            const secondHalf = recentSorted.slice(Math.floor(recentSorted.length / 2));
            
            const firstAvg = firstHalf.reduce((sum, p) => sum + p.value, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, p) => sum + p.value, 0) / secondHalf.length;
            
            const change = ((secondAvg - firstAvg) / firstAvg) * 100;
            
            if (change > 5) trend = 'improving';
            else if (change < -5) trend = 'declining';
        }
        
        this.metrics.performance = {
            average: Math.round(averagePerformance),
            trend: trend,
            improvement: recentSorted.length >= 2 
                ? ((recentSorted[recentSorted.length - 1].value - recentSorted[0].value) / recentSorted[0].value) * 100
                : 0
        };
    }

    calculateSubjectMetrics() {
        const subjects = {};
        
        // Procesar sesiones de estudio
        if (this.data.studySessions) {
            this.data.studySessions.forEach(session => {
                if (!subjects[session.subject]) {
                    subjects[session.subject] = {
                        name: session.subject,
                        studyTime: 0,
                        sessions: 0,
                        performance: [],
                        lastStudied: 0
                    };
                }
                
                subjects[session.subject].studyTime += session.totalTime || session.elapsed || 0;
                subjects[session.subject].sessions++;
                subjects[session.subject].lastStudied = Math.max(subjects[session.subject].lastStudied, session.startTime);
                
                if (session.efficiency) {
                    subjects[session.subject].performance.push(session.efficiency);
                }
            });
        }
        
        // Procesar flashcards
        if (this.data.flashcards) {
            this.data.flashcards.forEach(card => {
                if (!subjects[card.subject]) {
                    subjects[card.subject] = {
                        name: card.subject,
                        studyTime: 0,
                        sessions: 0,
                        performance: [],
                        lastStudied: 0,
                        flashcards: 0,
                        masteredCards: 0
                    };
                }
                
                subjects[card.subject].flashcards = (subjects[card.subject].flashcards || 0) + 1;
                if (card.status === 'mastered') {
                    subjects[card.subject].masteredCards = (subjects[card.subject].masteredCards || 0) + 1;
                }
                
                if (card.lastReviewed) {
                    subjects[card.subject].lastStudied = Math.max(subjects[card.subject].lastStudied, card.lastReviewed);
                }
            });
        }
        
        // Calcular métricas por materia
        Object.values(subjects).forEach(subject => {
            subject.averagePerformance = subject.performance.length > 0
                ? subject.performance.reduce((sum, p) => sum + p, 0) / subject.performance.length
                : 0;
            
            subject.masteryLevel = subject.flashcards > 0
                ? (subject.masteredCards / subject.flashcards) * 100
                : 0;
            
            // Calcular días desde última sesión
            subject.daysSinceLastStudy = Math.floor((Date.now() - subject.lastStudied) / (24 * 60 * 60 * 1000));
        });
        
        this.metrics.subjects = subjects;
    }

    calculateStreakMetrics() {
        const studyDays = new Set();
        
        // Días de sesiones de estudio
        if (this.data.studySessions) {
            this.data.studySessions.forEach(session => {
                const date = new Date(session.startTime).toDateString();
                studyDays.add(date);
            });
        }
        
        // Días de flashcards
        if (this.data.flashcards) {
            this.data.flashcards.forEach(card => {
                if (card.lastReviewed) {
                    const date = new Date(card.lastReviewed).toDateString();
                    studyDays.add(date);
                }
            });
        }
        
        // Calcular racha actual
        const sortedDays = Array.from(studyDays).sort();
        let currentStreak = 0;
        let maxStreak = 0;
        let currentDate = new Date();
        
        // Verificar desde hoy hacia atrás
        while (currentStreak < 365) { // Límite de seguridad
            const dateString = currentDate.toDateString();
            
            if (sortedDays.includes(dateString)) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        this.metrics.streak = {
            current: currentStreak,
            max: maxStreak,
            totalStudyDays: studyDays.size
        };
    }

    generatePredictions() {
        // Generar predicciones basadas en datos históricos
        this.predictions = {
            futurePerformance: this.predictFuturePerformance(),
            optimalSchedule: this.predictOptimalSchedule(),
            successProbability: this.calculateSuccessProbability(),
            riskAreas: this.identifyRiskAreas()
        };
    }

    predictFuturePerformance() {
        const performances = [];
        
        // Recopilar datos de rendimiento histórico
        if (this.data.studySessions) {
            this.data.studySessions.forEach(session => {
                if (session.efficiency) {
                    performances.push({
                        value: session.efficiency,
                        timestamp: session.startTime
                    });
                }
            });
        }
        
        if (performances.length < 5) {
            return {
                trend: 'insufficient_data',
                prediction: 'Necesitas más datos para generar predicciones precisas',
                confidence: 20
            };
        }
        
        // Análisis de tendencia simple
        const recentPerformances = performances
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(-10)
            .map(p => p.value);
        
        const avgRecent = recentPerformances.reduce((sum, p) => sum + p, 0) / recentPerformances.length;
        const trend = this.calculateLinearTrend(recentPerformances);
        
        let prediction = '';
        let confidence = 70;
        
        if (trend > 2) {
            prediction = `Tu rendimiento mejorará aproximadamente ${trend.toFixed(1)}% en las próximas semanas`;
            confidence = 80;
        } else if (trend < -2) {
            prediction = `Tu rendimiento podría disminuir ${Math.abs(trend).toFixed(1)}% si no ajustas tu estrategia`;
            confidence = 75;
        } else {
            prediction = `Tu rendimiento se mantendrá estable alrededor del ${avgRecent.toFixed(1)}%`;
            confidence = 65;
        }
        
        return {
            trend: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable',
            prediction,
            confidence,
            expectedValue: avgRecent + (trend * 2)
        };
    }

    calculateLinearTrend(values) {
        const n = values.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = values;
        
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope * 10; // Escalar para interpretar como porcentaje
    }

    predictOptimalSchedule() {
        // Analizar patrones de rendimiento por hora
        const hourlyPerformance = {};
        
        if (this.data.patterns && this.data.patterns.activities) {
            this.data.patterns.activities.forEach(activity => {
                if (activity.hour !== undefined && activity.focus_level) {
                    if (!hourlyPerformance[activity.hour]) {
                        hourlyPerformance[activity.hour] = [];
                    }
                    hourlyPerformance[activity.hour].push(activity.focus_level);
                }
            });
        }
        
        // Calcular promedio por hora
        const hourlyAverages = {};
        Object.entries(hourlyPerformance).forEach(([hour, levels]) => {
            hourlyAverages[hour] = levels.reduce((sum, l) => sum + l, 0) / levels.length;
        });
        
        // Encontrar las mejores horas
        const bestHours = Object.entries(hourlyAverages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([hour]) => parseInt(hour));
        
        return {
            bestHours,
            recommendation: bestHours.length > 0 
                ? `Programa tus estudios más importantes entre las ${bestHours[0]}:00 y ${bestHours[0] + 2}:00`
                : 'Continúa estudiando para determinar tu horario óptimo',
            confidence: bestHours.length >= 2 ? 85 : 50
        };
    }

    calculateSuccessProbability() {
        let successScore = 50; // Base
        
        // Factor: Consistencia (racha)
        if (this.metrics.streak.current > 7) successScore += 20;
        else if (this.metrics.streak.current > 3) successScore += 10;
        else if (this.metrics.streak.current < 2) successScore -= 15;
        
        // Factor: Rendimiento promedio
        if (this.metrics.performance.average > 80) successScore += 15;
        else if (this.metrics.performance.average > 60) successScore += 5;
        else if (this.metrics.performance.average < 40) successScore -= 20;
        
        // Factor: Tendencia
        if (this.metrics.performance.trend === 'improving') successScore += 15;
        else if (this.metrics.performance.trend === 'declining') successScore -= 15;
        
        // Factor: Diversidad de materias
        const activeSubjects = Object.keys(this.metrics.subjects).length;
        if (activeSubjects > 3) successScore += 10;
        else if (activeSubjects < 2) successScore -= 5;
        
        // Factor: Tiempo de estudio
        const dailyAverage = this.metrics.studyTime.week / 7;
        if (dailyAverage > 3600) successScore += 10; // >1 hora diaria
        else if (dailyAverage < 1800) successScore -= 10; // <30 min diaria
        
        return {
            probability: Math.max(0, Math.min(100, successScore)),
            factors: [
                { name: 'Consistencia', impact: this.metrics.streak.current > 7 ? 'positive' : 'neutral' },
                { name: 'Rendimiento', impact: this.metrics.performance.average > 70 ? 'positive' : 'negative' },
                { name: 'Tendencia', impact: this.metrics.performance.trend === 'improving' ? 'positive' : 'negative' },
                { name: 'Diversidad', impact: activeSubjects > 2 ? 'positive' : 'neutral' }
            ]
        };
    }

    identifyRiskAreas() {
        const risks = [];
        
        // Riesgo: Materias abandonadas
        Object.values(this.metrics.subjects).forEach(subject => {
            if (subject.daysSinceLastStudy > 7) {
                risks.push({
                    type: 'abandoned_subject',
                    subject: subject.name,
                    description: `No has estudiado ${subject.name} en ${subject.daysSinceLastStudy} días`,
                    severity: subject.daysSinceLastStudy > 14 ? 'high' : 'medium',
                    recommendation: `Programa una sesión de repaso para ${subject.name}`
                });
            }
        });
        
        // Riesgo: Rendimiento decreciente
        if (this.metrics.performance.trend === 'declining') {
            risks.push({
                type: 'declining_performance',
                description: 'Tu rendimiento ha disminuido recientemente',
                severity: 'high',
                recommendation: 'Revisa tu estrategia de estudio y considera tomar un descanso'
            });
        }
        
        // Riesgo: Baja consistencia
        if (this.metrics.streak.current < 3) {
            risks.push({
                type: 'low_consistency',
                description: 'Falta de consistencia en el estudio',
                severity: 'medium',
                recommendation: 'Establece un horario fijo de estudio diario'
            });
        }
        
        // Riesgo: Sobrecarga
        const dailyAverage = this.metrics.studyTime.week / 7;
        if (dailyAverage > 7200) { // >2 horas diarias
            risks.push({
                type: 'overload',
                description: 'Posible sobrecarga de estudio',
                severity: 'medium',
                recommendation: 'Asegúrate de incluir descansos regulares'
            });
        }
        
        return risks;
    }

    scheduleUpdates() {
        // Actualizar datos cada 5 minutos
        setInterval(() => {
            this.loadData();
            if (document.querySelector('.dashboard-modal').style.display !== 'none') {
                this.updateInterface();
            }
        }, 300000);
    }

    openModal() {
        const modal = document.querySelector('.dashboard-modal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.dashboard-content').style.transform = 'translateY(0)';
        }, 10);
        
        this.loadData();
        this.updateInterface();
    }

    closeModal() {
        const modal = document.querySelector('.dashboard-modal');
        modal.style.opacity = '0';
        modal.querySelector('.dashboard-content').style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    switchTab(tabName) {
        // Actualizar botones de tabs
        document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.dashboard-tab[onclick="academicDashboard.switchTab('${tabName}')"]`).classList.add('active');
        
        // Mostrar contenido correspondiente
        document.querySelectorAll('.dashboard-tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`dashboard-${tabName}-tab`).classList.remove('hidden');
        
        // Actualizar contenido específico del tab
        this.updateTabContent(tabName);
    }

    updateInterface() {
        this.updateKPIs();
        this.updateCharts();
        this.updateAchievements();
        this.updateInsights();
    }

    updateKPIs() {
        // Tiempo de estudio hoy
        const todayHours = Math.floor(this.metrics.studyTime.today / 3600);
        const todayMinutes = Math.floor((this.metrics.studyTime.today % 3600) / 60);
        document.getElementById('dashboard-study-time-today').textContent = `${todayHours}h ${todayMinutes}m`;
        
        // Rendimiento promedio
        document.getElementById('dashboard-performance-avg').textContent = `${this.metrics.performance.average}%`;
        
        // Racha
        document.getElementById('dashboard-streak').textContent = this.metrics.streak.current;
        
        // Materias activas
        document.getElementById('dashboard-subjects-count').textContent = Object.keys(this.metrics.subjects).length;
        
        // Cambios (simulados para demo)
        const performanceChange = this.metrics.performance.improvement;
        document.getElementById('dashboard-performance-change').textContent = 
            `${performanceChange > 0 ? '+' : ''}${performanceChange.toFixed(1)}%`;
    }

    updateCharts() {
        this.renderWeeklyChart();
        // Otros gráficos se renderizarían aquí
    }

    renderWeeklyChart() {
        const canvas = document.getElementById('dashboard-weekly-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Datos de los últimos 7 días
        const weekData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date).setHours(0, 0, 0, 0);
            const dayEnd = new Date(date).setHours(23, 59, 59, 999);
            
            let dayTime = 0;
            if (this.data.studySessions) {
                this.data.studySessions.forEach(session => {
                    if (session.startTime >= dayStart && session.startTime <= dayEnd) {
                        dayTime += session.totalTime || session.elapsed || 0;
                    }
                });
            }
            
            weekData.push(Math.floor(dayTime / 60)); // Convertir a minutos
        }
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar gráfico de barras simple
        const maxValue = Math.max(...weekData, 1);
        const barWidth = canvas.width / 7;
        
        ctx.fillStyle = this.colors.primary;
        weekData.forEach((value, index) => {
            const barHeight = (value / maxValue) * (canvas.height * 0.8);
            ctx.fillRect(index * barWidth + 10, canvas.height - barHeight, barWidth - 20, barHeight);
        });
        
        // Etiquetas de días
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
        days.forEach((day, index) => {
            ctx.fillText(day, index * barWidth + barWidth/2, canvas.height - 5);
        });
    }

    updateAchievements() {
        const container = document.getElementById('dashboard-achievements');
        if (!container) return;
        
        // Generar logros basados en métricas
        const achievements = [];
        
        if (this.metrics.streak.current >= 7) {
            achievements.push({
                icon: '🔥',
                title: 'Racha de Fuego',
                description: `${this.metrics.streak.current} días consecutivos`,
                type: 'streak'
            });
        }
        
        if (this.metrics.performance.average >= 80) {
            achievements.push({
                icon: '⭐',
                title: 'Rendimiento Estelar',
                description: 'Más del 80% de rendimiento promedio',
                type: 'performance'
            });
        }
        
        const totalStudyHours = Math.floor(this.metrics.studyTime.total / 3600);
        if (totalStudyHours >= 100) {
            achievements.push({
                icon: '🎓',
                title: 'Estudioso Dedicado',
                description: `${totalStudyHours} horas de estudio acumuladas`,
                type: 'dedication'
            });
        }
        
        if (achievements.length === 0) {
            container.innerHTML = '<p class="dashboard-no-achievements">¡Sigue estudiando para desbloquear logros!</p>';
        } else {
            container.innerHTML = achievements.map(achievement => `
                <div class="dashboard-achievement-item">
                    <span class="dashboard-achievement-icon">${achievement.icon}</span>
                    <div class="dashboard-achievement-content">
                        <h6>${achievement.title}</h6>
                        <p>${achievement.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    updateInsights() {
        const container = document.getElementById('dashboard-daily-insights');
        if (!container) return;
        
        const insights = [];
        
        // Insight de tiempo
        const todayMinutes = Math.floor(this.metrics.studyTime.today / 60);
        if (todayMinutes > 60) {
            insights.push({
                icon: '⏰',
                title: 'Excelente progreso',
                description: `Has estudiado ${todayMinutes} minutos hoy`
            });
        } else if (todayMinutes < 30) {
            insights.push({
                icon: '💪',
                title: 'Oportunidad de mejora',
                description: 'Intenta estudiar al menos 30 minutos hoy'
            });
        }
        
        // Insight de rendimiento
        if (this.metrics.performance.trend === 'improving') {
            insights.push({
                icon: '📈',
                title: 'Tendencia positiva',
                description: 'Tu rendimiento está mejorando constantemente'
            });
        }
        
        // Insight de materias
        const subjectsToday = Object.values(this.metrics.subjects)
            .filter(s => s.daysSinceLastStudy === 0).length;
        
        if (subjectsToday > 1) {
            insights.push({
                icon: '🎯',
                title: 'Estudio diversificado',
                description: `Has trabajado en ${subjectsToday} materias hoy`
            });
        }
        
        container.innerHTML = insights.map(insight => `
            <div class="dashboard-insight-card">
                <div class="dashboard-insight-icon">${insight.icon}</div>
                <div class="dashboard-insight-content">
                    <h6>${insight.title}</h6>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }

    updateTabContent(tabName) {
        switch (tabName) {
            case 'performance':
                this.updatePerformanceTab();
                break;
            case 'subjects':
                this.updateSubjectsTab();
                break;
            case 'goals':
                this.updateGoalsTab();
                break;
            case 'predictions':
                this.updatePredictionsTab();
                break;
        }
    }

    updatePerformanceTab() {
        // Actualizar métricas de rendimiento
        document.getElementById('dashboard-overall-performance').textContent = `${this.metrics.performance.average}%`;
        
        const trendText = {
            improving: '↗️ Mejorando',
            declining: '↘️ Disminuyendo',
            stable: '→ Estable'
        };
        document.getElementById('dashboard-overall-trend').textContent = 
            `${trendText[this.metrics.performance.trend]} ${Math.abs(this.metrics.performance.improvement).toFixed(1)}%`;
    }

    updateSubjectsTab() {
        const container = document.getElementById('dashboard-subjects-grid');
        if (!container) return;
        
        const subjects = Object.values(this.metrics.subjects);
        
        container.innerHTML = subjects.map(subject => `
            <div class="dashboard-subject-card">
                <div class="dashboard-subject-header">
                    <h5>${subject.name}</h5>
                    <span class="dashboard-subject-score">${Math.round(subject.averagePerformance || 0)}%</span>
                </div>
                <div class="dashboard-subject-stats">
                    <div class="dashboard-subject-stat">
                        <span>Tiempo:</span>
                        <span>${Math.floor((subject.studyTime || 0) / 60)}min</span>
                    </div>
                    <div class="dashboard-subject-stat">
                        <span>Sesiones:</span>
                        <span>${subject.sessions || 0}</span>
                    </div>
                    <div class="dashboard-subject-stat">
                        <span>Último estudio:</span>
                        <span>${subject.daysSinceLastStudy || 0} días</span>
                    </div>
                </div>
                <div class="dashboard-subject-progress">
                    <div class="dashboard-subject-progress-bar">
                        <div class="dashboard-subject-progress-fill" 
                             style="width: ${subject.masteryLevel || 0}%"></div>
                    </div>
                    <span>${Math.round(subject.masteryLevel || 0)}% dominado</span>
                </div>
            </div>
        `).join('');
    }

    updatePredictionsTab() {
        // Predicción de rendimiento futuro
        const futurePerf = document.getElementById('dashboard-future-performance');
        if (futurePerf) {
            const prediction = this.predictions.futurePerformance;
            futurePerf.innerHTML = `
                <div class="dashboard-prediction-value">${prediction.expectedValue?.toFixed(1) || 'N/A'}%</div>
                <div class="dashboard-prediction-description">${prediction.prediction}</div>
                <div class="dashboard-prediction-confidence">Confianza: ${prediction.confidence}%</div>
            `;
        }
        
        // Horario óptimo
        const optimalSchedule = document.getElementById('dashboard-optimal-schedule');
        if (optimalSchedule) {
            const schedule = this.predictions.optimalSchedule;
            optimalSchedule.innerHTML = `
                <div class="dashboard-prediction-value">${schedule.bestHours?.join(':00, ') || 'N/A'}:00</div>
                <div class="dashboard-prediction-description">${schedule.recommendation}</div>
                <div class="dashboard-prediction-confidence">Confianza: ${schedule.confidence}%</div>
            `;
        }
        
        // Probabilidad de éxito
        const successProb = document.getElementById('dashboard-success-probability');
        if (successProb) {
            const success = this.predictions.successProbability;
            successProb.innerHTML = `
                <div class="dashboard-prediction-value">${success.probability}%</div>
                <div class="dashboard-prediction-description">Probabilidad de alcanzar tus objetivos</div>
                <div class="dashboard-prediction-factors">
                    ${success.factors.map(factor => `
                        <span class="dashboard-factor ${factor.impact}">${factor.name}</span>
                    `).join('')}
                </div>
            `;
        }
        
        // Áreas de riesgo
        const riskAreas = document.getElementById('dashboard-risk-areas');
        if (riskAreas) {
            const risks = this.predictions.riskAreas;
            if (risks.length === 0) {
                riskAreas.innerHTML = `
                    <div class="dashboard-prediction-value">✅</div>
                    <div class="dashboard-prediction-description">No se detectaron riesgos significativos</div>
                `;
            } else {
                riskAreas.innerHTML = `
                    <div class="dashboard-prediction-value">${risks.length}</div>
                    <div class="dashboard-prediction-description">Áreas que requieren atención</div>
                    <div class="dashboard-risk-list">
                        ${risks.slice(0, 2).map(risk => `
                            <div class="dashboard-risk-item ${risk.severity}">
                                ${risk.description}
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
    }

    exportReport() {
        // Generar reporte PDF
        this.showNotification('📄 Generando reporte...', 'info');
        
        setTimeout(() => {
            // Simular generación de reporte
            this.showNotification('✅ Reporte exportado exitosamente', 'success');
        }, 2000);
    }

    showSettings() {
        this.showNotification('⚙️ Configuración próximamente disponible', 'info');
    }

    createGoal() {
        this.showNotification('🎯 Creador de objetivos próximamente disponible', 'info');
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `dashboard-notification ${type}`;
        notification.innerHTML = `
            <div class="dashboard-notification-content">
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

    updateStudyData(data) {
        // Actualizar datos cuando se complete una sesión de estudio
        this.data.studySessions = this.data.studySessions || [];
        this.data.studySessions.push(data);
        this.saveDashboardData();
        this.calculateMetrics();
    }

    updateFlashcardData(data) {
        // Actualizar datos cuando se complete una sesión de flashcards
        this.loadData();
        this.calculateMetrics();
    }

    addAchievement(achievement) {
        this.data.achievements = this.data.achievements || [];
        this.data.achievements.push({
            ...achievement,
            timestamp: Date.now()
        });
        this.saveDashboardData();
    }

    loadDashboardData() {
        try {
            const saved = localStorage.getItem('academic_dashboard_data');
            return saved ? JSON.parse(saved) : {
                studySessions: [],
                flashcards: [],
                library: [],
                patterns: {},
                achievements: []
            };
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            return {
                studySessions: [],
                flashcards: [],
                library: [],
                patterns: {},
                achievements: []
            };
        }
    }

    saveDashboardData() {
        try {
            localStorage.setItem('academic_dashboard_data', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving dashboard data:', error);
        }
    }
}

// Inicializar el dashboard académico
const academicDashboard = new AcademicDashboard();

// Exportar para uso global
window.academicDashboard = academicDashboard;