# 🚀 Deployment Guide

## Подготовка к деплою

### 1. Проверка перед деплоем

```bash
# Установите зависимости
npm install

# Запустите линтер
npm run lint

# Запустите сборку
npm run build

# Протестируйте локально
npm run preview
```

### 2. Проверка PWA

Откройте Chrome DevTools → Application → PWA:
- ✅ Manifest loaded
- ✅ Service Worker registered
- ✅ Icons present
- ✅ Offline working

---

## Деплой на Netlify

### Вариант 1: Через GitHub (рекомендуется)

#### Шаг 1: Подготовка репозитория

```bash
# Инициализация git (если ещё не сделано)
git init
git add .
git commit -m "Initial commit: Weather Dashboard v3.0"

# Создание репозитория на GitHub
# https://github.com/new

# Добавление remote
git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git

# Пуш
git branch -M main
git push -u origin main
```

#### Шаг 2: Подключение к Netlify

1. Перейдите на [Netlify](https://app.netlify.com/)
2. Нажмите **"Add new site"** → **"Import an existing project"**
3. Выберите **GitHub**
4. Найдите ваш репозиторий `weather-dashboard`
5. Настройте параметры:
   - **Branch:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Нажмите **"Deploy site"**

#### Шаг 3: Настройка домена (опционально)

1. В Netlify Dashboard перейдите в **Domain Settings**
2. Добавьте свой домен или используйте `.netlify.app`
3. Настройте HTTPS (автоматически)

---

### Вариант 2: Ручной деплой через Netlify CLI

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Авторизация
netlify login

# Деплой
netlify deploy --prod

# Или с указанием папки
netlify deploy --prod --dir=dist
```

---

### Вариант 3: Drag & Drop

1. Соберите проект: `npm run build`
2. Перейдите на [Netlify Drop](https://app.netlify.com/drop)
3. Перетащите папку `dist`
4. Готово!

---

## Деплой на Vercel

### Через GitHub

1. Перейдите на [Vercel](https://vercel.com/)
2. Нажмите **"Add New Project"**
3. Импортируйте GitHub репозиторий
4. Настройки:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Нажмите **"Deploy"**

### Через Vercel CLI

```bash
npm install -g vercel

# Деплой
vercel

# Production деплой
vercel --prod
```

---

## Деплой на GitHub Pages

### Настройка

```bash
# Установите gh-pages
npm install -D gh-pages

# Добавьте в package.json scripts:
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Запустите деплой
npm run deploy
```

### Обновление base path в vite.config.js

```javascript
export default defineConfig({
  base: '/weather-dashboard/', // замените на имя вашего репозитория
  plugins: [...]
})
```

---

## Переменные окружения

### Для Netlify

В Netlify Dashboard → **Site Settings** → **Environment Variables**:

```bash
# OpenWeatherMap API Key (если используется)
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Другие переменные
VITE_APP_VERSION=3.0.0
```

### Для Vercel

В Vercel Dashboard → **Settings** → **Environment Variables**:

```bash
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

---

## Post-Deploy Checklist

### ✅ После деплоя проверьте:

- [ ] Сайт открывается по HTTPS
- [ ] Service Worker зарегистрирован
- [ ] PWA manifest загружен
- [ ] Иконки отображаются
- [ ] Офлайн режим работает
- [ ] API запросы кэшируются
- [ ] Мобильная версия корректна
- [ ] Lighthouse score > 90

### 🔧 Тестирование PWA

```bash
# Установите http-server для локального тестирования
npm install -g http-server

# Запустите production сборку локально
http-server dist -p 3000

# Откройте https://localhost:3000
# Проверьте в Chrome DevTools → Application
```

### 📊 Lighthouse аудит

1. Откройте Chrome DevTools
2. Перейдите на вкладку **Lighthouse**
3. Выберите категории:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
   - ✅ PWA
4. Нажмите **"Analyze page load"**

**Ожидаемые результаты:**
- Performance: 85-95
- Accessibility: 90-100
- Best Practices: 90-100
- PWA: ✅ All checks pass

---

## Обновление после деплоя

### Автоматическое обновление

Service Worker настроен на `autoUpdate`. Пользователи получат обновление:
- При перезагрузке страницы
- При закрытии и повторном открытии
- Через 24 часа (browser policy)

### Принудительное обновление

В коде уже есть:

```javascript
// В PWAInstall.jsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.update();
  });
}
```

---

## Troubleshooting

### ❌ Service Worker не регистрируется

**Решение:**
1. Проверьте HTTPS (требуется для SW)
2. Очистите кэш браузера
3. Проверьте console на ошибки

### ❌ PWA не устанавливается

**Причины:**
- Нет иконок нужного размера
- Manifest не загружен
- Service Worker не активен
- Не HTTPS соединение

**Решение:**
```bash
# Проверьте manifest.json
curl https://your-site.com/manifest.json

# Проверьте Service Worker
curl https://your-site.com/sw.js
```

### ❌ Картинки не кэшируются

**Решение:**
Проверьте `vite.config.js`:

```javascript
workbox: {
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60
        }
      }
    }
  ]
}
```

---

## Production URL

После деплоя вы получите URL вида:
- **Netlify:** `https://your-site-name.netlify.app`
- **Vercel:** `https://your-site-name.vercel.app`
- **GitHub Pages:** `https://username.github.io/weather-dashboard`

---

## Мониторинг

### Netlify Analytics

Включите в Dashboard → **Analytics**

### Vercel Analytics

Включите в Dashboard → **Analytics**

### Google Analytics

Добавьте в `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## Безопасность

### Заголовки безопасности (уже настроены в netlify.toml)

```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
```

### CORS

Для API запросов:

```javascript
// В vite.config.js добавьте proxy если нужно
server: {
  proxy: {
    '/api': 'https://api.openweathermap.org'
  }
}
```

---

## Поддержка

Вопросы и проблемы:
- GitHub Issues
- Netlify Support
- Vercel Support
