<?php

namespace App\Providers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (!app()->runningInConsole()) {
            Inertia::share([
                'user' => fn () => Auth::user() ? [
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'email' =>  Auth::user()->email,
                ] : null,
                'appName' => config('app.name'),
                'flash' => fn () => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
                'basePath' => fn () => '/' . request()->segment(1),
            ]);
        }
    }
}
