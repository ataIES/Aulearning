<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Aulearning API',
    description: 'API de Aulearning'
)]
#[OA\Server(
    url: 'http://localhost:8000/api/v1',
    description: 'Servidor local'
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Token'
)]
final class ApiDocs
{
}