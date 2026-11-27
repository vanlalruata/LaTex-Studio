<?php

use App\Services\Compiler\CompilerAdapterFactory;
use App\Services\Compiler\DockerTexLiveAdapter;
use App\Services\Compiler\LatexCompilerInterface;
use App\Services\Compiler\LocalTexLiveAdapter;
use Tests\TestCase;

uses(TestCase::class);

test('factory resolves docker adapter by default', function (): void {
    config()->set('compiler.driver', 'docker');

    $adapter = app(CompilerAdapterFactory::class)->resolve();

    expect($adapter)->toBeInstanceOf(DockerTexLiveAdapter::class);
    expect(app(LatexCompilerInterface::class))->toBeInstanceOf(DockerTexLiveAdapter::class);
});

test('factory resolves local adapter when configured', function (): void {
    config()->set('compiler.driver', 'local');

    $adapter = app(CompilerAdapterFactory::class)->resolve();

    expect($adapter)->toBeInstanceOf(LocalTexLiveAdapter::class);
    expect(app(LatexCompilerInterface::class))->toBeInstanceOf(LocalTexLiveAdapter::class);
});

test('factory throws exception for unsupported driver', function (): void {
    app(CompilerAdapterFactory::class)->resolve('unknown-driver');
})->throws(InvalidArgumentException::class, 'Unsupported compiler driver [unknown-driver].');
