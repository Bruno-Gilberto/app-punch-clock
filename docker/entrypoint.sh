#!/bin/sh
# wait for mysql server to be available
until mysqladmin ping -h"$DB_HOST" --silent; do
    echo "Waiting for database connection..."
    sleep 2
done

# run migrations
php artisan migrate --force