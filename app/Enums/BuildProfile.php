<?php

namespace App\Enums;

enum BuildProfile: string
{
    case Standard = 'standard';
    case Research = 'research';
    case Extended = 'extended';
}
