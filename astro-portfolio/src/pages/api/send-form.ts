import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        
        // В production используем process.env, в dev - import.meta.env
        const botToken = process.env.TELEGRAM_BOT_TOKEN || import.meta.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID || import.meta.env.TELEGRAM_CHAT_ID;
        
        console.log('Bot token exists:', !!botToken);
        console.log('Chat ID exists:', !!chatId);
        
        if (!botToken || !chatId) {
            console.error('Telegram credentials not configured');
            console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('TELEGRAM')));
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Server configuration error' 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Форматируем сообщение для Telegram
        let message = '🔔 <b>Новая заявка с сайта</b>\n\n';
        
        if (data.projectName) {
            message += `📋 <b>Проект:</b> ${data.projectName}\n\n`;
        }
        
        if (data.name) {
            message += `👤 <b>Имя:</b> ${data.name}\n`;
        }
        
        if (data.phone) {
            message += `📱 <b>Телефон:</b> ${data.phone}\n`;
        }
        
        if (data.contact) {
            message += `📱 <b>Контакт:</b> ${data.contact}\n`;
        }
        
        if (data.email) {
            message += `📧 <b>Email:</b> ${data.email}\n`;
        }
        
        if (data.organization) {
            message += `🏢 <b>Организация:</b> ${data.organization}\n`;
        }
        
        if (data.message) {
            message += `\n💬 <b>Сообщение:</b>\n${data.message}\n`;
        }
        
        message += `\n⏰ ${new Date().toLocaleString('ru-RU')}`;
        
        // Отправляем в Telegram
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
            }),
        });
        
        const result = await response.json();
        
        if (!result.ok) {
            console.error('Telegram API error:', result);
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Failed to send message' 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error processing form:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Internal server error' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
