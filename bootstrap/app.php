<?php

use App\Http\Middleware\AuthorityCheck;
use App\Http\Middleware\CustomEnsureValidTenantSession;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetTenantFromUser;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Multitenancy\Http\Middleware\NeedsTenant;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            SetTenantFromUser::class,
        ])
            ->group('tenant', [
                NeedsTenant::class,
                CustomEnsureValidTenantSession::class,
            ]);

        $middleware->alias([
            'AuthorityCheck' => AuthorityCheck::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions) {
        // $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
        //     if (in_array($response->getStatusCode(), [500, 503, 404, 403])) {
        //         return Inertia::render('Error', [
        //             'status' => $response->getStatusCode()
        //         ])->toResponse($request)
        //             ->setStatusCode($response->getStatusCode());
        //     } elseif ($response->getStatusCode() === 419) {
        //         return back()->with([
        //             'message' => 'The page expired, please try again.',
        //         ]);
        //     }

        //     return $response;
        // });
    })->create();
