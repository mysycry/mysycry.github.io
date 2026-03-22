// ===================================
// SOCIAL MEDIA PROFILE - JavaScript
// ===================================

// Theme Toggle with Auto-Detect
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme or auto-detect system preference
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
html.setAttribute('data-theme', savedTheme || systemTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Parallax Effect for Cover Photo
const coverPhotoBg = document.getElementById('coverPhotoBg');

if (coverPhotoBg) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const parallaxSpeed = 0.5;
                const offset = scrolled * parallaxSpeed;
                
                if (coverPhotoBg) {
                    coverPhotoBg.style.transform = `translateY(${offset}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
}

// Toast Notification Function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
    icon.setAttribute('aria-hidden', 'true');
    toast.insertBefore(icon, toast.firstChild);
    
    setTimeout(() => {
        toast.className = 'toast';
        toast.innerHTML = '';
    }, 3000);
}

// Copy Email Functionality
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            showToast(`Email copied: ${email}`, 'success');
            window.open(link.getAttribute('href'), '_blank');
        }).catch(() => {
            window.open(link.getAttribute('href'), '_blank');
        });
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');

function toggleScrollTop() {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleScrollTop);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Tab Navigation
const tabBtns = document.querySelectorAll('.nav-tab');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // Update all tabs
        tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('hidden', '');
        });

        // Activate selected tab
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(tabId);
        panel.classList.add('active');
        panel.removeAttribute('hidden');
        
        // Scroll to top of content on tab change
        document.querySelector('.profile-content').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Share Profile Functionality
document.getElementById('shareProfile')?.addEventListener('click', async () => {
    const shareData = {
        title: 'Michael Josias D. Tabada - Platform Engineer',
        text: 'Check out my portfolio!',
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Share canceled');
        }
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
    }
});

// Heart Evaporation Animation on Like
document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        // Toggle liked state
        this.classList.toggle('liked');
        
        if (this.classList.contains('liked')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            text.textContent = 'Liked';
            
            // Create multiple heart particles
            createHeartParticles(this);
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            text.textContent = 'Like';
        }
    });
});

function createHeartParticles(button) {
    const rect = button.getBoundingClientRect();
    const particleCount = 12; // More hearts for livestream effect
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            
            // Random horizontal spread across button width
            const randomX = rect.left + Math.random() * rect.width;
            heart.style.left = `${randomX}px`;
            heart.style.top = `${rect.top - 20}px`;
            
            // Random size variation for depth effect
            const randomScale = 0.8 + Math.random() * 0.6; // 0.8 to 1.4
            heart.style.fontSize = `${1.5 * randomScale}rem`;
            
            // Random horizontal drift
            const drift = (Math.random() - 0.5) * 60; // -30 to 30px
            heart.style.setProperty('--drift', `${drift}px`);
            
            // Random animation duration for varied speed
            const duration = 1.2 + Math.random() * 0.6; // 1.2 to 1.8s
            heart.style.animationDuration = `${duration}s`;
            
            // Random delay for staggered spawn
            const delay = Math.random() * 0.3;
            heart.style.animationDelay = `${delay}s`;
            
            document.body.appendChild(heart);
            
            // Remove heart after animation completes
            setTimeout(() => {
                heart.remove();
            }, (duration + delay) * 1000);
        }, i * 30); // Spawn every 30ms for continuous stream effect
    }
}

// Snake Game
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
let baseSpeed = 150;
let currentSpeed = baseSpeed;

highScoreEl.textContent = highScore;

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
    snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
    direction = { x: 0, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
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

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    snake.forEach((segment, index) => {
        const isHead = index === 0;
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
        const radius = isHead ? 8 : 6;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, gridSize - 2, gridSize - 2, radius);
        ctx.fill();
        ctx.strokeStyle = colors.snakeBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (isHead) {
            ctx.fillStyle = 'white';
            const eyeSize = 4;
            const eyeOffset = 5;

            if (direction.x !== 0 || direction.y !== 0) {
                if (direction.x === 1) {
                    ctx.beginPath();
                    ctx.arc(x + gridSize - eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + gridSize - eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (direction.x === -1) {
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (direction.y === -1) {
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + gridSize - eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + gridSize - eyeOffset, y + gridSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
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

    if (direction.x === 0 && direction.y === 0) return;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Wall wrapping
    if (head.x < 0) head.x = tileCount - 1;
    else if (head.x >= tileCount) head.x = 0;
    
    if (head.y < 0) head.y = tileCount - 1;
    else if (head.y >= tileCount) head.y = 0;

    // Self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        placeFood();

        const speedIncrease = Math.floor(score / 50);
        const newSpeed = Math.max(50, baseSpeed - (speedIncrease * 10));

        if (newSpeed !== currentSpeed) {
            currentSpeed = newSpeed;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, currentSpeed);
            speedEl.textContent = (baseSpeed / currentSpeed).toFixed(1) + 'x';
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

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);

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
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            e.preventDefault();
            break;
    }
});

// Touch controls for game
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
        if (deltaX > 0 && direction.x !== -1) {
            nextDirection = { x: 1, y: 0 };
        } else if (deltaX < 0 && direction.x !== 1) {
            nextDirection = { x: -1, y: 0 };
        }
    } else {
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

chatbotBtn.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    if (chatbotWindow.classList.contains('active')) {
        chatInput.focus();
        // Remove notification badge
        chatbotBtn.querySelector('.chatbot-badge')?.remove();
    }
});

closeChat.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = message;
    chatbotBody.appendChild(userMsg);

    chatInput.value = '';
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';

        const lowerMsg = message.toLowerCase();
        let response = "Thanks for your message! I'll get back to you soon.";

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            response = "Hello! How can I help you today? 👋";
        } else if (lowerMsg.includes('contact') || lowerMsg.includes('email')) {
            response = "You can reach Michael at navigatormichael@gmail.com";
        } else if (lowerMsg.includes('job') || lowerMsg.includes('work') || lowerMsg.includes('hire')) {
            response = "Michael is open to new opportunities! Feel free to reach out via email or LinkedIn.";
        } else if (lowerMsg.includes('skill') || lowerMsg.includes('technology') || lowerMsg.includes('tech')) {
            response = "Michael has expertise in AWS, Azure, GCP, Terraform, Docker, Kubernetes, and more. Check the About tab!";
        } else if (lowerMsg.includes('certif') || lowerMsg.includes('credential') || lowerMsg.includes('badge')) {
            response = "Michael holds 10+ certifications including AWS Solutions Architect, GCP Professional Cloud Architect, and FinOps Engineer. Check the Badges tab!";
        } else if (lowerMsg.includes('experience') || lowerMsg.includes('work history')) {
            response = "Michael has experience as a Platform Engineer at Revcard, Solutions Architect at Ruralnet, and Solutions Engineer at Lexmark. Check the Posts tab!";
        } else if (lowerMsg.includes('education') || lowerMsg.includes('school') || lowerMsg.includes('university')) {
            response = "Michael is pursuing a Master's in Financial Engineering at WorldQuant University.";
        } else if (lowerMsg.includes('location') || lowerMsg.includes('where')) {
            response = "Michael is based in the Philippines.";
        } else if (lowerMsg.includes('cv') || lowerMsg.includes('resume')) {
            response = "You can download Michael's CV using the CV button at the top!";
        } else if (lowerMsg.includes('github') || lowerMsg.includes('repo') || lowerMsg.includes('project')) {
            response = "Check out the Repos tab! Featured projects include Secure Repository Supply Chain, Three-Tier GitHub Actions, 30 Days DevOps Challenge, and more!";
        } else if (lowerMsg.includes('game') || lowerMsg.includes('snake')) {
            response = "There's a Snake game in the Game tab! It starts slow and gets faster as you eat more. You can pass through walls! 🐍";
        }

        botMsg.textContent = response;
        chatbotBody.appendChild(botMsg);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }, 500);
}

sendChat.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Console message
console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cWelcome to Michael Josias D. Tabada\'s portfolio!', 'font-size: 14px; color: #64748b;');

// Badge Images
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
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';

            imgContainer.innerHTML = '';
            imgContainer.appendChild(img);
        }
    });
    
    // Attach spin event listeners AFTER images are loaded
    attachBadgeSpinListeners();
}

// Attach spin event listeners to badge cards
function attachBadgeSpinListeners() {
    const badgeCards = document.querySelectorAll('.credly-badges-grid .badge-card');
    
    badgeCards.forEach(card => {
        // Touch support for mobile
        card.addEventListener('touchstart', () => {
            card.classList.add('spinning');
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.classList.remove('spinning');
            }, 600);
        });
        
        // Click support for desktop
        card.addEventListener('click', () => {
            card.classList.add('spinning');
            setTimeout(() => {
                card.classList.remove('spinning');
            }, 600);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadBadgeImages();
    attachBadgeSpinListeners();
});
