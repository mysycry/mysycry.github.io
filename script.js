// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mouse tracking for dark mode glow effect on cards
const cards = document.querySelectorAll('.card');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update each card's mouse position
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardMouseX = mouseX - rect.left;
        const cardMouseY = mouseY - rect.top;
        
        // Only update if mouse is over or near the card
        if (cardMouseX >= -100 && cardMouseX <= rect.width + 100 &&
            cardMouseY >= -100 && cardMouseY <= rect.height + 100) {
            card.style.setProperty('--card-mouse-x', `${cardMouseX}px`);
            card.style.setProperty('--card-mouse-y', `${cardMouseY}px`);
        }
    });
});

// Meteor spawning for dark mode - inside cards
function createCardMeteor() {
    if (html.getAttribute('data-theme') !== 'dark') return;
    
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return;
    
    // Pick a random card
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    
    // Create meteor inside the card
    const meteor = document.createElement('div');
    meteor.className = 'card-meteor';
    
    // Random starting position within card
    const startX = Math.random() * 100; // percentage
    const startY = -10; // start above card
    
    meteor.style.left = `${startX}%`;
    meteor.style.top = `${startY}%`;
    
    // Random animation duration between 2-4 seconds
    const duration = 2 + Math.random() * 2;
    meteor.style.animationDuration = `${duration}s`;
    
    // Random scale for variety
    const scale = 0.5 + Math.random() * 0.5;
    meteor.style.transform = `rotate(-45deg) scale(${scale})`;
    
    randomCard.appendChild(meteor);
    
    // Remove meteor after animation
    setTimeout(() => {
        meteor.remove();
    }, duration * 1000);
}

// Light mode - floating golden particles
function createLightParticle() {
    if (html.getAttribute('data-theme') === 'dark') return;
    
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return;
    
    // Pick a random card
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    
    // Create floating particle
    const particle = document.createElement('div');
    particle.className = 'light-particle';
    
    // Random starting position
    const startX = Math.random() * 100;
    const startY = 100 + Math.random() * 20;
    
    particle.style.left = `${startX}%`;
    particle.style.top = `${startY}%`;
    
    // Random size
    const size = 3 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random animation duration
    const duration = 3 + Math.random() * 3;
    particle.style.animationDuration = `${duration}s`;
    
    randomCard.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// Spawn meteors periodically (every 2-3 seconds) for dark mode
setInterval(createCardMeteor, 2500);

// Spawn particles for light mode (every 1.5-2 seconds)
setInterval(createLightParticle, 1800);

// Create initial batch of meteors
for (let i = 0; i < 8; i++) {
    setTimeout(createCardMeteor, i * 400);
}

// Create initial batch of light particles
for (let i = 0; i < 10; i++) {
    setTimeout(createLightParticle, i * 300);
}

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and panels
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Horizontal Carousel Class with Infinite Looping
class Carousel {
    constructor(wrapperId, trackId, prevBtnId, nextBtnId, dotsId) {
        this.wrapper = document.getElementById(wrapperId);
        this.track = document.getElementById(trackId);
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
        this.dotsContainer = document.getElementById(dotsId);

        if (!this.wrapper || !this.track) return;

        this.cards = Array.from(this.track.querySelectorAll(':scope > .carousel-card, :scope > .skills-carousel-card'));
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isAnimating = false;
        this.cardWidth = 0;

        this.init();
    }

    init() {
        this.setupInfiniteScroll();
        this.createDots();
        this.addEventListeners();
        this.updateDots();
        this.updateButtonVisibility();
    }

    setupInfiniteScroll() {
        // Clone first and last cards for infinite looping
        if (this.cards.length > 1) {
            const firstCard = this.cards[0].cloneNode(true);
            firstCard.setAttribute('data-cloned', 'true');
            firstCard.style.pointerEvents = 'none';
            
            const lastCard = this.cards[this.cards.length - 1].cloneNode(true);
            lastCard.setAttribute('data-cloned', 'true');
            lastCard.style.pointerEvents = 'none';

            this.track.appendChild(firstCard);
            this.track.insertBefore(lastCard, this.track.firstChild);

            // Update cards reference
            this.cards = this.track.querySelectorAll(':scope > .carousel-card:not([data-cloned]), :scope > .skills-carousel-card:not([data-cloned])');
            
            // Start at index 1 (after the cloned last card)
            this.currentIndex = 1;
            
            // Set initial scroll position without animation
            this.track.scrollLeft = this.currentIndex * this.track.clientWidth;
        }
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    }

    updateDots() {
        if (!this.dots) return;

        // Calculate actual index (excluding cloned cards)
        let actualIndex = this.currentIndex;
        const totalCards = this.cards.length;
        
        if (this.currentIndex === 0) {
            actualIndex = totalCards - 1; // Last card
        } else if (this.currentIndex === totalCards + 1) {
            actualIndex = 0; // First card
        } else {
            actualIndex = this.currentIndex - 1;
        }

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === actualIndex);
        });
    }

    goToSlide(index, instant = false) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        const targetIndex = index + 1; // Account for cloned first card
        const cardWidth = this.track.clientWidth;
        
        this.track.scrollTo({
            left: targetIndex * cardWidth,
            behavior: instant ? 'auto' : 'smooth'
        });

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);

        this.updateDots();
        this.updateButtonVisibility();
    }

    scrollToCurrent() {
        if (!this.track) return;

        const cardWidth = this.track.clientWidth;
        this.track.scrollTo({
            left: this.currentIndex * cardWidth,
            behavior: 'smooth'
        });
    }

    handleInfiniteLoop() {
        const totalCards = this.cards.length;
        const cardWidth = this.track.clientWidth;

        // If at cloned first card (index 0), jump to real last card
        if (this.currentIndex === 0) {
            this.track.scrollLeft = totalCards * cardWidth;
            this.currentIndex = totalCards;
            this.updateDots();
            this.updateButtonVisibility();
        }
        // If at cloned last card (index totalCards + 1), jump to real first card
        else if (this.currentIndex === totalCards + 1) {
            this.track.scrollLeft = cardWidth;
            this.currentIndex = 1;
            this.updateDots();
            this.updateButtonVisibility();
        }
    }

    next() {
        if (this.isAnimating) return;
        const totalCards = this.cards.length;
        if (this.currentIndex >= totalCards + 1) {
            this.currentIndex = 1;
        } else {
            this.currentIndex++;
        }
        this.scrollToCurrent();
        this.updateDots();
        this.updateButtonVisibility();
    }

    prev() {
        if (this.isAnimating) return;
        const totalCards = this.cards.length;
        if (this.currentIndex <= 0) {
            this.currentIndex = totalCards;
        } else {
            this.currentIndex--;
        }
        this.scrollToCurrent();
        this.updateDots();
        this.updateButtonVisibility();
    }

    updateButtonVisibility() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        // Always show buttons for infinite scroll
        this.prevBtn.style.opacity = '1';
        this.nextBtn.style.opacity = '1';
    }

    addEventListeners() {
        // Button clicks
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Touch events for swipe with improved mobile experience
        let touchStartTime = 0;
        let touchStartY = 0;

        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            this.track.style.scrollSnapType = 'none'; // Disable snap during swipe
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            if (!this.touchEndX) return;

            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = this.touchStartX - this.touchEndX;
            const deltaY = Math.abs(touchEndY - touchStartY);

            // Only process horizontal swipes
            if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 30) {
                const totalCards = this.cards.length;
                const cardWidth = this.track.clientWidth;

                if (deltaX > 0) {
                    // Swiped left - next
                    if (this.currentIndex < totalCards + 1) {
                        this.currentIndex++;
                        this.scrollToCurrent();
                    }
                } else {
                    // Swiped right - prev
                    if (this.currentIndex > 0) {
                        this.currentIndex--;
                        this.scrollToCurrent();
                    }
                }
                
                this.updateDots();
                this.updateButtonVisibility();
            }

            // Re-enable snap after swipe
            setTimeout(() => {
                this.track.style.scrollSnapType = 'x mandatory';
            }, 100);

            this.touchEndX = 0;
        }, { passive: true });

        // Update current index on scroll and handle infinite loop
        let scrollTimeout;
        this.track.addEventListener('scroll', () => {
            if (this.isAnimating) return;

            const cardWidth = this.track.clientWidth;
            const scrollLeft = this.track.scrollLeft;
            const newIndex = Math.round(scrollLeft / cardWidth);

            if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex <= this.cards.length + 1) {
                this.currentIndex = newIndex;
                this.updateDots();
                this.updateButtonVisibility();
                
                // Handle infinite loop after scroll ends
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.handleInfiniteLoop();
                }, 150);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const cardWidth = this.track.clientWidth;
            this.track.scrollLeft = this.currentIndex * cardWidth;
        });
    }
}

// Initialize Carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Skills Carousel
    new Carousel('skillsCarouselWrapper', 'skillsCarousel', 'skillsPrev', 'skillsNext', 'skillsDots');

    // Experience Carousel
    new Carousel('experienceCarouselWrapper', 'experienceCarousel', 'expPrev', 'expNext', 'experienceDots');

    // Projects Carousel
    new Carousel('projectsCarouselWrapper', 'projectsCarousel', 'projectsPrev', 'projectsNext', 'projectsDots');
});

// Snake Game - Enhanced Version
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startGame');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const speedEl = document.getElementById('speed');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let gameRunning = false;
let baseSpeed = 150; // Starting speed (slower)
let currentSpeed = baseSpeed;
let snakeLength = 1;

highScoreEl.textContent = highScore;

// Get colors from CSS variables
function getColors() {
    const style = getComputedStyle(document.documentElement);
    return {
        snake: style.getPropertyValue('--primary').trim() || '#6366f1',
        snakeHead: style.getPropertyValue('--primary-dark').trim() || '#4f46e5',
        snakeBorder: style.getPropertyValue('--primary-light').trim() || '#818cf8',
        food: style.getPropertyValue('--secondary').trim() || '#ec4899',
        bg: style.getPropertyValue('--bg-secondary').trim() || '#f8fafc',
        grid: style.getPropertyValue('--border').trim() || '#e2e8f0'
    };
}

function initGame() {
    snake = [
        { x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }
    ];
    direction = { x: 0, y: 0 };
    nextDirection = { x: 1, y: 0 }; // Start moving right
    score = 0;
    snakeLength = 1;
    currentSpeed = baseSpeed;
    scoreEl.textContent = score;
    speedEl.textContent = '1x';
    placeFood();
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function draw() {
    const colors = getColors();
    
    // Clear canvas
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw food with glow effect
    ctx.fillStyle = colors.food;
    ctx.shadowColor = colors.food;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw snake
    snake.forEach((segment, index) => {
        const isHead = index === 0;
        
        // Gradient effect for snake body
        const gradient = ctx.createRadialGradient(
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            0,
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            gridSize / 2
        );
        
        if (isHead) {
            gradient.addColorStop(0, colors.snakeHead);
            gradient.addColorStop(1, colors.snake);
        } else {
            // Body gets slightly darker towards the tail
            const darkness = index / snake.length;
            const r = Math.max(50, 99 - darkness * 30);
            const g = Math.max(50, 102 - darkness * 30);
            const b = Math.max(100, 241 - darkness * 50);
            gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
            gradient.addColorStop(1, `rgb(${Math.max(30, r - 30)}, ${Math.max(30, g - 30)}, ${Math.max(80, b - 50)})`);
        }
        
        ctx.fillStyle = gradient;
        
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        
        // Rounded rectangle for snake segments
        const radius = isHead ? 8 : 6;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, gridSize - 2, gridSize - 2, radius);
        ctx.fill();
        
        // Add border to segments
        ctx.strokeStyle = colors.snakeBorder;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw eyes on head
        if (isHead) {
            ctx.fillStyle = 'white';
            const eyeSize = 4;
            const eyeOffset = 5;
            
            if (direction.x !== 0 || direction.y !== 0) {
                if (direction.x === 1) { // Right
                    ctx.beginPath();
                    ctx.arc(x + gridSize - eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + gridSize - eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (direction.x === -1) { // Left
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (direction.y === -1) { // Up
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + gridSize - eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else { // Down
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + gridSize - eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Default eyes (not moving)
                ctx.beginPath();
                ctx.arc(x + gridSize - eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                ctx.arc(x + gridSize - eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

function update() {
    direction = { ...nextDirection };
    
    if (direction.x === 0 && direction.y === 0) {
        return; // Don't update if not moving
    }
    
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // Wall wrapping - pass through walls
    if (head.x < 0) {
        head.x = tileCount - 1;
    } else if (head.x >= tileCount) {
        head.x = 0;
    }
    
    if (head.y < 0) {
        head.y = tileCount - 1;
    } else if (head.y >= tileCount) {
        head.y = 0;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        snakeLength = snake.length;
        scoreEl.textContent = score;
        placeFood();
        
        // Increase speed as snake grows (every 50 points)
        const speedIncrease = Math.floor(score / 50);
        const newSpeed = Math.max(50, baseSpeed - (speedIncrease * 10));
        
        if (newSpeed !== currentSpeed) {
            currentSpeed = newSpeed;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, currentSpeed);
            
            // Update speed display
            const speedMultiplier = (baseSpeed / currentSpeed).toFixed(1);
            speedEl.textContent = speedMultiplier + 'x';
        }
    } else {
        snake.pop();
    }
}

function gameStep() {
    update();
    draw();
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
    
    // Draw game over overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    
    ctx.font = '18px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Snake Length: ${snakeLength}`, canvas.width / 2, canvas.height / 2 + 40);
    
    startBtn.disabled = false;
    startBtn.innerHTML = '<i class="fas fa-redo"></i> Play Again';
}

function startGame() {
    if (gameRunning) return;
    
    initGame();
    gameRunning = true;
    currentSpeed = baseSpeed;
    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Playing...';
    
    gameLoop = setInterval(gameStep, currentSpeed);
}

startBtn.addEventListener('click', startGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) {
        if (e.code === 'Space' || e.code === 'Enter') {
            startGame();
        }
        return;
    }
    
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y !== 1) {
                nextDirection = { x: 0, y: -1 };
            }
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y !== -1) {
                nextDirection = { x: 0, y: 1 };
            }
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x !== 1) {
                nextDirection = { x: -1, y: 0 };
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x !== -1) {
                nextDirection = { x: 1, y: 0 };
            }
            e.preventDefault();
            break;
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!gameRunning) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && direction.x !== -1) {
            nextDirection = { x: 1, y: 0 };
        } else if (deltaX < 0 && direction.x !== 1) {
            nextDirection = { x: -1, y: 0 };
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && direction.y !== -1) {
            nextDirection = { x: 0, y: 1 };
        } else if (deltaY < 0 && direction.y !== 1) {
            nextDirection = { x: 0, y: -1 };
        }
    }
});

// Initial draw
initGame();
draw();

// Chatbot Functionality
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');
const chatbotBody = document.getElementById('chatbotBody');

// Toggle chatbot window
chatbotBtn.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    if (chatbotWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

closeChat.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

// Send message function
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = message;
    chatbotBody.appendChild(userMsg);
    
    chatInput.value = '';
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    
    // Simulate bot response (replace with actual AI integration)
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        
        // Simple keyword-based responses
        const lowerMsg = message.toLowerCase();
        let response = "Thanks for your message! I'll get back to you soon.";
        
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            response = "Hello! How can I help you today?";
        } else if (lowerMsg.includes('contact') || lowerMsg.includes('email')) {
            response = "You can reach Michael at josiasmichael@gmail.com";
        } else if (lowerMsg.includes('job') || lowerMsg.includes('work') || lowerMsg.includes('hire')) {
            response = "Michael is open to new opportunities! Feel free to reach out via email or LinkedIn.";
        } else if (lowerMsg.includes('skill') || lowerMsg.includes('technology') || lowerMsg.includes('tech')) {
            response = "Michael has expertise in AWS, Azure, GCP, Terraform, Docker, Kubernetes, and more. Check the Summary tab for the full list!";
        } else if (lowerMsg.includes('certif') || lowerMsg.includes('credential') || lowerMsg.includes('badge')) {
            response = "Michael holds multiple certifications including AWS Solutions Architect, GCP Professional Cloud Architect, GitHub Advanced Security, and FinOps Certified Engineer. Check the Credly tab!";
        } else if (lowerMsg.includes('experience') || lowerMsg.includes('work history')) {
            response = "Michael has experience as a Platform Engineer at Revcard, Solutions Architect at Ruralnet, and Solutions Engineer at Lexmark. Check the Work Experience tab for details!";
        } else if (lowerMsg.includes('education') || lowerMsg.includes('school') || lowerMsg.includes('university')) {
            response = "Michael is currently pursuing a Master's in Financial Engineering at WorldQuant University.";
        } else if (lowerMsg.includes('location') || lowerMsg.includes('where')) {
            response = "Michael is based in Cebu City, Philippines.";
        } else if (lowerMsg.includes('cv') || lowerMsg.includes('resume')) {
            response = "You can download Michael's CV using the Download CV button at the top of the page!";
        } else if (lowerMsg.includes('github') || lowerMsg.includes('repo') || lowerMsg.includes('project')) {
            response = "Check out Michael's GitHub at github.com/mysycry! Featured projects include: Secure Repository Supply Chain, Three-Tier GitHub Actions, 30 Days DevOps Challenge, AI First Activities, GitOps with Terraform, and WildRydes serverless app.";
        } else if (lowerMsg.includes('game') || lowerMsg.includes('snake')) {
            response = "There's a Snake game in the Snake Game tab! It starts slow and gets faster as you eat more. You can pass through walls too!";
        }
        
        botMsg.textContent = response;
        chatbotBody.appendChild(botMsg);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }, 500);
}

sendChat.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Console message for developers
console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cWelcome to Michael Josias D. Tabada\'s portfolio!', 'font-size: 14px; color: #64748b;');
console.log('%cFeel free to explore the code and reach out if you have any questions.', 'font-size: 12px; color: #94a3b8;');

// Badge Images - To add actual Credly badge images:
// 1. Go to https://www.credly.com/users/jmichael/badges
// 2. Right-click on each badge image and select "Copy Image Address"
// 3. Add the URL to the corresponding badge below

const badgeImageUrls = {
    'professional-cloud-architect': 'https://images.credly.com/size/680x680/images/71c579e0-51fd-4247-b493-d2fa8167157a/image.png',
    'finops-certified-engineer': 'https://images.credly.com/images/90c78afd-e885-4525-8f5e-e5834d8cb13d/image.png',
    'foundations-financial-engineering': 'https://images.credly.com/images/682cdebb-aad0-4791-b091-a64cf8d79be0/blob',
    'associate-cloud-engineer': 'https://images.credly.com/size/680x680/images/08096465-cbfc-4c3e-93e5-93c5aa61f23e/image.png',
    'github-advanced-security': 'https://images.credly.com/size/680x680/images/c9ed294b-f8ac-48fa-a8c3-96dab1f110f2/image.png',
    'github-foundations': 'https://images.credly.com/size/680x680/images/024d0122-724d-4c5a-bd83-cfe3c4b7a073/image.png',
    'aws-sysops-administrator': 'https://images.credly.com/images/f0d3fbb9-bfa7-4017-9989-7bde8eaf42b1/image.png',
    'aws-solutions-architect': 'https://images.credly.com/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
    'apm-learning-path': 'https://images.credly.com/images/d3d1f03e-c093-4d25-96a7-350565821c36/blob',
    'sre-learning-path': 'https://images.credly.com/size/680x680/images/bd5c7db0-db22-4d9f-b461-ab7cd9500bc5/blob',
    'oci-certified-devops-professional': 'https://brm-workforce.oracle.com/pdf/certview/images/OCI25DOPOCP.png',
    'oci-certified-multicloud-professional': 'https://brm-workforce.oracle.com/pdf/certview/images/OCI2025MCAOCP.png'
};

// Function to load badge images
function loadBadgeImages() {
    const badgeCards = document.querySelectorAll('.credly-badges-grid .badge-card');
    
    badgeCards.forEach(card => {
        const badgeId = card.getAttribute('data-badge');
        const imgUrl = badgeImageUrls[badgeId];
        const imgContainer = card.querySelector('.badge-image-container');
        
        if (imgUrl && imgContainer) {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = card.querySelector('h4').textContent;
            img.className = 'badge-img';
            
            // Replace the icon with the actual image
            imgContainer.innerHTML = '';
            imgContainer.appendChild(img);
        }
    });
}

// Run after page loads
document.addEventListener('DOMContentLoaded', () => {
    loadBadgeImages();
    console.log('%c💡 Tip: Add your actual Credly badge image URLs in script.js', 'font-size: 11px; color: #94a3b8;');
});
