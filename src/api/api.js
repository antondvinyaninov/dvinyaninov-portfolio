const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Telegram настройки
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Хранилище последнего update_id для получения только новых сообщений
let lastUpdateId = 0;

app.use(cors());
app.use(express.json());

// Endpoint для отправки сообщений
app.post('/send-message', async (req, res) => {
  try {
    const { message, name, phone, userId, isChat } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Сообщение не может быть пустым' 
      });
    }
    
    // Формируем текст сообщения
    let text = '';
    
    // Если это чат - всегда отправляем как сообщение из чата
    if (isChat) {
      const userIdInfo = userId ? `🆔 User #${userId}` : '';
      const userInfo = name ? `👤 ${name}` : '';
      const phoneInfo = phone ? `📞 ${phone}` : '';
      const header = [userIdInfo, userInfo, phoneInfo].filter(Boolean).join('\n');
      
      if (header) {
        text = `💬 Сообщение из чата:\n\n${header}\n\n${message}`;
      } else {
        text = `💬 Сообщение из чата:\n\n${message}`;
      }
    } else {
      // Заявка с контактной формы
      text = `🎯 Новая заявка на проект!\n\n👤 Имя: ${name || 'Не указано'}\n📞 Контакт: ${phone || 'Не указан'}\n📝 Описание:\n${message}`;
    }
    
    // Отправляем в Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      res.json({ 
        success: true, 
        message: 'Сообщение отправлено!' 
      });
    } else {
      throw new Error('Ошибка Telegram API');
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Не удалось отправить сообщение' 
    });
  }
});

// Endpoint для получения новых сообщений из Telegram
app.get('/get-messages', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offset: lastUpdateId + 1,
        timeout: 10
      })
    });
    
    const result = await response.json();
    
    if (result.ok && result.result.length > 0) {
      const messages = result.result
        .filter(update => {
          // Фильтруем только сообщения от меня (владельца)
          if (!update.message || update.message.from.id.toString() !== CHAT_ID) {
            return false;
          }
          
          const text = update.message.text || '';
          
          // Исключаем эхо наших сообщений и заявки
          if (text.startsWith('💬') || text.startsWith('🎯')) {
            return false;
          }
          
          // Если указан userId, проверяем что ответ для этого пользователя
          if (userId) {
            // Ответ должен начинаться с @userId или содержать #userId
            return text.includes(`@${userId}`) || text.includes(`#${userId}`);
          }
          
          return true;
        })
        .map(update => {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);
          let text = update.message.text;
          
          // Убираем @userId из текста ответа
          if (userId) {
            text = text.replace(new RegExp(`@${userId}\\s*`, 'gi'), '').trim();
            text = text.replace(new RegExp(`#${userId}\\s*`, 'gi'), '').trim();
          }
          
          return {
            text: text,
            date: update.message.date
          };
        });
      
      res.json({ 
        success: true, 
        messages: messages 
      });
    } else {
      res.json({ 
        success: true, 
        messages: [] 
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Не удалось получить сообщения' 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Telegram API running on port ${PORT}`);
});
