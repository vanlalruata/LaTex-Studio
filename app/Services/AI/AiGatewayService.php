<?php

namespace App\Services\AI;

use App\Enums\AiProvider;
use App\Models\UserAiCredential;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AiGatewayService
{
    public function complete(UserAiCredential $credential, string $systemPrompt, string $userPrompt): string
    {
        return match ($credential->provider) {
            AiProvider::Gemini => $this->callGemini($credential, $systemPrompt, $userPrompt),
            AiProvider::OpenAi, AiProvider::OpenAiCompatible => $this->callOpenAiCompatible($credential, $systemPrompt, $userPrompt),
            AiProvider::Anthropic => $this->callAnthropic($credential, $systemPrompt, $userPrompt),
        };
    }

    private function callGemini(UserAiCredential $credential, string $systemPrompt, string $userPrompt): string
    {
        $model = urlencode($credential->model);
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$credential->api_key}";

        $response = Http::timeout(45)->post($url, [
            'systemInstruction' => [
                'parts' => [['text' => $systemPrompt]],
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $userPrompt]],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.2,
            ],
        ]);

        if ($response->failed()) {
            throw new RuntimeException('Gemini API error: '.$response->status());
        }

        $text = $response->json('candidates.0.content.parts.0.text');
        if (! is_string($text) || $text === '') {
            throw new RuntimeException('Gemini returned an empty response.');
        }

        return $text;
    }

    private function callOpenAiCompatible(UserAiCredential $credential, string $systemPrompt, string $userPrompt): string
    {
        $baseUrl = rtrim($credential->base_url ?: 'https://api.openai.com/v1', '/');
        $url = "{$baseUrl}/chat/completions";

        $response = Http::timeout(45)
            ->withToken($credential->api_key)
            ->post($url, [
                'model' => $credential->model,
                'temperature' => 0.2,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('OpenAI-compatible API error: '.$response->status());
        }

        $text = $response->json('choices.0.message.content');
        if (! is_string($text) || $text === '') {
            throw new RuntimeException('Provider returned an empty response.');
        }

        return $text;
    }

    private function callAnthropic(UserAiCredential $credential, string $systemPrompt, string $userPrompt): string
    {
        $response = Http::timeout(45)
            ->withHeaders([
                'x-api-key' => $credential->api_key,
                'anthropic-version' => '2023-06-01',
            ])
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => $credential->model,
                'max_tokens' => 2048,
                'system' => $systemPrompt,
                'messages' => [
                    ['role' => 'user', 'content' => $userPrompt],
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Anthropic API error: '.$response->status());
        }

        $text = $response->json('content.0.text');
        if (! is_string($text) || $text === '') {
            throw new RuntimeException('Anthropic returned an empty response.');
        }

        return $text;
    }
}
