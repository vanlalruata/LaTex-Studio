<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HowItWorksController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Public/HowItWorks');
    }
}
