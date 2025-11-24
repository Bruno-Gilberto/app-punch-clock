<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\Dashboard;
use App\Http\Controllers\User\LoginController;

Route::get('/user/login', [LoginController::class, 'login']);

// Área do Usuário
Route::middleware(['auth:user'])->group(function () {
    Route::get('/', [Dashboard::class, 'show']);
    Route::get('/user/logout', [LoginController::class, 'logout']);
});
