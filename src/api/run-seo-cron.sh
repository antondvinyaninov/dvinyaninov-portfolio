#!/bin/bash

# Скрипт для запуска SEO автоматизации через cron
# Использование: добавьте в crontab:
# 0 9 * * * /Users/dvinyaninov/Проекты/Dvinyaninov/src/api/run-seo-cron.sh

# Переходим в директорию проекта
cd /Users/dvinyaninov/Проекты/Dvinyaninov/src/api

# Загружаем NVM и Node.js
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Устанавливаем PATH
export PATH="$HOME/.nvm/versions/node/v25.2.0/bin:/usr/local/bin:/usr/bin:/bin"

# Запускаем скрипт и сохраняем логи
node seo-automation.js >> /Users/dvinyaninov/seo-automation.log 2>&1

# Добавляем разделитель в лог
echo "-----------------------------------" >> /Users/dvinyaninov/seo-automation.log
echo "Запуск завершён: $(date)" >> /Users/dvinyaninov/seo-automation.log
echo "" >> /Users/dvinyaninov/seo-automation.log
