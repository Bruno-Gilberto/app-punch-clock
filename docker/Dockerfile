#Define the base image
FROM php:8.3-fpm

#Set working directory
WORKDIR /var/www/html

#Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev

#Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

#Install extensions
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

#Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

#Copy existing application directory contents
COPY . /var/www/html

#Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www/html

#Change current user to www-data
USER www-data

#Copy entrypoint script
#COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

#Give execution rights on the entrypoint script
#RUN chmod +x /usr/local/bin/entrypoint.sh

#Define the entrypoint image
#ENTRYPOINT ["entrypoint.sh"]

#Expose port 8000
EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]