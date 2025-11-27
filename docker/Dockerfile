# --- Stage 1: Build de Assets ---
# FROM node:20-alpine AS node_build

# RUN mkdir -p /app/public

# Copia tudo que o Vite precisa
# COPY package*.json vite.config.js tailwind.config.js /app/
# COPY resources/ /app/resources/

# WORKDIR /app

# RUN npm ci --force && npm run build

# --- Stage 2: PHP Laravel ---
FROM php:8.3-fpm AS app

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    && docker-php-ext-install zip pdo_mysql

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Instalar composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar projeto inteiro ANTES de rodar composer
COPY . .

# Rodar composer com o código presente
RUN composer install --no-dev --optimize-autoloader

# Permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

RUN npm install && npm run build

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
