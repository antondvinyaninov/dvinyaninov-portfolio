const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Telegram настройки
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(cors());
app.use(express.json());

// Endpoint для отправки сообщений
app.post('/send-message', async (req, res) => {
  try {
    const { message, name, phone } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Сообщение не может быть пустым' 
      });
    }
    
    // Формируем текст сообщения
    const text = `🔔 Новое сообщение с сайта!\n\n👤 Имя: ${name || 'Не указано'}\n📱 Телефон: ${phone || 'Не указан'}\n💬 Сообщение:\n${message}`;
    
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Telegram API running on port ${PORT}`);
});
