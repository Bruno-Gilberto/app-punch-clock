<?php

use Illuminate\Foundation\{
    Application,
    Configuration\Exceptions,
    Configuration\Middleware
};

use App\Http\Middleware\{
    UserMiddleware,
    AdminMiddleware,
    HandleInertiaRequests,
    RedirectIfAuthenticatedMiddleware
};

use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'user' => UserMiddleware::class,
            'admin' => AdminMiddleware::class,
            'guest' => RedirectIfAuthenticatedMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
