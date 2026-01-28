// ============================================
// ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
// ============================================
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

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

// Debounce функция для оптимизации scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle функция для mousemove
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Оптимизированный scroll handler
const handleScroll = debounce(() => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = 'var(--text-secondary)';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--text)';
        }
    });
    
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('href') === `#${current}`) {
            dot.classList.add('active');
        }
    });
}, 100); // Debounce 100ms

// Passive listener для лучшей производительности
window.addEventListener('scroll', handleScroll, { passive: true });

// ============================================
// 3D ПРОЕКТЫ
// ============================================
const projects3d = document.querySelectorAll('.project-3d');

// Функция проверки мобильного устройства
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

projects3d.forEach((project, index) => {
    // На мобильных делаем всю карточку кликабельной ссылкой
    if (isMobileDevice()) {
        project.style.cursor = 'pointer';
        project.addEventListener('click', (e) => {
            // Если кликнули не по ссылке - переходим на страницу проекта
            if (!e.target.closest('a')) {
                const projectLink = project.querySelector('.project__link');
                if (projectLink) {
                    window.location.href = projectLink.href;
                }
            }
        });
        return; // Пропускаем 3D эффекты на мобильных
    }
    
    // Десктоп: 3D flip эффект
    project.addEventListener('click', (e) => {
        
        // Если кликнули по ссылке - не переворачиваем, даем ссылке сработать
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            e.stopPropagation(); // Останавливаем всплытие события
            return;
        }
        
        // Переворачиваем карточку
        project.classList.toggle('flipped');
        
        // Очищаем inline стили от mousemove
        const inner = project.querySelector('.project__inner');
        if (inner) {
            inner.style.transform = '';
        }
    });
    
    // 3D tilt эффект при наведении (только если не перевернута) - throttled
    const handleMouseMove = throttle((e) => {
        if (!project.classList.contains('flipped')) {
            const rect = project.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 50;
            const rotateY = (centerX - x) / 50;
            
            const inner = project.querySelector('.project__inner');
            if (inner) {
                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        }
    }, 16); // ~60fps
    
    project.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    project.addEventListener('mouseleave', () => {
        if (!project.classList.contains('flipped')) {
            const inner = project.querySelector('.project__inner');
            if (inner) {
                inner.style.transform = 'rotateX(0) rotateY(0)';
            }
        }
    });
});

// ============================================
// АНИМАЦИЯ ПОЯВЛЕНИЯ (отложенная инициализация)
// ============================================
function initScrollAnimations() {
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

    const animatedElements = document.querySelectorAll('.project, .work__more-card, .section__header');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = `opacity 0.4s ease ${index * 0.03}s, transform 0.4s ease ${index * 0.03}s`;
        observer.observe(el);
    });

    const services = document.querySelectorAll('.service');
    services.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        observer.observe(el);
    });
}

// Используем requestIdleCallback для отложенной инициализации
if ('requestIdleCallback' in window) {
    requestIdleCallback(initScrollAnimations);
} else {
    setTimeout(initScrollAnimations, 100);
}

// ============================================
// АНИМАЦИЯ СЛОВ В HERO (отложенная инициализация)
// ============================================
function initHeroAnimation() {
    const words = document.querySelectorAll('.word');

    words.forEach((word, index) => {
        word.style.opacity = '0';
        word.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            word.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Запускаем анимацию hero сразу (критично для UX)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimation);
} else {
    initHeroAnimation();
}

// ============================================
// ЭФФЕКТ ЦИФР НА ЛОГОТИПЕ (отложенная инициализация)
// ============================================
function initLogoEffect() {
    const logo = document.querySelector('.logo');
    
    if (logo) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            logo,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim() && !node.parentElement.classList.contains('logo__bracket')) {
                textNodes.push(node);
            }
        }
        
        let isAnimating = false;
        let animationFrame;
        const originalTexts = textNodes.map(node => node.textContent);
        
        logo.addEventListener('mouseenter', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            let iterations = 0;
            const maxIterations = 15;
            
            const animate = () => {
                if (iterations < maxIterations) {
                    textNodes.forEach((node, nodeIndex) => {
                        const originalText = originalTexts[nodeIndex];
                        const newText = originalText
                            .split('')
                            .map((char, index) => {
                                if (char === ' ') return char;
                                if (iterations >= maxIterations - 3) {
                                    return originalText[index];
                                }
                                return Math.floor(Math.random() * 10);
                            })
                            .join('');
                        
                        node.textContent = newText;
                    });
                    
                    iterations++;
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    textNodes.forEach((node, index) => {
                        node.textContent = originalTexts[index];
                    });
                    isAnimating = false;
                }
            };
            
            animate();
        }, { passive: true });
        
        logo.addEventListener('mouseleave', () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            textNodes.forEach((node, index) => {
                node.textContent = originalTexts[index];
            });
            isAnimating = false;
        }, { passive: true });
    }
}

// Отложенная инициализация через requestIdleCallback
if ('requestIdleCallback' in window) {
    requestIdleCallback(initLogoEffect);
} else {
    setTimeout(initLogoEffect, 200);
}

// ============================================
// 3D TILT ЭФФЕКТ ДЛЯ ФОТО (отложенная инициализация)
// ============================================
function initPhotoTilt() {
    const photoWrapper = document.querySelector('.photo-wrapper');

    if (photoWrapper) {
        const handlePhotoMouseMove = throttle((e) => {
            const rect = photoWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            photoWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        }, 16); // ~60fps
        
        photoWrapper.addEventListener('mousemove', handlePhotoMouseMove, { passive: true });
        
        photoWrapper.addEventListener('mouseleave', () => {
            photoWrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        }, { passive: true });
    }
}

// Отложенная инициализация
if ('requestIdleCallback' in window) {
    requestIdleCallback(initPhotoTilt);
} else {
    setTimeout(initPhotoTilt, 300);
}

// ============================================
// HOVER ЭФФЕКТ ДЛЯ УСЛУГ (отложенная инициализация)
// ============================================
function initServiceHover() {
    const serviceElements = document.querySelectorAll('.service');

    serviceElements.forEach(service => {
        service.addEventListener('mouseenter', function() {
            this.style.background = 'var(--bg)';
        }, { passive: true });
        
        service.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        }, { passive: true });
    });
}

// Отложенная инициализация
if ('requestIdleCallback' in window) {
    requestIdleCallback(initServiceHover);
} else {
    setTimeout(initServiceHover, 400);
}

// ============================================
// МОБИЛЬНОЕ МЕНЮ (отложенная инициализация)
// ============================================
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }, { passive: true });
        
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }, { passive: true });
        });
    }
}

// Отложенная инициализация
if ('requestIdleCallback' in window) {
    requestIdleCallback(initMobileMenu);
} else {
    setTimeout(initMobileMenu, 500);
}

// ============================================
// МОДАЛЬНОЕ ОКНО КОНТАКТА (отложенная инициализация)
// ============================================
function initContactModal() {
    const openModalBtn = document.getElementById('openContactModal');
    const modal = document.getElementById('contactModal');
    const closeModalBtn = modal?.querySelector('.contact-modal__close');
    const overlay = modal?.querySelector('.contact-modal__overlay');
    const form = modal?.querySelector('.contact-modal__form');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, { passive: true });
    }

    const closeModal = () => {
        modal?.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal, { passive: true });
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    }, { passive: true });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                contact: formData.get('contact'),
                message: formData.get('message')
            };

            alert('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.');
            form.reset();
            closeModal();
        });
    }
}

// Отложенная инициализация через requestIdleCallback
if ('requestIdleCallback' in window) {
    requestIdleCallback(initContactModal, { timeout: 2000 });
} else {
    setTimeout(initContactModal, 1000);
}

// ============================================
// КОНТАКТНАЯ ФОРМА (отложенная инициализация)
// ============================================
function initContactForm() {
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
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span>✓ Отправлено!</span>';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 1000);
        });
    }
}

// Отложенная инициализация
if ('requestIdleCallback' in window) {
    requestIdleCallback(initContactForm, { timeout: 2000 });
} else {
    setTimeout(initContactForm, 1000);
}

// Красивое приветствие в консоли
console.log('%c🚀 Astro Portfolio', 'font-size: 20px; font-weight: bold; color: #0D4CD3;');
console.log('%cMade with ❤️ by Anton Dvinyaninov', 'font-size: 14px; color: #666;');
console.log('%c💼 Доступен для проектов', 'font-size: 12px; color: #3AAA35; font-weight: bold;');
