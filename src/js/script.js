// ============================================
// ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (2 темы: light, dark)
// ============================================
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Проверяем сохраненную тему
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ============================================
// ПЛАВНАЯ ПРОКРУТКА
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// АКТИВНАЯ НАВИГАЦИЯ
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');
const navDots = document.querySelectorAll('.nav-dot');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    // Обновляем header навигацию
    navLinks.forEach(link => {
        link.style.color = 'var(--text-secondary)';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--text)';
        }
    });
    
    // Обновляем боковую навигацию
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('href') === `#${current}`) {
            dot.classList.add('active');
        }
    });
});

// ============================================
// 3D ПРОЕКТЫ
// ============================================
const projects3d = document.querySelectorAll('.project-3d');

projects3d.forEach(project => {
    let isFlipped = false;
    
    project.addEventListener('click', () => {
        const inner = project.querySelector('.project__inner');
        isFlipped = !isFlipped;
        
        if (isFlipped) {
            inner.style.transform = 'rotateY(180deg)';
        } else {
            inner.style.transform = 'rotateY(0deg)';
        }
    });
    
    // Легкий 3D эффект при движении мыши
    project.addEventListener('mousemove', (e) => {
        if (!isFlipped) {
            const rect = project.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 50;
            const rotateY = (centerX - x) / 50;
            
            const inner = project.querySelector('.project__inner');
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    
    project.addEventListener('mouseleave', () => {
        if (!isFlipped) {
            const inner = project.querySelector('.project__inner');
            inner.style.transform = 'rotateX(0) rotateY(0)';
        }
    });
});

// ============================================
// АНИМАЦИЯ ПОЯВЛЕНИЯ
// ============================================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к элементам
const animatedElements = document.querySelectorAll('.project, .work__more-card, .service, .section__header');

animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
    observer.observe(el);
});

// ============================================
// АНИМАЦИЯ СЛОВ В HERO
// ============================================
const words = document.querySelectorAll('.word');

words.forEach((word, index) => {
    word.style.opacity = '0';
    word.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
        word.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        word.style.opacity = '1';
        word.style.transform = 'translateY(0)';
    }, index * 200);
});

// ============================================
// ЭФФЕКТ ЦИФР НА HERO ЗАГОЛОВКЕ
// ============================================
const heroTitleLines = document.querySelectorAll('.hero__title .title-animate');

heroTitleLines.forEach(line => {
    // Сохраняем оригинальный текст
    const originalText = line.textContent;
    let isAnimating = false;
    let animationFrame;
    
    line.addEventListener('mouseenter', () => {
        if (isAnimating) return;
        isAnimating = true;
        
        let iterations = 0;
        const maxIterations = 15;
        
        const animate = () => {
            if (iterations < maxIterations) {
                // Заменяем символы на цифры
                const newText = originalText
                    .split('')
                    .map((char, index) => {
                        // Пропускаем пробелы
                        if (char === ' ') return char;
                        
                        // В последних итерациях возвращаем оригинальные символы
                        if (iterations >= maxIterations - 3) {
                            return originalText[index];
                        }
                        
                        // Показываем случайные цифры
                        return Math.floor(Math.random() * 10);
                    })
                    .join('');
                
                line.textContent = newText;
                iterations++;
                animationFrame = requestAnimationFrame(animate);
            } else {
                // Восстанавливаем оригинальный текст
                line.textContent = originalText;
                isAnimating = false;
            }
        };
        
        animate();
    });
    
    line.addEventListener('mouseleave', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        line.textContent = originalText;
        isAnimating = false;
    });
});

// ============================================
// ФОНОВАЯ ЗМЕЙКА
// ============================================
// ФОНОВАЯ ЗМЕЙКА
// ============================================
const bgCanvas = document.getElementById('backgroundSnake');
const bgCtx = bgCanvas.getContext('2d');

// Устанавливаем размер canvas на весь экран
function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}

// Оптимизированный resize с debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        requestAnimationFrame(resizeBgCanvas);
    }, 100);
});

const bgGridSize = 20;
let bgSnake = [];
let bgDirection = { x: 1, y: 0 };
let bgSpeed = 150;

// Инициализация фоновой змейки
function initBgSnake() {
    const startX = Math.floor(bgCanvas.width / bgGridSize / 2);
    const startY = Math.floor(bgCanvas.height / bgGridSize / 2);
    bgSnake = [];
    for (let i = 0; i < 15; i++) {
        bgSnake.push({ x: startX - i, y: startY });
    }
}

function getBgColors() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        return {
            snake: '#ff006e',
            trail: 'rgba(255, 0, 110, 0.3)'
        };
    } else {
        return {
            snake: '#ff006e',
            trail: 'rgba(255, 0, 110, 0.2)'
        };
    }
}

function drawBgSnake() {
    const colors = getBgColors();
    
    // Полная очистка canvas
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    // Рисуем змейку
    bgSnake.forEach((segment, index) => {
        const opacity = 1 - (index / bgSnake.length) * 0.7;
        bgCtx.fillStyle = colors.snake;
        bgCtx.globalAlpha = opacity * 0.3;
        
        const size = bgGridSize - 4;
        bgCtx.fillRect(
            segment.x * bgGridSize + 2,
            segment.y * bgGridSize + 2,
            size,
            size
        );
        
        // Свечение для головы
        if (index === 0) {
            bgCtx.shadowBlur = 20;
            bgCtx.shadowColor = colors.snake;
        } else {
            bgCtx.shadowBlur = 0;
        }
    });
    
    bgCtx.globalAlpha = 1;
    bgCtx.shadowBlur = 0;
}

function moveBgSnake() {
    const head = { 
        x: bgSnake[0].x + bgDirection.x, 
        y: bgSnake[0].y + bgDirection.y 
    };
    
    const maxX = Math.floor(bgCanvas.width / bgGridSize);
    const maxY = Math.floor(bgCanvas.height / bgGridSize);
    
    // Случайное изменение направления
    if (Math.random() < 0.05) {
        const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];
        const newDir = directions[Math.floor(Math.random() * directions.length)];
        // Не разворачиваемся на 180 градусов
        if (!(newDir.x === -bgDirection.x && newDir.y === -bgDirection.y)) {
            bgDirection = newDir;
        }
    }
    
    // Телепортация при выходе за границы
    if (head.x < 0) head.x = maxX - 1;
    if (head.x >= maxX) head.x = 0;
    if (head.y < 0) head.y = maxY - 1;
    if (head.y >= maxY) head.y = 0;
    
    bgSnake.unshift(head);
    bgSnake.pop();
}

function animateBgSnake() {
    moveBgSnake();
    drawBgSnake();
}

// Запуск анимации после загрузки страницы
window.addEventListener('load', function() {
    resizeBgCanvas();
    initBgSnake();
    setInterval(animateBgSnake, bgSpeed);
    drawBgSnake();
});

// ============================================
// ПАСХАЛКА: КЛИКИ ПО ФОТО
// ============================================
const heroPhoto = document.querySelector('.hero-photo');
let photoClickCount = 0;
let photoClickTimeout;

if (heroPhoto) {
    heroPhoto.addEventListener('click', () => {
        photoClickCount++;
        
        // Сбрасываем счетчик через 2 секунды если не кликают
        clearTimeout(photoClickTimeout);
        photoClickTimeout = setTimeout(() => {
            photoClickCount = 0;
        }, 2000);
        
        // При 5 кликах запускаем пасхалку
        if (photoClickCount === 5) {
            photoClickCount = 0;
            activateEasterEgg();
        }
    });
}

function activateEasterEgg() {
    // Создаем конфетти
    createConfetti();
    
    // Показываем секретное сообщение
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--accent);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: 700;
        z-index: 10000;
        animation: easterEggPop 0.5s ease;
        box-shadow: 0 20px 60px rgba(255, 0, 110, 0.5);
        text-align: center;
    `;
    message.innerHTML = '🎉 Вы нашли пасхалку! 🎉<br><span style="font-size: 16px; opacity: 0.9;">Спасибо, что исследуете мой сайт!</span>';
    document.body.appendChild(message);
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes easterEggPop {
            0% { transform: translate(-50%, -50%) scale(0); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Убираем сообщение через 3 секунды
    setTimeout(() => {
        message.style.animation = 'easterEggPop 0.3s ease reverse';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 3000);
}

function createConfetti() {
    const colors = ['#ff006e', '#00d4ff', '#06ffa5', '#8338ec', '#ff006e'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            z-index: 9999;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            opacity: ${0.5 + Math.random() * 0.5};
        `;
        document.body.appendChild(confetti);
        
        // Удаляем конфетти после анимации
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Добавляем анимацию падения
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 3D TILT ЭФФЕКТ ДЛЯ ФОТО
// ============================================
const photoWrapper = document.querySelector('.photo-wrapper');

if (photoWrapper) {
    photoWrapper.addEventListener('mousemove', (e) => {
        const rect = photoWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        photoWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    photoWrapper.addEventListener('mouseleave', () => {
        photoWrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

// ============================================
// HOVER ЭФФЕКТ ДЛЯ УСЛУГ
// ============================================
const services = document.querySelectorAll('.service');

services.forEach(service => {
    service.addEventListener('mouseenter', function() {
        this.style.background = 'var(--bg)';
    });
    
    service.addEventListener('mouseleave', function() {
        this.style.background = 'transparent';
    });
});

// ============================================
// МОБИЛЬНОЕ МЕНЮ
// ============================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Закрываем меню при клике на ссылку
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// АДАПТИВНОСТЬ
// ============================================
window.addEventListener('resize', () => {
    // Закрываем мобильное меню при изменении размера экрана
    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================
// ЗАГРУЗКА
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🚀 Portfolio loaded!');
console.log('Made with ❤️ by Anton Dvinyaninov');


// ============================================
// КОНТАКТНАЯ ФОРМА
// ============================================
const contactForm = document.querySelector('.contact__form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const contact = contactForm.querySelectorAll('input[type="text"]')[1].value;
        const description = contactForm.querySelector('textarea').value;
        
        const submitBtn = contactForm.querySelector('.form__submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Отправка...</span>';
        submitBtn.disabled = true;
        
        try {
            const message = `🎯 Новая заявка на проект!\n\n👤 Имя: ${name}\n📞 Контакт: ${contact}\n📝 Описание:\n${description}`;
            
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, name, phone: contact })
            });
            
            const result = await response.json();
            
            if (result.success) {
                submitBtn.innerHTML = '<span>✓ Отправлено!</span>';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Ошибка отправки');
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            submitBtn.innerHTML = '<span>✗ Ошибка</span>';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}


// ============================================
// МОДАЛЬНОЕ ОКНО КОНТАКТА
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка, чтобы Web Component успел отрендериться
    setTimeout(() => {
        const openModalBtn = document.getElementById('openContactModal');
        const modal = document.getElementById('contactModal');
        const closeModalBtn = modal?.querySelector('.contact-modal__close');
        const overlay = modal?.querySelector('.contact-modal__overlay');
        const form = modal?.querySelector('.contact-modal__form');

        console.log('Modal elements:', { openModalBtn, modal, closeModalBtn, overlay, form });

        // Открытие модального окна
        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                console.log('Opening modal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Закрытие модального окна
        const closeModal = () => {
            console.log('Closing modal');
            modal?.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                closeModal();
            }
        });

        // Отправка формы
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    contact: formData.get('contact'),
                    message: formData.get('message')
                };

                console.log('Submitting form:', data);

                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        alert('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.');
                        form.reset();
                        closeModal();
                    } else {
                        alert('Произошла ошибка. Попробуйте еще раз или напишите мне напрямую.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Произошла ошибка. Попробуйте еще раз или напишите мне напрямую.');
                }
            });
        }
    }, 100);
});
