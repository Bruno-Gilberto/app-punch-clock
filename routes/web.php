<?php

use Inertia\Inertia;

use App\Http\Controllers\Admin\{
    Dashboard as AdminDashboard,
    UserController as AdminUserController,
    LoginController as AdminLoginController,
    ClockLogsController as AdminClockLogsController
};

use App\Http\Controllers\User\{
    Dashboard as UserDashboard,
    LoginController as UserLoginController,
    ClockLogsController as UserClockLogsController
};

use Illuminate\Support\Facades\Route;

Route::get('/admin', function () {
    return Inertia::render('Admin/Auth');
})->name('admin.auth')->middleware('guest:admin');

Route::get('/', function () {
    return Inertia::render('User/Auth');
})->name('user.auth')->middleware('guest:user');

Route::post('/admin/login', [AdminLoginController::class, 'login'])->name('admin.auth.login');
Route::post('/user/login', [UserLoginController::class, 'login'])->name('user.auth.login');

Route::group(['prefix' => 'install', 'as' => 'install.', 'middleware' => ['guest:admin', 'guest:user']], function (){
    Route::post('/', [App\Http\Controllers\Installer\InstallerController::class,'store'])->name('store');
    Route::post('/migrate', [App\Http\Controllers\Installer\InstallerController::class,'migrate'])->name('migrate');

    Route::get('/', [App\Http\Controllers\Installer\InstallerController::class,'index'])->name('index');
    Route::get('/info', [App\Http\Controllers\Installer\InstallerController::class,'show'])->name('show');
    Route::get('/congratulations', [App\Http\Controllers\Installer\InstallerController::class,'congratulations'])->name('congratulations');
});

// Área do Administrador
Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['admin']], function (){
    Route::get('/dashboard', [AdminDashboard::class, 'show'])->name('dashboard');
    Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');
    
    // Rotas CRUD de Usuários
    Route::get('/user/list', [AdminUserController::class, 'index'])->name('user.list');
    Route::post('/user', [AdminUserController::class, 'store'])->name('user.store');
    Route::put('/user/{user}', [AdminUserController::class, 'update'])->name('user.update');
    Route::delete('/user/{user}', [AdminUserController::class, 'destroy'])->name('user.destroy');

    // Rota de registro de ponto
    Route::get('/register/list', [AdminClockLogsController::class, 'show'])->name('register.list');

    //Rota de perfil do administrador
    Route::get('/profile', [AdminDashboard::class, 'profile'])->name('profile');
    Route::put('/profile/{admin}', [AdminDashboard::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/change-password/{admin}', [AdminDashboard::class, 'changePassword'])->name('update.pass');
});

// Área do Usuário
Route::group(['prefix' => 'user', 'as' => 'user.', 'middleware' => ['user']], function (){
    Route::get('/dashboard', [UserDashboard::class, 'show'])->name('dashboard');
    Route::post('/logout', [UserLoginController::class, 'logout'])->name('logout');

    // Rota de registro de ponto
    Route::get('/register/list', [UserClockLogsController::class, 'show'])->name('register.list');
    Route::post('/punch/clock/{user}', [UserClockLogsController::class, 'store'])->name('clock.store');

    // Rota de pefil do usuário
    Route::get('/profile', [UserDashboard::class, 'profile'])->name('profile');
    Route::put('/profile/{user}', [UserDashboard::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/change-password/{user}', [UserDashboard::class, 'changePassword'])->name('update.pass');
});
