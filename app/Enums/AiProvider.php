<?php

namespace App\Enums;

enum AiProvider: string
{
    case Gemini = 'gemini';
    case OpenAi = 'openai';
    case Anthropic = 'anthropic';
    case OpenAiCompatible = 'openai_compatible';

    public function label(): string
    {
        return match ($this) {
            self::Gemini => 'Google Gemini',
            self::OpenAi => 'OpenAI',
            self::Anthropic => 'Anthropic Claude',
            self::OpenAiCompatible => 'OpenAI-Compatible Endpoint',
        };
    }

    public function defaultModel(): string
    {
        return match ($this) {
            self::Gemini => 'gemini-2.5-flash',
            self::OpenAi => 'gpt-4o-mini',
            self::Anthropic => 'claude-3-5-sonnet-latest',
            self::OpenAiCompatible => 'gpt-4o-mini',
        };
    }
}
