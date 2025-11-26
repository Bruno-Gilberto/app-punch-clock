<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Dashboard;
use App\Http\Controllers\Admin\LoginController;

Route::get('/admin/login', [LoginController::class, 'login']);

// Área do Administrador
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/', [Dashboard::class, 'show']);
    Route::get('/admin/logout', [LoginController::class, 'logout']);
});