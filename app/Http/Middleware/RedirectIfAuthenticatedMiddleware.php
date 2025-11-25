<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticatedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach($guards as $guard){

            if(auth::guard($guard)->check()){
                // Redireciona admins para o dashboard de admin
                if($guard === 'admin') return redirect()->route('admin.dashboard');

                // Redireciona usuários comuns para o dashboard padrão
                return redirect()->route('user.dashboard');
            }
        }

        return $next($request);
    }
}
