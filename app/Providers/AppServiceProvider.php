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
                'user' => fn () => Auth::guard('user')->user() || Auth::guard('admin')->user() ? [
                    'id' => Auth::guard('user')->user()->id ??  Auth::guard('admin')->user()->id,
                    'name' => Auth::guard('user')->user()->name ?? Auth::guard('admin')->user()->name,
                    'email' =>  Auth::guard('user')->user()->email ?? Auth::guard('admin')->user()->email,
                    'role' => Auth::guard('admin')->check() ? 'admin' : 'user',
                ] : null,
                'appName' => config('app.name'),
                'response' => fn () => session('response'),
                'flash' => fn () => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
                'basePath' => fn () => '/' . request()->segment(1),
            ]);
        }
    }
}
