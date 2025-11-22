<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    dump(env('DB_HOST'));
    dump(env('DB_PASSWORD'));
    dd(env('DB_USERNAME'));
    return view('welcome');
});
