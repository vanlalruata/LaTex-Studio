<?php

namespace App\Services\Compiler;

use App\DTOs\CompilationRequest;
use App\DTOs\CompilationResult;

interface LatexCompilerInterface
{
    public function compile(CompilationRequest $request): CompilationResult;
}
