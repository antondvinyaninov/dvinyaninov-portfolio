// Telegram Forms Handler
// Отправка форм в Telegram через API endpoint

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
async function handleFormSubmit(event, projectName = '') {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Блокируем кнопку
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    
    try {
        const formData = new FormData(form);
        const success = await sendFormData(formData, projectName);
        
        if (success) {
            alert('✅ Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            form.reset();
        } else {
            alert('❌ Ошибка отправки. Попробуйте позже или свяжитесь напрямую через Telegram: @dvinyaninov');
        }
    } catch (error) {
        console.error('Ошибка обработки формы:', error);
        alert('❌ Ошибка отправки. Попробуйте позже или свяжитесь напрямую через Telegram: @dvinyaninov');
    } finally {
        // Разблокируем кнопку
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Инициализация форм при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Форма на главной странице
    const mainForm = document.getElementById('contactForm');
    if (mainForm) {
        mainForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Главная страница'));
    }
    
    // Бета-форма на страницах проектов
    const betaForm = document.getElementById('betaForm');
    if (betaForm) {
        const projectName = document.querySelector('h1')?.textContent || 'Проект';
        betaForm.addEventListener('submit', (e) => handleFormSubmit(e, projectName));
    }
});
