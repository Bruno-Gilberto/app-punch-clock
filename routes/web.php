<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    dump(env('DB_HOST'));
    dump(env('DB_PASSWORD'));
    dd(env('DB_USERNAME'));
    return view('welcome');
});

Route::get('install', [App\Http\Controllers\Installer\InstallerController::class,'index'])->name('install.index');
Route::get('install/congratulations', [App\Http\Controllers\Installer\InstallerController::class,'congratulations'])->name('install.congratulations');
Route::get('install/info', [App\Http\Controllers\Installer\InstallerController::class,'show'])->name('install.show');
Route::post('install', [App\Http\Controllers\Installer\InstallerController::class,'store'])->name('install.store');
Route::post('install/migrate', [App\Http\Controllers\Installer\InstallerController::class,'migrate'])->name('install.migrate');
