<?php

namespace App\Enums;

enum DiagnosticSeverity: string
{
    case Error = 'error';
    case Warning = 'warning';
    case Info = 'info';
}
