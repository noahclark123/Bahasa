// Bahasa Indonesia Course Interactive Elements
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize progress tracking system
    initializeProgressTracking();
    
    // Initialize gamification features
    // initializeGamification(); // Disabled per user request
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to lesson cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe lesson cards
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach(card => {
        observer.observe(card);
    });

    // Interactive code examples
    const codeExamples = document.querySelectorAll('.code-example');
    codeExamples.forEach(example => {
        // Add copy button to code examples
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-button';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        `;
        
        copyButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        copyButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        copyButton.addEventListener('click', function() {
            const code = example.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = 'Copy';
                    }, 2000);
                });
            }
        });
        
        example.style.position = 'relative';
        example.appendChild(copyButton);
    });

    // Interactive demo functionality
    const interactiveDemos = document.querySelectorAll('.interactive-demo');
    interactiveDemos.forEach(demo => {
        // Add "Try it yourself" button
        const tryButton = document.createElement('button');
        tryButton.textContent = 'Try it yourself';
        tryButton.className = 'try-button';
        tryButton.style.cssText = `
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            transition: all 0.2s ease;
        `;
        
        tryButton.addEventListener('mouseenter', function() {
            this.style.background = 'var(--primary-dark)';
        });
        
        tryButton.addEventListener('mouseleave', function() {
            this.style.background = 'var(--primary-color)';
        });
        
        tryButton.addEventListener('click', function() {
            // Open CodePen with the example
            const code = demo.querySelector('code');
            if (code) {
                const encodedCode = encodeURIComponent(code.textContent);
                const codepenUrl = `https://codepen.io/pen/?template=${encodedCode}`;
                window.open(codepenUrl, '_blank');
            }
        });
        
        demo.appendChild(tryButton);
    });

    // Progress tracking
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    // Update progress bar on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Lesson completion tracking
    const lessonLinks = document.querySelectorAll('.lesson-link');
    lessonLinks.forEach(link => {
        link.addEventListener('click', function() {
            const lessonCard = this.closest('.lesson-card');
            const lessonNumber = lessonCard.dataset.lesson;
            
            // Mark lesson as started
            localStorage.setItem(`lesson-${lessonNumber}-started`, 'true');
            updateLessonStatus(lessonNumber, 'started');
            
            // Points system disabled per user request
        });
    });

    // Mark lessons as completed when user reaches the end
    const lessonNavigations = document.querySelectorAll('.lesson-navigation');
    lessonNavigations.forEach(nav => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentLesson = window.location.pathname.match(/lesson-(\d+)/);
                    if (currentLesson) {
                        const lessonNumber = currentLesson[1];
                        localStorage.setItem(`lesson-${lessonNumber}`, 'completed');
                        updateLessonStatus(lessonNumber, 'completed');
                        
                        // Points system disabled per user request
                        
                        // Check for achievements
                        checkAchievements();
                    }
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(nav);
    });

    // Update course progress
    function updateProgress() {
        const totalLessons = 5;
        let completedLessons = 0;
        let startedLessons = 0;
        
        for (let i = 1; i <= totalLessons; i++) {
            if (localStorage.getItem(`lesson-${i}`) === 'completed') {
                completedLessons++;
            } else if (localStorage.getItem(`lesson-${i}-started`) === 'true') {
                startedLessons++;
            }
        }
        
        const progressPercent = (completedLessons / totalLessons) * 100;
        
        // Update progress in course overview if on main page
        const progressElement = document.querySelector('.course-progress');
        if (progressElement) {
            progressElement.textContent = `${completedLessons}/${totalLessons} lessons completed`;
        }
        
        // Update progress overview
        updateProgressOverview(completedLessons, totalLessons, progressPercent);
    }

    // Initialize progress on page load
    updateProgress();

    // Search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search lessons...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        margin-bottom: 20px;
        font-size: 14px;
    `;

    // Add search to lessons section if it exists
    const lessonsSection = document.querySelector('.lessons');
    if (lessonsSection) {
        const container = lessonsSection.querySelector('.container');
        const title = container.querySelector('h2');
        title.parentNode.insertBefore(searchInput, title.nextSibling);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const lessonCards = document.querySelectorAll('.lesson-card');
            
            lessonCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const topics = Array.from(card.querySelectorAll('.lesson-topics li')).map(li => li.textContent.toLowerCase());
                
                const matches = title.includes(searchTerm) || 
                              description.includes(searchTerm) || 
                              topics.some(topic => topic.includes(searchTerm));
                
                card.style.display = matches ? 'block' : 'none';
            });
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.createElement('button');
    darkModeToggle.textContent = '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--primary-color);
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    document.body.appendChild(darkModeToggle);

    // Add dark mode styles
    const darkModeStyles = document.createElement('style');
    darkModeStyles.textContent = `
        .dark-mode {
            --bg-primary: #1e293b;
            --bg-secondary: #334155;
            --text-primary: #f1f5f9;
            --text-secondary: #cbd5e1;
            --text-light: #94a3b8;
            --border-color: #475569;
        }
        
        .dark-mode .lesson-card,
        .dark-mode .resource-card {
            background: var(--bg-secondary);
            border-color: var(--border-color);
        }
        
        .dark-mode .code-example {
            background: #0f172a;
        }
        
        .dark-mode .interactive-demo {
            background: var(--bg-secondary);
            border-color: var(--border-color);
        }
        
        .dark-mode .demo-result {
            background: var(--bg-primary);
            border-color: var(--border-color);
        }
    `;
    document.head.appendChild(darkModeStyles);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('.search-input');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    });

    // Add keyboard shortcuts help
    const shortcutsHelp = document.createElement('div');
    shortcutsHelp.className = 'shortcuts-help';
    shortcutsHelp.innerHTML = `
        <div style="position: fixed; bottom: 80px; right: 20px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 15px; box-shadow: var(--shadow-lg); z-index: 1000; max-width: 250px; font-size: 12px;">
            <h4 style="margin-bottom: 10px; color: var(--primary-color);">Keyboard Shortcuts</h4>
            <div style="margin-bottom: 5px;"><kbd>Ctrl/Cmd + K</kbd> - Search lessons</div>
            <div style="margin-bottom: 5px;"><kbd>Esc</kbd> - Clear search</div>
            <div><kbd>Click 🌙</kbd> - Toggle dark mode</div>
        </div>
    `;
    
    // Show shortcuts help on first visit
    if (!localStorage.getItem('shortcutsShown')) {
        document.body.appendChild(shortcutsHelp);
        setTimeout(() => {
            shortcutsHelp.remove();
            localStorage.setItem('shortcutsShown', 'true');
        }, 5000);
    }

    // Add kbd styling
    const kbdStyles = document.createElement('style');
    kbdStyles.textContent = `
        kbd {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 3px;
            padding: 2px 6px;
            font-size: 11px;
            font-family: monospace;
        }
    `;
    document.head.appendChild(kbdStyles);
});

// Progress Tracking System
function initializeProgressTracking() {
    // Show progress overview if user has started any lessons
    const hasProgress = Array.from({length: 5}, (_, i) => i + 1).some(i => 
        localStorage.getItem(`lesson-${i}-started`) === 'true' || 
        localStorage.getItem(`lesson-${i}`) === 'completed'
    );
    
    if (hasProgress) {
        const progressOverview = document.getElementById('progress-overview');
        if (progressOverview) {
            progressOverview.style.display = 'block';
        }
    }
}

function updateLessonStatus(lessonNumber, status) {
    const statusElement = document.getElementById(`lesson-status-${lessonNumber}`);
    const progressFill = document.getElementById(`mini-progress-${lessonNumber}`);
    const progressText = document.getElementById(`mini-progress-text-${lessonNumber}`);
    
    if (statusElement) {
        statusElement.className = `lesson-status ${status}`;
        
        if (status === 'started') {
            statusElement.querySelector('.status-icon').textContent = '📖';
            statusElement.querySelector('.status-text').textContent = 'In Progress';
            if (progressFill) progressFill.style.width = '50%';
            if (progressText) progressText.textContent = '50%';
        } else if (status === 'completed') {
            statusElement.querySelector('.status-icon').textContent = '✅';
            statusElement.querySelector('.status-text').textContent = 'Completed';
            if (progressFill) progressFill.style.width = '100%';
            if (progressText) progressText.textContent = '100%';
        }
    }
    
    updateProgress();
}

function updateProgressOverview(completedLessons, totalLessons, progressPercent) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const achievementCount = document.getElementById('achievement-count');
    
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${progressPercent.toFixed(0)}% Complete`;
    }
    
    if (achievementCount) {
        const achievements = getAchievementCount();
        achievementCount.textContent = `${achievements} Achievements`;
    }
}

// Gamification System - Disabled per user request

function checkAchievements() {
    const achievements = [];
    const completedLessons = Array.from({length: 5}, (_, i) => i + 1).filter(i => 
        localStorage.getItem(`lesson-${i}`) === 'completed'
    ).length;
    
    // First lesson achievement
    if (completedLessons >= 1 && !localStorage.getItem('achievement-first-lesson')) {
        achievements.push({
            icon: '🎯',
            title: 'First Steps',
            description: 'Completed your first lesson!'
        });
        localStorage.setItem('achievement-first-lesson', 'true');
    }
    
    // Halfway achievement
    if (completedLessons >= 3 && !localStorage.getItem('achievement-halfway')) {
        achievements.push({
            icon: '🚀',
            title: 'Halfway Hero',
            description: 'Completed 3 lessons!'
        });
        localStorage.setItem('achievement-halfway', 'true');
    }
    
    // Course completion achievement
    if (completedLessons >= 5 && !localStorage.getItem('achievement-complete')) {
        achievements.push({
            icon: '🏆',
            title: 'Course Master',
            description: 'Completed all lessons!'
        });
        localStorage.setItem('achievement-complete', 'true');
    }
    
    // Show achievements
    achievements.forEach(achievement => {
        showAchievement(achievement);
    });
}

function showAchievement(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <h3>${achievement.title}</h3>
        <p>${achievement.description}</p>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

function getAchievementCount() {
    return [
        'achievement-first-lesson',
        'achievement-halfway',
        'achievement-complete'
    ].filter(achievement => localStorage.getItem(achievement) === 'true').length;
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : type === 'error' ? '#ef4444' : 'var(--secondary-color)'};
        color: white;
        padding: 15px 20px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);
