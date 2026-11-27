<?php

return [

    'github' => [
        'client_id' => env('GITHUB_CLIENT_ID', ''),
        'client_secret' => env('GITHUB_CLIENT_SECRET', ''),
        'authorize_url' => 'https://github.com/login/oauth/authorize',
        'token_url' => 'https://github.com/login/oauth/access_token',
        'api_url' => 'https://api.github.com',
    ],

    'gitlab' => [
        'client_id' => env('GITLAB_CLIENT_ID', ''),
        'client_secret' => env('GITLAB_CLIENT_SECRET', ''),
        'base_url' => rtrim((string) env('GITLAB_BASE_URL', 'https://gitlab.com'), '/'),
    ],

];
