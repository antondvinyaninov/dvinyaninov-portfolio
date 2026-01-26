// Telegram Forms Handler
// Отправка форм в Telegram через API endpoint

// Функция отправки события в GTM
function pushGTMEvent(eventName, eventData = {}) {
    if (window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...eventData
        });
        console.log('GTM Event:', eventName, eventData);
    }
}

// Функция отправки данных формы через API
async function sendFormData(formData, projectName = '') {
    const data = Object.fromEntries(formData);
    data.projectName = projectName;
    
    try {
        const response = await fetch('/api/send-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        return false;
    }
}

// Обработчик отправки формы
async function handleFormSubmit(event, projectName = '', formType = '') {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Отправляем событие начала заполнения формы
    pushGTMEvent('form_submit_attempt', {
        form_name: projectName,
        form_type: formType,
        form_id: form.id || 'unknown'
    });
    
    // Блокируем кнопку
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    
    try {
        const formData = new FormData(form);
        const success = await sendFormData(formData, projectName);
        
        if (success) {
            // Отправляем событие успешной отправки
            pushGTMEvent('form_submit_success', {
                form_name: projectName,
                form_type: formType,
                form_id: form.id || 'unknown'
            });
            
            // Конверсия для рекламы
            pushGTMEvent('conversion', {
                conversion_type: 'lead',
                form_name: projectName
            });
            
            alert('✅ Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            form.reset();
        } else {
            // Отправляем событие ошибки
            pushGTMEvent('form_submit_error', {
                form_name: projectName,
                form_type: formType,
                error_type: 'api_error'
            });
            
            alert('❌ Ошибка отправки. Попробуйте позже или свяжитесь напрямую через Telegram: @dvinyaninov');
        }
    } catch (error) {
        console.error('Ошибка обработки формы:', error);
        
        // Отправляем событие ошибки
        pushGTMEvent('form_submit_error', {
            form_name: projectName,
            form_type: formType,
            error_type: 'network_error'
        });
        
        alert('❌ Ошибка отправки. Попробуйте позже или свяжитесь напрямую через Telegram: @dvinyaninov');
    } finally {
        // Разблокируем кнопку
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Инициализация форм при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Используем requestIdleCallback для некритичной инициализации
    const initForms = () => {
        // Форма на главной странице
        const mainForm = document.getElementById('contactForm');
        if (mainForm) {
            // Отслеживаем фокус на форме (начало заполнения)
            mainForm.addEventListener('focusin', () => {
                pushGTMEvent('form_start', {
                    form_name: 'Главная страница',
                    form_type: 'contact',
                    form_id: 'contactForm'
                });
            }, { once: true });
            
            mainForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Главная страница', 'contact'));
        }
        
        // Бета-форма на страницах проектов
        const betaForm = document.getElementById('betaForm');
        if (betaForm) {
            const projectName = document.querySelector('h1')?.textContent || 'Проект';
            
            betaForm.addEventListener('focusin', () => {
                pushGTMEvent('form_start', {
                    form_name: `Бета-тест: ${projectName}`,
                    form_type: 'beta',
                    form_id: 'betaForm'
                });
            }, { once: true });
            
            betaForm.addEventListener('submit', (e) => handleFormSubmit(e, `Бета-тест: ${projectName}`, 'beta'));
        }
        
        // Боковая форма на страницах проектов
        const sidebarForm = document.getElementById('sidebarForm');
        if (sidebarForm) {
            const projectName = document.querySelector('h1')?.textContent || 'Проект';
            
            sidebarForm.addEventListener('focusin', () => {
                pushGTMEvent('form_start', {
                    form_name: `Похожий проект: ${projectName}`,
                    form_type: 'sidebar',
                    form_id: 'sidebarForm'
                });
            }, { once: true });
            
            sidebarForm.addEventListener('submit', (e) => handleFormSubmit(e, `Похожий проект: ${projectName}`, 'sidebar'));
        }
        
        // Модальная форма в Header
        const modalForm = document.querySelector('.contact-modal__form');
        if (modalForm) {
            modalForm.id = 'modalForm';
            
            modalForm.addEventListener('focusin', () => {
                pushGTMEvent('form_start', {
                    form_name: 'Модальное окно',
                    form_type: 'modal',
                    form_id: 'modalForm'
                });
            }, { once: true });
            
            modalForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Модальное окно', 'modal'));
        }
    };
    
    // Отслеживание кликов - отложенная инициализация
    const initTracking = () => {
        trackButtonClicks();
    };
    
    // Используем requestIdleCallback для некритичных задач
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initForms();
            initTracking();
        });
    } else {
        // Fallback для браузеров без поддержки
        setTimeout(() => {
            initForms();
            initTracking();
        }, 1);
    }
});

// Функция отслеживания кликов по кнопкам
function trackButtonClicks() {
    // Кнопка "Смотреть проекты"
    const ctaButtons = document.querySelectorAll('.hero__cta, .work__more-link');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            pushGTMEvent('button_click', {
                button_text: e.currentTarget.textContent.trim(),
                button_location: 'hero',
                button_type: 'cta'
            });
        });
    });
    
    // Кнопки проектов
    const projectLinks = document.querySelectorAll('.project__link');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const projectCard = e.currentTarget.closest('.project');
            const projectTitle = projectCard?.querySelector('.project__title')?.textContent || 'Unknown';
            
            pushGTMEvent('project_click', {
                project_name: projectTitle,
                click_location: 'project_card'
            });
        });
    });
    
    // Социальные ссылки
    const socialLinks = document.querySelectorAll('.contact__link, .footer__link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            pushGTMEvent('social_click', {
                social_network: e.currentTarget.textContent.trim(),
                link_url: e.currentTarget.href
            });
        });
    });
    
    // Email клик
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            pushGTMEvent('email_click', {
                email: e.currentTarget.href.replace('mailto:', '')
            });
        });
    });
    
    // Кнопка открытия модального окна
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            pushGTMEvent('modal_open', {
                modal_type: 'contact'
            });
        });
    });
}
