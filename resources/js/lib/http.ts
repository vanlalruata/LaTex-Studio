export function csrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export interface ApiResult<T> {
    ok: boolean;
    status: number;
    data: T | null;
    message: string | null;
}

async function parse<T>(response: Response): Promise<ApiResult<T>> {
    if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
            message?: string;
        };

        return {
            ok: false,
            status: response.status,
            data: null,
            message: body.message ?? `Request failed (${response.status}).`,
        };
    }

    const data = (await response.json().catch(() => null)) as T | null;

    return { ok: true, status: response.status, data, message: null };
}

export async function apiGet<T>(url: string): Promise<ApiResult<T>> {
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
    });

    return parse<T>(response);
}

export async function apiGetText(url: string): Promise<string | null> {
    const response = await fetch(url, { credentials: 'same-origin' });

    return response.ok ? response.text() : null;
}

export async function apiSend<T>(
    url: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    payload?: Record<string, unknown>,
): Promise<ApiResult<T>> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'X-XSRF-TOKEN': csrfToken(),
    };

    if (payload !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers,
        body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });

    return parse<T>(response);
}