<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Active Compiler Driver
    |--------------------------------------------------------------------------
    |
    | Supported drivers: "docker", "local"
    | - "docker": Runs TeX Live inside an isolated, non-root Docker container.
    | - "local":  Runs TeX Live binaries directly on the host machine.
    |
    */

    'driver' => env('COMPILER_DRIVER', 'docker'),

    'docker' => [
        'image' => env('COMPILER_DOCKER_IMAGE', 'latexstudio/texlive-worker:latest'),
        'network' => 'none',
        'memory_mb' => (int) env('COMPILER_MEMORY_MB', 1024),
        'cpus' => (float) env('COMPILER_CPUS', 1.0),
        'pids_limit' => (int) env('COMPILER_PIDS_LIMIT', 64),
        'wall_timeout' => (int) env('COMPILER_WALL_TIMEOUT', 60),
        'max_output_mb' => (int) env('COMPILER_MAX_OUTPUT_MB', 100),
    ],

    'local' => [
        'texlive_bin_path' => env('TEXLIVE_BIN_PATH', ''),
        'latexmk_path' => env('LATEXMK_PATH', 'latexmk'),
        'wall_timeout' => (int) env('COMPILER_WALL_TIMEOUT', 60),
        'max_output_mb' => (int) env('COMPILER_MAX_OUTPUT_MB', 100),
    ],

];
