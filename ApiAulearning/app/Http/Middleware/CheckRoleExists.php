<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleExists
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado',
            ], 401);
        }

        if (!$user->roles()->exists()) {
            return response()->json([
                'message' => 'Usuario no tiene rol válido',
            ], 403);
        }

        return $next($request);
    }
}