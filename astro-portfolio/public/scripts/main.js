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

window.addEventListener('scroll', () => {
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
});

// ============================================
// 3D ПРОЕКТЫ
// ============================================
const projects3d = document.querySelectorAll('.project-3d');
const isMobile = window.innerWidth <= 768;

projects3d.forEach(project => {
    // На мобильных делаем всю карточку кликабельной ссылкой
    if (isMobile) {
        project.style.cursor = 'pointer';
        project.addEventListener('click', (e) => {
            // Если кликнули не по ссылке - переходим на страницу проекта
            if (!e.target.closest('a')) {
                const link = project.querySelector('.project__link');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });
        return; // Пропускаем 3D эффекты на мобильных
    }
    
    // Десктоп: 3D эффекты
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

// ============================================
// АНИМАЦИЯ СЛОВ В HERO
// ============================================
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

// ============================================
// ЭФФЕКТ ЦИФР НА ЛОГОТИПЕ
// ============================================
document.addEventListener('DOMContentLoaded', () => {
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
        });
        
        logo.addEventListener('mouseleave', () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            textNodes.forEach((node, index) => {
                node.textContent = originalTexts[index];
            });
            isAnimating = false;
        });
    }
});

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
const serviceElements = document.querySelectorAll('.service');

serviceElements.forEach(service => {
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
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// МОДАЛЬНОЕ ОКНО КОНТАКТА
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const openModalBtn = document.getElementById('openContactModal');
        const modal = document.getElementById('contactModal');
        const closeModalBtn = modal?.querySelector('.contact-modal__close');
        const overlay = modal?.querySelector('.contact-modal__overlay');
        const form = modal?.querySelector('.contact-modal__form');

        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        const closeModal = () => {
            modal?.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                closeModal();
            }
        });

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    contact: formData.get('contact'),
                    message: formData.get('message')
                };

                console.log('Форма отправлена:', data);
                alert('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.');
                form.reset();
                closeModal();
            });
        }
    }, 100);
});

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
        
        console.log('Контактная форма:', { name, contact, description });
        
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

console.log('🚀 Astro Portfolio loaded!');
console.log('Made with ❤️ by Anton Dvinyaninov');
