// Скрипт для страницы чата (chat.html)
// Используем те же функции что и в основном чате

const chatPageForm = document.querySelector('.chat-page-form');
const chatPageMessages = document.querySelector('.chat-page-messages');
const chatPageInput = chatPageForm.querySelector('.chat-input');
const chatPageName = chatPageForm.querySelector('.chat-name');
const chatPagePhone = chatPageForm.querySelector('.chat-phone');
const chatPageSend = chatPageForm.querySelector('.chat-send');
const chatPageInitialFields = chatPageForm.querySelector('.chat-initial-fields');

let isFirstMessagePage = true;
let lastCheckedTimePage = Date.now();

// Генерация или получение уникального ID пользователя
function getUserIdPage() {
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
        userId = Math.random().toString(36).substring(2, 8).toUpperCase();
        localStorage.setItem('chatUserId', userId);
    }
    return userId;
}

const userIdPage = getUserIdPage();

// Автоматическое изменение высоты textarea
chatPageInput.addEventListener('input', function() {
    this.style.height = '44px';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Прокрутка к последнему сообщению при фокусе на input
chatPageInput.addEventListener('focus', function() {
    setTimeout(() => {
        chatPageMessages.scrollTop = chatPageMessages.scrollHeight;
    }, 300);
});

// Загружаем историю чата
function loadChatHistoryPage() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
        try {
            const messages = JSON.parse(history);
            const savedUserData = localStorage.getItem('chatUserData');
            
            // Очищаем чат (оставляем только приветствие)
            chatPageMessages.innerHTML = `
                <div class="chat-message chat-message--bot">
                    <img src="src/assets/photo.webp" alt="Anton" class="chat-avatar">
                    <p>Привет! 👋 Я Антон. Чем могу помочь?</p>
                </div>
            `;
            
            // Восстанавливаем сообщения
            messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message chat-message--${msg.type}`;
                
                if (msg.type === 'bot') {
                    messageDiv.innerHTML = `
                        <img src="src/assets/photo.webp" alt="Anton" class="chat-avatar">
                        <p>${msg.text}</p>
                    `;
                } else {
                    messageDiv.innerHTML = `<p>${msg.text}</p>`;
                }
                
                chatPageMessages.appendChild(messageDiv);
            });
            
            // Если есть сохраненные данные пользователя
            if (savedUserData) {
                const userData = JSON.parse(savedUserData);
                chatPageName.value = userData.name || '';
                chatPagePhone.value = userData.phone || '';
                
                if (messages.length > 0) {
                    isFirstMessagePage = false;
                }
            }
            
            chatPageMessages.scrollTop = chatPageMessages.scrollHeight;
        } catch (e) {
            console.error('Ошибка загрузки истории чата:', e);
        }
    }
    
    // На десктопе показываем поля сразу
    if (window.innerWidth > 768) {
        chatPageInitialFields.classList.add('show');
    }
}

// Сохраняем сообщение в историю
function saveChatMessagePage(text, type) {
    try {
        const history = localStorage.getItem('chatHistory');
        const messages = history ? JSON.parse(history) : [];
        
        messages.push({
            text: text,
            type: type,
            timestamp: Date.now()
        });
        
        if (messages.length > 50) {
            messages.shift();
        }
        
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (e) {
        console.error('Ошибка сохранения сообщения:', e);
    }
}

// Сохраняем данные пользователя
function saveUserDataPage(name, phone) {
    try {
        localStorage.setItem('chatUserData', JSON.stringify({ name, phone }));
    } catch (e) {
        console.error('Ошибка сохранения данных пользователя:', e);
    }
}

// Проверка новых сообщений
async function checkNewMessagesPage() {
    try {
        const response = await fetch(`/api/get-messages?userId=${userIdPage}`);
        const result = await response.json();
        
        if (result.success && result.messages && result.messages.length > 0) {
            result.messages.forEach(msg => {
                if (msg.date * 1000 > lastCheckedTimePage) {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'chat-message chat-message--bot';
                    botMessage.innerHTML = `
                        <img src="src/assets/photo.webp" alt="Anton" class="chat-avatar">
                        <p>${msg.text}</p>
                    `;
                    chatPageMessages.appendChild(botMessage);
                    chatPageMessages.scrollTop = chatPageMessages.scrollHeight;
                    
                    saveChatMessagePage(msg.text, 'bot');
                }
            });
            lastCheckedTimePage = Date.now();
        }
    } catch (error) {
        console.error('Ошибка проверки сообщений:', error);
    }
}

// Проверяем новые сообщения каждые 3 секунды
setInterval(checkNewMessagesPage, 3000);

// Отправка формы
chatPageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = chatPageInput.value.trim();
    const name = chatPageName.value.trim();
    const phone = chatPagePhone.value.trim();
    
    if (!message) return;
    
    // Сохраняем данные пользователя
    if (name || phone) {
        saveUserDataPage(name, phone);
    }
    
    // Добавляем сообщение пользователя
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message chat-message--user';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatPageMessages.appendChild(userMessage);
    
    // Сохраняем в историю
    saveChatMessagePage(message, 'user');
    
    // Очищаем форму
    chatPageInput.value = '';
    chatPageInput.style.height = '44px';
    chatPageMessages.scrollTop = chatPageMessages.scrollHeight;
    
    // Блокируем кнопку отправки
    chatPageSend.disabled = true;
    
    try {
        // Отправляем в Telegram через API
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message, 
                name, 
                phone,
                userId: userIdPage,
                isChat: true
            })
        });
        
        const result = await response.json();
        chatPageSend.disabled = false;
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
        
        const errorText = 'Упс! Не удалось отправить сообщение. Проверьте интернет или попробуйте позже 🙏';
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message chat-message--bot';
        botMessage.innerHTML = `
            <img src="src/assets/photo.webp" alt="Anton" class="chat-avatar">
            <p>${errorText}</p>
        `;
        chatPageMessages.appendChild(botMessage);
        chatPageMessages.scrollTop = chatPageMessages.scrollHeight;
        chatPageSend.disabled = false;
        
        saveChatMessagePage(errorText, 'bot');
    }
    
    // Скрываем поля после первого сообщения на мобильном
    if (isFirstMessagePage) {
        isFirstMessagePage = false;
        if (window.innerWidth <= 768 && !chatPageInitialFields.classList.contains('show')) {
            const contactButton = document.createElement('div');
            contactButton.className = 'chat-add-contact';
            contactButton.innerHTML = '<span>+ Добавить контакты</span>';
            contactButton.onclick = () => {
                chatPageInitialFields.classList.add('show');
                contactButton.remove();
            };
            chatPageForm.insertBefore(contactButton, chatPageForm.firstChild);
        }
    }
});

// Загружаем историю при загрузке страницы
loadChatHistoryPage();

console.log('💬 Chat page loaded! User ID:', userIdPage);
