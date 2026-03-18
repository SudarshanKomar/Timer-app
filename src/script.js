// Pomodoro Timer Application
class PomodoroTimer {
    constructor() {
        this.workDuration = 25;
        this.shortBreakDuration = 5;
        this.longBreakDuration = 15;
        this.sessionsUntilLongBreak = 4;
        
        this.currentSession = 'work';
        this.completedSessions = 0;
        this.timeRemaining = this.workDuration * 60;
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.startDateTime();
    }

    initializeElements() {
        this.elements = {
            timer: document.getElementById('timer'),
            sessionType: document.getElementById('session-type'),
            sessionCount: document.getElementById('session-count'),
            startBtn: document.getElementById('start-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            resetBtn: document.getElementById('reset-btn'),
            workDuration: document.getElementById('work-duration'),
            shortBreak: document.getElementById('short-break'),
            longBreak: document.getElementById('long-break'),
            sessionsUntilLong: document.getElementById('sessions-until-long'),
            applySettings: document.getElementById('apply-settings'),
            datetime: document.getElementById('datetime')
        };
    }

    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => this.start());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        this.elements.applySettings.addEventListener('click', () => this.applySettings());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.isRunning ? this.pause() : this.start();
            } else if (e.code === 'KeyR') {
                this.reset();
            }
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.elements.startBtn.disabled = true;
            this.elements.pauseBtn.disabled = false;
            
            this.intervalId = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.elements.startBtn.disabled = false;
            this.elements.pauseBtn.disabled = true;
            
            clearInterval(this.intervalId);
        }
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.intervalId);
        
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        
        this.setTimeForCurrentSession();
        this.updateDisplay();
    }

    tick() {
        this.timeRemaining--;
        
        if (this.timeRemaining <= 0) {
            this.sessionComplete();
        } else {
            this.updateDisplay();
        }
    }

    sessionComplete() {
        this.playNotificationSound();
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        
        if (this.currentSession === 'work') {
            this.completedSessions++;
            this.nextSession();
        } else {
            this.currentSession = 'work';
            this.setTimeForCurrentSession();
        }
        
        this.updateDisplay();
        this.showNotification();
    }

    nextSession() {
        if (this.completedSessions % this.sessionsUntilLongBreak === 0) {
            this.currentSession = 'longBreak';
        } else {
            this.currentSession = 'shortBreak';
        }
        this.setTimeForCurrentSession();
    }

    setTimeForCurrentSession() {
        switch (this.currentSession) {
            case 'work':
                this.timeRemaining = this.workDuration * 60;
                break;
            case 'shortBreak':
                this.timeRemaining = this.shortBreakDuration * 60;
                break;
            case 'longBreak':
                this.timeRemaining = this.longBreakDuration * 60;
                break;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.elements.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.elements.sessionType.textContent = this.getSessionDisplayName();
        this.elements.sessionCount.textContent = this.getSessionCountText();
        
        // Update session type color
        this.elements.sessionType.className = 'session-type';
        if (this.currentSession === 'work') {
            this.elements.sessionType.style.color = '#f39c12';
        } else if (this.currentSession === 'shortBreak') {
            this.elements.sessionType.style.color = '#3498db';
        } else {
            this.elements.sessionType.style.color = '#9b59b6';
        }
    }

    getSessionDisplayName() {
        switch (this.currentSession) {
            case 'work':
                return 'Work';
            case 'shortBreak':
                return 'Short Break';
            case 'longBreak':
                return 'Long Break';
            default:
                return 'Work';
        }
    }

    getSessionCountText() {
        if (this.currentSession === 'work') {
            const currentWorkSession = this.completedSessions + 1;
            const sessionsInCycle = (currentWorkSession - 1) % this.sessionsUntilLongBreak + 1;
            return `Session ${sessionsInCycle} of ${this.sessionsUntilLongBreak}`;
        } else {
            return `${this.completedSessions} work sessions completed`;
        }
    }

    applySettings() {
        const newWorkDuration = parseInt(this.elements.workDuration.value);
        const newShortBreak = parseInt(this.elements.shortBreak.value);
        const newLongBreak = parseInt(this.elements.longBreak.value);
        const newSessionsUntilLong = parseInt(this.elements.sessionsUntilLong.value);
        
        if (newWorkDuration > 0 && newWorkDuration <= 60 &&
            newShortBreak > 0 && newShortBreak <= 30 &&
            newLongBreak > 0 && newLongBreak <= 60 &&
            newSessionsUntilLong >= 2 && newSessionsUntilLong <= 10) {
            
            this.workDuration = newWorkDuration;
            this.shortBreakDuration = newShortBreak;
            this.longBreakDuration = newLongBreak;
            this.sessionsUntilLongBreak = newSessionsUntilLong;
            
            if (!this.isRunning) {
                this.setTimeForCurrentSession();
                this.updateDisplay();
            }
            
            this.showSettingsAppliedNotification();
        }
    }

    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    showNotification() {
        const sessionName = this.getSessionDisplayName();
        const message = this.currentSession === 'work' 
            ? 'Time to get back to work!' 
            : 'Time for a break!';
        
        // Browser notification if permitted
        if (Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: `${sessionName} completed! ${message}`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23f39c12"/></svg>'
            });
        }
        
        // Visual feedback
        this.elements.timer.style.animation = 'pulse 1s ease-in-out 3';
        setTimeout(() => {
            this.elements.timer.style.animation = '';
        }, 3000);
    }

    showSettingsAppliedNotification() {
        const originalText = this.elements.applySettings.textContent;
        this.elements.applySettings.textContent = 'Settings Applied!';
        this.elements.applySettings.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        
        setTimeout(() => {
            this.elements.applySettings.textContent = originalText;
            this.elements.applySettings.style.background = '';
        }, 2000);
    }

    startDateTime() {
        const updateDateTime = () => {
            const now = new Date();
            const options = { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            this.elements.datetime.textContent = now.toLocaleDateString('en-US', options);
        };
        
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Initialize the timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
