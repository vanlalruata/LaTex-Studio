<?php

namespace App\Enums;

enum ArtifactType: string
{
    case Pdf = 'pdf';
    case Log = 'log';
    case Synctex = 'synctex';
    case Aux = 'aux';
}
